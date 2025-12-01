import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  name: string;
  details: string;
  isDefault: boolean;
}

export default function Payments() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please login to manage payment methods",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleAddPayment = (type: PaymentMethod['type']) => {
    toast({
      title: "Add Payment Method",
      description: `${type.toUpperCase()} payment integration coming soon`,
    });
  };

  const handleRemovePayment = (id: string) => {
    if (window.confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
      toast({ title: "Payment Method Removed", description: "Payment method has been removed" });
    }
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({ ...pm, isDefault: pm.id === id })));
    toast({ title: "Default Payment Updated", description: "Default payment method has been updated" });
  };

  if (isLoading) {
    return (
      <MobileContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </MobileContainer>
    );
  }

  return (
    <div className="page-seamless-wrapper">
      <MobileContainer className="seamless-content-container">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFEDD5] via-[#FFEDD5] to-[#FFEDD5]"></div>
          <div className="relative p-4 pb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/')}
                className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
              >
                <i className="fas fa-chevron-left text-lg font-bold drop-shadow-sm"></i>
              </button>

              <div>
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Payment Methods</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm">Manage your payments</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 pt-8 px-4 py-6" style={{
          background: 'linear-gradient(180deg, rgba(255,237,213,0.8) 0%, rgba(255,240,219,0.7) 5%, rgba(255,243,225,0.6) 10%, rgba(255,246,231,0.5) 15%, rgba(255,248,237,0.4) 20%, rgba(255,250,243,0.3) 25%, rgba(255,252,248,0.2) 30%, rgba(255,254,253,0.1) 40%, white 50%)'
        }}>
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-3">Add Payment Method</h3>
            <div className="grid grid-cols-3 gap-3">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleAddPayment('card')}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-credit-card text-blue-600 text-xl"></i>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Card</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleAddPayment('upi')}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-mobile-alt text-purple-600 text-xl"></i>
                  </div>
                  <p className="text-xs font-medium text-gray-700">UPI</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleAddPayment('wallet')}>
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-wallet text-green-600 text-xl"></i>
                  </div>
                  <p className="text-xs font-medium text-gray-700">Wallet</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-lg mb-3">Saved Payment Methods</h3>
            {paymentMethods.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <i className="fas fa-credit-card text-gray-400 text-xl"></i>
                </div>
                <p className="text-gray-500 text-sm">No saved payment methods</p>
              </div>
            ) : (
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <Card key={method.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            method.type === 'card' ? 'bg-blue-100' : method.type === 'upi' ? 'bg-purple-100' : 'bg-green-100'
                          }`}>
                            <i className={`fas ${
                              method.type === 'card' ? 'fa-credit-card text-blue-600' : 
                              method.type === 'upi' ? 'fa-mobile-alt text-purple-600' : 
                              'fa-wallet text-green-600'
                            }`}></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{method.name}</h4>
                            <p className="text-sm text-gray-600">{method.details}</p>
                          </div>
                        </div>
                        {method.isDefault && (
                          <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">Default</span>
                        )}
                      </div>
                      <div className="flex space-x-2 mt-3">
                        {!method.isDefault && (
                          <Button size="sm" variant="outline" onClick={() => handleSetDefault(method.id)} className="flex-1">
                            Set as Default
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => handleRemovePayment(method.id)} className="text-red-600 hover:text-red-700">
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
        <BottomNav activeTab="profile" />
      </MobileContainer>
    </div>
  );
}