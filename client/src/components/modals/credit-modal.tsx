
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Calendar, DollarSign } from "lucide-react";
import { CreditOption, xtraMartService } from "@/services/xtraMartService";
import { useToast } from "@/hooks/use-toast";

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreditModal({ isOpen, onClose }: CreditModalProps) {
  const [creditOptions] = useState<CreditOption[]>(xtraMartService.getCreditOptions());
  const [requestAmount, setRequestAmount] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const currentCredit = creditOptions[0];
  const usedPercentage = (currentCredit.currentUsed / currentCredit.limit) * 100;
  const availableCredit = currentCredit.limit - currentCredit.currentUsed;

  const handleCreditApplication = async () => {
    if (!requestAmount || parseInt(requestAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid credit amount",
        variant: "destructive"
      });
      return;
    }

    setIsApplying(true);
    try {
      const result = await xtraMartService.applyCreditLimit(parseInt(requestAmount));
      
      toast({
        title: result.success ? "Success!" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive"
      });
      
      if (result.success) {
        setRequestAmount("");
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Monthly Credit Options
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Credit Status */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-blue-900 mb-3">Current Credit Status</h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Credit Limit</span>
                <span className="font-bold text-blue-900">₹{currentCredit.limit.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Used</span>
                <span className="font-medium text-blue-800">₹{currentCredit.currentUsed.toLocaleString()}</span>
              </div>
              
              <Progress value={usedPercentage} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Available</span>
                <span className="font-bold text-green-600">₹{availableCredit.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-600" />
            <div>
              <p className="font-medium text-gray-900">Next Payment Due</p>
              <p className="text-sm text-gray-600">{currentCredit.paymentDue}</p>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Interest Rate</p>
              <p className="text-sm text-green-600">{currentCredit.interestRate}% (No Interest!)</p>
            </div>
          </div>

          {/* Request Credit Increase */}
          <div className="border-t pt-4">
            <h5 className="font-medium mb-3">Request Credit Limit Increase</h5>
            <div className="space-y-3">
              <div>
                <Label htmlFor="creditAmount">Requested Amount</Label>
                <Input
                  id="creditAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={requestAmount}
                  onChange={(e) => setRequestAmount(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <Button
                onClick={handleCreditApplication}
                disabled={isApplying}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isApplying ? "Applying..." : "Apply for Increase"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
