import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useMemo, useState } from "react";
import { useConvex } from "convex/react";
import { useAuth } from "@/hooks/useAuth";

const WalletHistory = () => {
  const { user, profile } = useAuth();
  const convex = useConvex();
  const [payments, setPayments] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!convex || !user) return;
      try {
        const pay = await convex.query('payments:list', { user_id: user.id } as any);
        setPayments(Array.isArray(pay) ? pay : []);
      } catch {}
      try {
        const wd = await convex.query('withdrawals:list', { user_id: user.id } as any);
        setWithdrawals(Array.isArray(wd) ? wd : []);
      } catch {}
    };
    run();
  }, [convex, user]);

  const transactions = useMemo(() => {
    const t1 = payments.map((p) => ({
      id: p._id || p.id,
      type: p.payment_type === 'topup' ? 'deposit' : 'payment',
      amount: p.payment_type === 'topup' ? p.amount : -Math.abs(p.amount),
      description: p.payment_type === 'daily_premium' ? `Daily Premium - ${(profile?.plan_tier || '').toUpperCase()}` : p.payment_type === 'registration' ? 'Registration Fee' : 'Wallet Top-up',
      date: p.created_at,
      status: 'completed'
    }));
    const t2 = withdrawals.map((w) => ({
      id: w._id || w.id,
      type: 'payment',
      amount: -Math.abs(w.amount),
      description: `Withdrawal - ${w.bank_name}`,
      date: w.created_at,
      status: w.status || 'completed'
    }));
    const all = [...t1, ...t2].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return all;
  }, [payments, withdrawals, profile?.plan_tier]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("TransitCare - Transaction History", 14, 22);
    
    // Add date
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Prepare table data
    const tableData = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.type === "deposit" ? "Credit" : "Debit",
      `₦${Math.abs(t.amount).toLocaleString()}`,
      t.status
    ]);
    
    // Add table
    autoTable(doc, {
      startY: 35,
      head: [['Date', 'Description', 'Type', 'Amount', 'Status']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    // Save the PDF
    doc.save(`transitcare-transactions-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-foreground">Transaction History</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={exportToPDF}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export to PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === "deposit" 
                    ? "bg-green-500/10" 
                    : "bg-red-500/10"
                }`}>
                  {transaction.type === "deposit" ? (
                    <ArrowDownLeft className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === "deposit" 
                    ? "text-green-500" 
                    : "text-red-500"
                }`}>
                  {transaction.type === "deposit" ? "+" : ""}₦{Math.abs(transaction.amount).toLocaleString()}
                </p>
                <Badge variant="outline" className="mt-1">
                  {transaction.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletHistory;
