import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { Users, FileText, DollarSign, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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
    const { data, error } = await supabase
      .from("claims")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching claims", variant: "destructive" });
      return;
    }

    // Fetch user profiles separately
    const claimsWithProfiles = await Promise.all(
      (data || []).map(async (claim) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone, vehicle_id")
          .eq("user_id", claim.user_id)
          .single();
        
        return { ...claim, profiles: profile || { full_name: "", phone: "", vehicle_id: "" } };
      })
    );

    setClaims(claimsWithProfiles as any);
  };

  const fetchWithdrawals = async () => {
    const { data, error } = await supabase
      .from("withdrawals")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching withdrawals", variant: "destructive" });
      return;
    }

    // Fetch user profiles separately
    const withdrawalsWithProfiles = await Promise.all(
      (data || []).map(async (withdrawal) => {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("user_id", withdrawal.user_id)
          .single();
        
        return { ...withdrawal, profiles: profile || { full_name: "", phone: "" } };
      })
    );

    setWithdrawals(withdrawalsWithProfiles as any);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching users", variant: "destructive" });
    } else {
      setUsers(data || []);
    }
  };

  const fetchStats = async () => {
    const { data: usersData } = await supabase.from("profiles").select("id");
    const { data: claimsData } = await supabase.from("claims").select("id").eq("claim_status", "pending");
    const { data: paymentsData } = await supabase.from("payments").select("amount");
    const { data: withdrawalsData } = await supabase.from("withdrawals").select("id").eq("status", "pending");

    setStats({
      totalUsers: usersData?.length || 0,
      pendingClaims: claimsData?.length || 0,
      totalPayments: paymentsData?.reduce((sum, p) => sum + Number(p.amount), 0) || 0,
      pendingWithdrawals: withdrawalsData?.length || 0,
    });
  };

  const handleClaimAction = async (claimId: string, action: "approved" | "rejected") => {
    const { error } = await supabase
      .from("claims")
      .update({
        claim_status: action,
        updated_at: new Date().toISOString(),
      })
      .eq("id", claimId);

    if (error) {
      toast({ title: "Error updating claim", variant: "destructive" });
    } else {
      toast({ title: `Claim ${action}`, description: `The claim has been ${action}` });
      setSelectedClaim(null);
      fetchData();
    }
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: "approved" | "rejected") => {
    const { error } = await supabase
      .from("withdrawals")
      .update({
        status: action,
        admin_notes: adminNotes,
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", withdrawalId);

    if (error) {
      toast({ title: "Error updating withdrawal", variant: "destructive" });
    } else {
      toast({ title: `Withdrawal ${action}`, description: `The withdrawal has been ${action}` });
      setSelectedWithdrawal(null);
      setAdminNotes("");
      fetchData();
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
                    {claims.map((claim) => (
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
