import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function Addresses() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please login to manage addresses",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAddresses(prev => prev.map(addr => 
        addr.id === editingId ? { ...formData, id: editingId } : addr
      ));
      toast({ title: "Address Updated", description: "Address has been updated successfully" });
    } else {
      const newAddress = { ...formData, id: Date.now().toString() };
      setAddresses(prev => [...prev, newAddress]);
      toast({ title: "Address Added", description: "New address has been added successfully" });
    }
    setShowAddForm(false);
    setEditingId(null);
    setFormData({ name: "", phone: "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "", isDefault: false });
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      toast({ title: "Address Deleted", description: "Address has been removed" });
    }
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFEDD5] via-[#FFF4E6] to-[#FFF9F0]"></div>
          <div className="relative p-4 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/')}
                  className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
                >
                  <i className="fas fa-chevron-left text-lg font-bold drop-shadow-sm"></i>
                </button>

                <div>
                  <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Saved Addresses</h1>
                  <p className="text-orange-400 text-sm font-medium drop-shadow-sm">Manage delivery locations</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-white/30 text-white hover:bg-white/40 backdrop-blur-md border border-white/50"
              >
                <i className="fas fa-plus mr-2"></i>
                Add
              </Button>
            </div>
          </div>
        </div>

        <div className="relative bg-gradient-to-b from-transparent via-white/60 to-white -mt-6 pt-8 px-4 py-6">
          {showAddForm && (
            <Card className="mb-4 shadow-lg">
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-4">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Address Line 1</Label>
                    <Input value={formData.addressLine1} onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Address Line 2 (Optional)</Label>
                    <Input value={formData.addressLine2} onChange={(e) => setFormData({...formData, addressLine2: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>City</Label>
                      <Input value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} required />
                    </div>
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} required />
                  </div>
                  <div className="flex space-x-2">
                    <Button type="submit" className="flex-1 fuel-yellow fuel-yellow-hover text-white">
                      {editingId ? 'Update' : 'Save'} Address
                    </Button>
                    <Button type="button" variant="outline" onClick={() => { setShowAddForm(false); setEditingId(null); }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {addresses.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <i className="fas fa-map-marker-alt text-green-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No saved addresses</h3>
              <p className="text-gray-500 text-sm mb-6">Add your delivery addresses here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <Card key={address.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{address.name}</h4>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      </div>
                      {address.isDefault && (
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full font-bold">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{address.addressLine1}</p>
                    {address.addressLine2 && <p className="text-sm text-gray-700 mb-1">{address.addressLine2}</p>}
                    <p className="text-sm text-gray-700">{address.city}, {address.state} - {address.pincode}</p>
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(address)} className="flex-1">
                        <i className="fas fa-edit mr-2"></i>Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(address.id)} className="text-red-600 hover:text-red-700">
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        <BottomNav activeTab="profile" />
      </MobileContainer>
    </div>
  );
}