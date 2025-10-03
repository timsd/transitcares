import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const defaultLimits: Record<string, RateLimitConfig> = {
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  payment: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 requests per hour
  claim: { maxRequests: 3, windowMs: 24 * 60 * 60 * 1000 }, // 3 requests per day
  withdrawal: { maxRequests: 5, windowMs: 24 * 60 * 60 * 1000 }, // 5 requests per day
};

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (
  identifier: string,
  action: string
): { allowed: boolean; resetTime?: number } => {
  const config = defaultLimits[action] || { maxRequests: 100, windowMs: 60 * 1000 };
  const key = `${identifier}:${action}`;
  const now = Date.now();

  const existing = rateLimitStore.get(key);

  if (!existing || now > existing.resetTime) {
    // First request or window expired
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { allowed: true };
  }

  if (existing.count >= config.maxRequests) {
    return { allowed: false, resetTime: existing.resetTime };
  }

  existing.count++;
  rateLimitStore.set(key, existing);
  return { allowed: true };
};

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { identifier, action } = await req.json();

    if (!identifier || !action) {
      return new Response(
        JSON.stringify({ error: "Missing identifier or action" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const result = checkRateLimit(identifier, action);

    if (!result.allowed) {
      const resetIn = result.resetTime
        ? Math.ceil((result.resetTime - Date.now()) / 1000)
        : 0;

      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          resetIn,
          message: `Too many ${action} attempts. Please try again in ${resetIn} seconds.`,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": resetIn.toString(),
            ...corsHeaders,
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ allowed: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in rate-limit function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
