import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  to: string;
  subject: string;
  type: "registration" | "payment" | "claim" | "withdrawal" | "compliance";
  data: Record<string, any>;
}

const getEmailTemplate = (type: string, data: Record<string, any>) => {
  switch (type) {
    case "registration":
      return `
        <h1>Welcome to TransitCares!</h1>
        <p>Your registration has been completed successfully.</p>
        <p>Vehicle ID: ${data.vehicle_id || "N/A"}</p>
        <p>You can now start making daily premium payments.</p>
      `;
    
    case "payment":
      return `
        <h1>Payment Received</h1>
        <p>We have received your payment of ₦${data.amount?.toLocaleString()}.</p>
        <p>Payment Type: ${data.payment_type}</p>
        <p>Your wallet balance: ₦${data.wallet_balance?.toLocaleString()}</p>
      `;
    
    case "claim":
      return `
        <h1>Claim ${data.status}</h1>
        <p>Your claim for ₦${data.amount?.toLocaleString()} has been ${data.status}.</p>
        ${data.admin_notes ? `<p>Admin Notes: ${data.admin_notes}</p>` : ""}
        <p>Claim Type: ${data.claim_type}</p>
      `;
    
    case "withdrawal":
      return `
        <h1>Withdrawal Request ${data.status}</h1>
        <p>Your withdrawal request for ₦${data.amount?.toLocaleString()} has been ${data.status}.</p>
        <p>Bank: ${data.bank_name}</p>
        <p>Account: ${data.account_number}</p>
        ${data.admin_notes ? `<p>Admin Notes: ${data.admin_notes}</p>` : ""}
      `;
    
    case "compliance":
      return `
        <h1>Weekly Compliance Reminder</h1>
        <p>This is a reminder to make your daily premium payment.</p>
        <p>Days paid this week: ${data.days_paid || 0}/4</p>
        <p>Keep your coverage active by paying for at least 4 consecutive days.</p>
      `;
    
    default:
      return `<p>${data.message || "You have a new notification from TransitCares"}</p>`;
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, type, data }: NotificationRequest = await req.json();

    if (!to || !subject || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const html = getEmailTemplate(type, data);

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: "TransitCares <onboarding@resend.dev>",
        to: [to],
        subject,
        html,
      }),
    });

    const responseData = await emailResponse.json();
    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
