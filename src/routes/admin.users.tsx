import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '@/../convex/_generated/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function UsersList() {
  const profiles = useQuery(api.functions.profiles.list, {} as any) || []
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(profiles as any[]).map((p) => (
                <div key={p._id || p.id} className="flex justify-between border rounded p-3">
                  <span className="text-sm text-muted-foreground">{p.full_name || p.user_id}</span>
                  <span className="text-sm">{p.phone || ''}</span>
                  <span className="text-sm">{(p.plan_tier || '').toUpperCase()}</span>
                </div>
              ))}
              {(profiles as any[]).length === 0 && (
                <p className="text-sm text-muted-foreground">No users found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export const Route = createFileRoute('/admin/users')({
  loader: async () => ({ serverTime: new Date().toISOString() }),
  component: UsersList,
})

