import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function ClaimsList() {
  const claims = useQuery(api.functions.claims.list, {} as any) || []
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>All Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(claims as any[]).map((c) => (
                <div key={c._id || c.id} className="flex justify-between border rounded p-3">
                  <span className="text-sm text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
                  <span className="text-sm">{c.claim_type}</span>
                  <span className="text-sm">₦{Number(c.claim_amount || 0).toLocaleString()}</span>
                  <span className="text-xs">{c.claim_status}</span>
                </div>
              ))}
              {(claims as any[]).length === 0 && (
                <p className="text-sm text-muted-foreground">No claims found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export const Route = createFileRoute('/admin/claims')({
  loader: async () => ({ serverTime: new Date().toISOString() }),
  component: ClaimsList,
})

