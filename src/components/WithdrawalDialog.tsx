import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

interface WithdrawalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WithdrawalDialog = ({ open, onOpenChange }: WithdrawalDialogProps) => {
  const { profile, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  // Update form when profile loads
  useState(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        bankName: profile.bank_name || "",
        accountNumber: profile.account_number || "",
        accountName: profile.account_name || "",
      }));
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const amount = parseFloat(formData.amount);
    const walletBalance = Number(profile?.wallet_balance || 0);

    if (amount <= 0) {
      toast({ title: "Invalid amount", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (amount > walletBalance) {
      toast({ 
        title: "Insufficient balance", 
        description: `Your wallet balance is ₦${walletBalance.toLocaleString()}`,
        variant: "destructive" 
      });
      setLoading(false);
      return;
    }

    // Update bank details in profile if changed
    const needsUpdate = 
      formData.bankName !== (profile?.bank_name || "") || 
      formData.accountNumber !== (profile?.account_number || "") ||
      formData.accountName !== (profile?.account_name || "");
    
    if (needsUpdate) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          bank_name: formData.bankName,
          account_number: formData.accountNumber,
          account_name: formData.accountName,
        })
        .eq("user_id", user?.id);

      if (profileError) {
        toast({ title: "Error updating bank details", variant: "destructive" });
        setLoading(false);
        return;
      }
    }

    // Create withdrawal request
    const { error } = await supabase.from("withdrawals").insert({
      user_id: user?.id,
      amount,
      bank_name: formData.bankName,
      account_number: formData.accountNumber,
      account_name: formData.accountName,
      status: "pending",
    });

    if (error) {
      toast({ title: "Error creating withdrawal request", variant: "destructive" });
    } else {
      toast({ 
        title: "Withdrawal Request Submitted", 
        description: "Your request will be reviewed by admin" 
      });
      onOpenChange(false);
      setFormData({ amount: "", bankName: "", accountNumber: "", accountName: "" });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Request Withdrawal
          </DialogTitle>
          <DialogDescription>
            Available balance: ₦{Number(profile?.wallet_balance || 0).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
              min="1"
              step="0.01"
            />
          </div>
          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              placeholder="Enter bank name"
              required
            />
          </div>
          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              placeholder="0000000000"
              required
            />
          </div>
          <div>
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              placeholder="Account holder name"
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
