import { useEffect, useState } from "react";
import { useNavigate } from "@/lib/navigation";
// supabase removed in favor of local storage during migration
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Users, FileText, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, Search } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useConvex } from "convex/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Claim {
  id: string;
  user_id: string;
  claim_type: string;
  claim_amount: number;
  claim_status: string;
  description: string;
  created_at: string;
  profiles: {
    full_name: string;
    phone: string;
    vehicle_id: string;
  };
}

interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    phone: string;
  };
}

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  vehicle_id: string;
  registration_status: string;
  wallet_balance: number;
  created_at: string;
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingClaims: 0,
    totalPayments: 0,
    pendingWithdrawals: 0,
  });
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const convex = useConvex();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You must be an admin to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    await Promise.all([fetchClaims(), fetchWithdrawals(), fetchUsers(), fetchStats()]);
  };

  const fetchClaims = async () => {
    let raw = [] as any[]
    if (convex) {
      try {
        raw = await convex.query('claims:list', { user_id: undefined } as any)
      } catch {}
    } else {
      raw = JSON.parse(localStorage.getItem('claims') || '[]')
    }
    const mapped: Claim[] = raw.map((c: any) => {
      const uid = c.user_id
      const profKey = uid ? 'profile:' + uid : null
      const prof = profKey ? JSON.parse(localStorage.getItem(profKey) || '{}') : {}
      return {
        id: c.id,
        user_id: uid,
        claim_type: c.claim_type ?? c.type ?? 'Repair',
        claim_amount: Number(c.claim_amount ?? c.amount ?? 0),
        claim_status: c.claim_status ?? c.status ?? 'pending',
        description: c.description ?? '',
        created_at: c.created_at ?? c.date ?? new Date().toISOString(),
        profiles: {
          full_name: prof.full_name || c.profiles?.full_name || '',
          phone: prof.phone || c.profiles?.phone || '',
          vehicle_id: prof.vehicle_id || c.profiles?.vehicle_id || '',
        },
      }
    })
    setClaims(mapped)
  };

  const fetchWithdrawals = async () => {
    let raw = [] as any[]
    if (convex) {
      try {
        raw = await convex.query('withdrawals:list', { user_id: undefined } as any)
      } catch {}
    } else {
      raw = JSON.parse(localStorage.getItem('withdrawals') || '[]')
    }
    const mapped: Withdrawal[] = raw.map((w: any) => {
      const uid = w.user_id
      const profKey = uid ? 'profile:' + uid : null
      const prof = profKey ? JSON.parse(localStorage.getItem(profKey) || '{}') : {}
      return {
        id: w.id,
        user_id: uid,
        amount: Number(w.amount ?? 0),
        bank_name: w.bank_name ?? '',
        account_number: w.account_number ?? '',
        account_name: w.account_name ?? '',
        status: w.status ?? 'pending',
        created_at: w.created_at ?? new Date().toISOString(),
        profiles: {
          full_name: prof.full_name || w.profiles?.full_name || '',
          phone: prof.phone || w.profiles?.phone || '',
        },
      }
    })
    setWithdrawals(mapped)
  };

  const fetchUsers = async () => {
    if (convex) {
      try {
        const data = await convex.query('profiles:list', {} as any)
        setUsers(data as any)
        return
      } catch {}
    }
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('profile:'))
    const data = keys.map((k) => JSON.parse(localStorage.getItem(k) || '{}'))
    setUsers(data)
  };

  const fetchStats = async () => {
    const usersData = Object.keys(localStorage).filter((k) => k.startsWith('profile:'))
    const claimsData = JSON.parse(localStorage.getItem('claims') || '[]')
    const paymentsData = JSON.parse(localStorage.getItem('payments') || '[]')
    const withdrawalsData = JSON.parse(localStorage.getItem('withdrawals') || '[]')
    setStats({
      totalUsers: usersData.length,
      pendingClaims: claimsData.filter((c: any) => (c.claim_status ?? c.status) === 'pending').length,
      totalPayments: paymentsData.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0),
      pendingWithdrawals: withdrawalsData.filter((w: any) => w.status === 'pending').length,
    })
  };

  const handleClaimAction = async (claimId: string, action: "approved" | "rejected") => {
    if (convex) {
      try {
        await convex.mutation('claims:updateStatus', { id: claimId as any, status: action } as any)
        toast({ title: `Claim ${action}`, description: `The claim has been ${action}` })
        setSelectedClaim(null)
        fetchData()
        return
      } catch {}
    }
    const claims = JSON.parse(localStorage.getItem('claims') || '[]')
    const idx = claims.findIndex((c: any) => c.id === claimId)
    if (idx >= 0) {
      claims[idx] = { ...claims[idx], claim_status: action, updated_at: new Date().toISOString() }
      localStorage.setItem('claims', JSON.stringify(claims))
      toast({ title: `Claim ${action}`, description: `The claim has been ${action}` })
      setSelectedClaim(null)
      fetchData()
    } else {
      toast({ title: "Error updating claim", variant: "destructive" })
    }
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: "approved" | "rejected") => {
    if (convex) {
      try {
        await convex.mutation('withdrawals:updateStatus', { id: withdrawalId as any, status: action, admin_notes: adminNotes, approved_by: user?.id } as any)
        toast({ title: `Withdrawal ${action}`, description: `The withdrawal has been ${action}` })
        setSelectedWithdrawal(null)
        setAdminNotes("")
        fetchData()
        return
      } catch {}
    }
    const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]')
    const idx = withdrawals.findIndex((w: any) => w.id === withdrawalId)
    if (idx >= 0) {
      withdrawals[idx] = {
        ...withdrawals[idx],
        status: action,
        admin_notes: adminNotes,
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      localStorage.setItem('withdrawals', JSON.stringify(withdrawals))
      toast({ title: `Withdrawal ${action}`, description: `The withdrawal has been ${action}` })
      setSelectedWithdrawal(null)
      setAdminNotes("")
      fetchData()
    } else {
      toast({ title: "Error updating withdrawal", variant: "destructive" })
    }
  };

  if (loading || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Admin Dashboard
        </h1>

        <div className="flex gap-3 mb-6">
          <Button variant="outline" onClick={async () => {
            if (!convex) return
            try {
              const claims = JSON.parse(localStorage.getItem('claims') || '[]')
              for (const c of claims) {
                await convex.mutation('claims:create', { user_id: c.user_id, claim_type: c.claim_type || c.type || 'Repair', claim_amount: Number(c.claim_amount ?? c.amount ?? 0), description: c.description || '' } as any)
              }
              const withdrawals = JSON.parse(localStorage.getItem('withdrawals') || '[]')
              for (const w of withdrawals) {
                await convex.mutation('withdrawals:create', { user_id: w.user_id, amount: Number(w.amount || 0), bank_name: w.bank_name || '', account_number: w.account_number || '', account_name: w.account_name || '' } as any)
              }
              const payments = JSON.parse(localStorage.getItem('payments') || '[]')
              for (const p of payments) {
                await convex.mutation('payments:record', { user_id: p.user_id, amount: Number(p.amount || 0), payment_type: p.payment_type || 'topup', plan_tier: p.plan_tier || '' } as any)
              }
              toast({ title: 'Migration complete' })
              await fetchData()
            } catch (e: any) {
              toast({ title: 'Migration error', description: e.message, variant: 'destructive' })
            }
          }}>Migrate local data to Convex</Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingClaims}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦{stats.totalPayments.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingWithdrawals}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="claims" className="space-y-4">
          <TabsList>
            <TabsTrigger value="claims">Claims</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="claims">
            <Card>
              <CardHeader>
                <CardTitle>Claims Management</CardTitle>
                <CardDescription>Review and approve insurance claims</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claims
                      .filter((c) => (statusFilter ? (c.claim_status ?? c.status) === statusFilter : true))
                      .filter((c) => (search ? (c.profiles?.full_name || "").toLowerCase().includes(search.toLowerCase()) || (c.profiles?.vehicle_id || "").toLowerCase().includes(search.toLowerCase()) : true))
                      .map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{claim.profiles?.full_name}</div>
                            <div className="text-sm text-muted-foreground">{claim.profiles?.vehicle_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{claim.claim_type}</TableCell>
                        <TableCell>₦{Number(claim.claim_amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            claim.claim_status === "approved" ? "default" :
                            claim.claim_status === "rejected" ? "destructive" : "secondary"
                          }>
                            {claim.claim_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(claim.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {claim.claim_status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => setSelectedClaim(claim)}
                            >
                              Review
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center border border-border rounded px-2 py-1">
                    <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or vehicle" className="bg-transparent outline-none text-sm" />
                  </div>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-border rounded px-2 py-1 text-sm">
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <Button variant="outline" size="sm" onClick={() => { setSearch(""); setStatusFilter("") }}>Reset</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals">
            <Card>
              <CardHeader>
                <CardTitle>Withdrawal Requests</CardTitle>
                <CardDescription>Review and process withdrawal requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Bank Details</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {withdrawals.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{withdrawal.profiles?.full_name}</div>
                            <div className="text-sm text-muted-foreground">{withdrawal.profiles?.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{withdrawal.bank_name}</div>
                            <div className="text-sm text-muted-foreground">{withdrawal.account_number}</div>
                            <div className="text-sm text-muted-foreground">{withdrawal.account_name}</div>
                          </div>
                        </TableCell>
                        <TableCell>₦{Number(withdrawal.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={
                            withdrawal.status === "approved" || withdrawal.status === "completed" ? "default" :
                            withdrawal.status === "rejected" ? "destructive" : "secondary"
                          }>
                            {withdrawal.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(withdrawal.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {withdrawal.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => setSelectedWithdrawal(withdrawal)}
                            >
                              Review
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Vehicle ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Registered</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.full_name}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.vehicle_id || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={
                            user.registration_status === "completed" ? "default" :
                            user.registration_status === "pending" ? "secondary" : "outline"
                          }>
                            {user.registration_status}
                          </Badge>
                        </TableCell>
                        <TableCell>₦{Number(user.wallet_balance || 0).toLocaleString()}</TableCell>
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Claim Review Dialog */}
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Claim</DialogTitle>
            <DialogDescription>
              Review the claim details and approve or reject
            </DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-4">
              <div>
                <strong>User:</strong> {selectedClaim.profiles?.full_name}
              </div>
              <div>
                <strong>Vehicle:</strong> {selectedClaim.profiles?.vehicle_id}
              </div>
              <div>
                <strong>Type:</strong> {selectedClaim.claim_type}
              </div>
              <div>
                <strong>Amount:</strong> ₦{Number(selectedClaim.claim_amount).toLocaleString()}
              </div>
              <div>
                <strong>Description:</strong> {selectedClaim.description}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => selectedClaim && handleClaimAction(selectedClaim.id, "rejected")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={() => selectedClaim && handleClaimAction(selectedClaim.id, "approved")}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Review Dialog */}
      <Dialog open={!!selectedWithdrawal} onOpenChange={() => setSelectedWithdrawal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Withdrawal</DialogTitle>
            <DialogDescription>
              Review the withdrawal request and approve or reject
            </DialogDescription>
          </DialogHeader>
          {selectedWithdrawal && (
            <div className="space-y-4">
              <div>
                <strong>User:</strong> {selectedWithdrawal.profiles?.full_name}
              </div>
              <div>
                <strong>Amount:</strong> ₦{Number(selectedWithdrawal.amount).toLocaleString()}
              </div>
              <div>
                <strong>Bank:</strong> {selectedWithdrawal.bank_name}
              </div>
              <div>
                <strong>Account Number:</strong> {selectedWithdrawal.account_number}
              </div>
              <div>
                <strong>Account Name:</strong> {selectedWithdrawal.account_name}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Admin Notes</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes (optional)"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={() => selectedWithdrawal && handleWithdrawalAction(selectedWithdrawal.id, "rejected")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={() => selectedWithdrawal && handleWithdrawalAction(selectedWithdrawal.id, "approved")}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
