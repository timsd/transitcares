import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@/lib/navigation";
import { toast } from "sonner";
import { useConvex } from "convex/react";
import { api } from "../../convex/_generated/api";

const ClaimsCenter = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [recentClaims, setRecentClaims] = useState<Array<any>>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadedKey, setUploadedKey] = useState<string | null>(null)
  const convex = useConvex()
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      if (convex && user) {
        try {
          const claims = await convex.query(api.claims.list, { user_id: user.id } as any)
          setRecentClaims(claims as any)
          try {
            const pay = await convex.query('payments:list', { user_id: user.id } as any)
            setPayments(Array.isArray(pay) ? pay : [])
          } catch {}
          return
        } catch {}
      }
      const claims = JSON.parse(localStorage.getItem('claims') || '[]');
      setRecentClaims(claims);
    }
    load()
  }, [convex, user?.id]);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const startOfWeek = useMemo(() => {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const s = new Date(d.setDate(diff))
    s.setHours(0,0,0,0)
    return s
  }, [])
  const startOfPrevWeek = useMemo(() => {
    const s = new Date(startOfWeek)
    s.setDate(s.getDate() - 7)
    return s
  }, [startOfWeek])
  const endOfPrevWeek = useMemo(() => {
    const e = new Date(startOfPrevWeek)
    e.setDate(e.getDate() + 6)
    e.setHours(23,59,59,999)
    return e
  }, [startOfPrevWeek])
  const selectedDays = (profile as any)?.payment_days || []
  const prevWeekSelectedPayments = useMemo(() => {
    const list = payments.filter(p => p.payment_type === 'daily_premium')
    return list.filter(p => {
      const dt = new Date(p.created_at)
      const within = dt >= startOfPrevWeek && dt <= endOfPrevWeek
      if (!within) return false
      const dayName = daysOfWeek[dt.getDay() === 0 ? 6 : dt.getDay() - 1]
      return selectedDays.includes(dayName)
    }).length
  }, [payments, selectedDays, startOfPrevWeek, endOfPrevWeek])
  const penaltyActive = selectedDays.length > 0 && prevWeekSelectedPayments < 4

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-transport-green/10 text-transport-green border-transport-green/20';
      case 'processing': return 'bg-transport-orange/10 text-transport-orange border-transport-orange/20';
      case 'pending': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <section id="claims" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Claims Center
          </h2>
          <p className="text-muted-foreground">
            Submit new claims and track existing ones
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submit New Claim */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Submit New Claim
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-medium text-foreground mb-2">
                  Upload Invoice from Approved Mechanic
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your invoice here, or click to browse
                </p>
                <input ref={fileInputRef} type="file" className="hidden" onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (!user) return navigate('/auth')
                  const hasVehicle = !!(profile?.vehicle_type && profile?.vehicle_id)
                  if (!hasVehicle) return navigate('/profile')
                  try {
                    const form = new FormData()
                    form.append('file', file)
                    const jwt = localStorage.getItem('auth_token') || ''
                    const res = await fetch((import.meta.env.VITE_R2_WORKER_URL as string || '') + '/upload', {
                      method: 'POST',
                      headers: { 'Authorization': `Bearer ${jwt}` },
                      body: form,
                    })
                    if (!res.ok) throw new Error('Upload failed')
                    const data = await res.json()
                    setUploadedKey(data.key)
                    toast.success('Invoice uploaded')
                  } catch (err: any) {
                    toast.error('Upload error', { description: err.message })
                  }
                }} />
                <Button variant="outline" size="sm" onClick={() => {
                  if (!user) return navigate('/auth');
                  const hasVehicle = !!(profile?.vehicle_type && profile?.vehicle_id);
                  if (!hasVehicle) return navigate('/profile');
                  fileInputRef.current?.click()
                }}>
                  Choose File
                </Button>
                {uploadedKey && (
                  <p className="text-xs text-muted-foreground mt-2">Uploaded: {uploadedKey}</p>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    📋 Required Documents:
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Invoice from approved mechanic</li>
                    <li>• Photos of damage (if applicable)</li>
                    <li>• Police report (for theft/accident)</li>
                  </ul>
                </div>
              </div>

              <Button variant="transport" className="w-full" disabled={penaltyActive} onClick={async () => {
                if (!user) return navigate('/auth');
                const hasVehicle = !!(profile?.vehicle_type && profile?.vehicle_id);
                if (!hasVehicle) return navigate('/profile');
                if (penaltyActive) {
                  toast.error('Claims temporarily disabled', {
                    description: 'Complete 4 selected-day payments in a week to re-enable claims next cycle.'
                  })
                  return
                }
                if (convex) {
                  try {
                    await convex.mutation(api.claims.create, {
                      user_id: user.id,
                      claim_type: 'Repair',
                      claim_amount: 0,
                      description: uploadedKey ? `Invoice: ${uploadedKey}` : 'Submitted claim pending admin review',
                    } as any)
                    const claims = await convex.query(api.claims.list, { user_id: user.id } as any)
                    setRecentClaims(claims as any)
                    return
                  } catch {}
                }
                const claims = JSON.parse(localStorage.getItem('claims') || '[]');
                const claim = {
                  id: 'CLM-' + Date.now(),
                  created_at: new Date().toISOString(),
                  claim_type: 'Repair',
                  claim_amount: 0,
                  claim_status: 'pending',
                  description: uploadedKey ? `Invoice: ${uploadedKey}` : 'Submitted claim pending admin review',
                  user_id: user.id,
                  profiles: {
                    full_name: profile?.full_name || user.email,
                    phone: profile?.phone || '',
                    vehicle_id: profile?.vehicle_id || '',
                  },
                  invoice_key: uploadedKey || null,
                };
                claims.unshift(claim);
                localStorage.setItem('claims', JSON.stringify(claims));
                setRecentClaims(claims);
              }}>
                Submit Claim
              </Button>
            </CardContent>
          </Card>

          {/* Recent Claims */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Recent Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClaims.length === 0 && (
                  <p className="text-sm text-muted-foreground">No claims yet</p>
                )}
                {recentClaims.map((claim) => (
                  <div key={claim.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{claim.claim_type || claim.type}</p>
                        <p className="text-sm text-muted-foreground">{claim.id}</p>
                      </div>
                      <Badge className={getStatusColor(claim.claim_status || claim.status)}>
                        {getStatusIcon(claim.claim_status || claim.status)}
                        {claim.claim_status || claim.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {claim.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          ₦{Number((claim.claim_amount ?? claim.amount) || 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Filed on {new Date(claim.created_at || claim.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-6">
                View All Claims
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ClaimsCenter;
