
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

export default function ContactInfo() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    alternatePhone: "",
  });

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showPhotoDialog, setShowPhotoDialog] = useState(false);
  const [photoScale, setPhotoScale] = useState(1);
  const [photoRotation, setPhotoRotation] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        alternatePhone: "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
        setShowPhotoDialog(true);
        setPhotoScale(1);
        setPhotoRotation(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoSave = () => {
    setShowPhotoDialog(false);
    toast({
      title: "Photo Updated",
      description: "Your profile photo has been updated successfully",
    });
  };

  const handlePhotoRemove = () => {
    setProfilePhoto(null);
    setShowPhotoDialog(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = () => {
    toast({
      title: "Contact Info Updated",
      description: "Your contact information has been saved successfully",
    });
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
        {/* Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFEDD5] via-[#FFEDD5] to-[#FFEDD5]"></div>
          <div className="relative p-4 pb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/profile')}
                className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
              >
                <i className="fas fa-chevron-left text-lg font-bold drop-shadow-sm"></i>
              </button>

              <div>
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Contact Information</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm">Update your details</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 pt-8 px-4 py-6" style={{
          background: 'linear-gradient(180deg, rgba(255,237,213,0.8) 0%, rgba(255,240,219,0.7) 5%, rgba(255,243,225,0.6) 10%, rgba(255,246,231,0.5) 15%, rgba(255,248,237,0.4) 20%, rgba(255,250,243,0.3) 25%, rgba(255,252,248,0.2) 30%, rgba(255,254,253,0.1) 40%, white 50%)'
        }}>
          {/* User Profile Photo */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div 
                className="w-24 h-24 flex items-center justify-center mx-auto mb-3 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => fileInputRef.current?.click()}
              >
                {profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${photoScale}) rotate(${photoRotation}deg)`
                    }}
                  />
                ) : (
                  <i className="fas fa-user text-white text-3xl"></i>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <i className="fas fa-camera text-orange-500 text-sm"></i>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">Tap the camera icon to upload a photo</p>
            {profilePhoto && (
              <div className="flex gap-2 justify-center mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowPhotoDialog(true)}
                  className="text-xs"
                >
                  <i className="fas fa-edit mr-1"></i>
                  Adjust Photo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePhotoRemove}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  <i className="fas fa-trash mr-1"></i>
                  Remove
                </Button>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alternate Phone Number (Optional)
                </label>
                <Input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.alternatePhone}
                  onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Contact Options */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-200"
                onClick={() => window.open(`tel:${formData.phone}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <i className="fas fa-phone text-primary text-2xl w-8 flex items-center justify-center"></i>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Call Primary Number</h3>
                      <p className="text-sm text-gray-600">{formData.phone || "No number added"}</p>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400"></i>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-200"
                onClick={() => window.open(`mailto:${formData.email}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <i className="fas fa-envelope text-primary text-2xl w-8 flex items-center justify-center"></i>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">Send Email</h3>
                      <p className="text-sm text-gray-600">{formData.email}</p>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400"></i>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Save Button */}
          <div className="mb-24">
            <Button 
              onClick={handleSave}
              className="w-full h-12 rounded-lg font-semibold bg-primary hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </div>
        </div>

        <BottomNav activeTab="profile" />
      </MobileContainer>

      {/* Photo Adjustment Dialog */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust Your Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Photo Preview */}
            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-100 border-4 border-orange-200">
                {profilePhoto && (
                  <img
                    src={profilePhoto}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${photoScale}) rotate(${photoRotation}deg)`,
                      transition: 'transform 0.2s ease'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Zoom Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Zoom</label>
                <span className="text-sm text-gray-500">{Math.round(photoScale * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-search-minus text-gray-400"></i>
                <Slider
                  value={[photoScale]}
                  onValueChange={(value) => setPhotoScale(value[0])}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="flex-1"
                />
                <i className="fas fa-search-plus text-gray-400"></i>
              </div>
            </div>

            {/* Rotation Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Rotation</label>
                <span className="text-sm text-gray-500">{photoRotation}°</span>
              </div>
              <div className="flex items-center gap-3">
                <i className="fas fa-undo text-gray-400"></i>
                <Slider
                  value={[photoRotation]}
                  onValueChange={(value) => setPhotoRotation(value[0])}
                  min={-180}
                  max={180}
                  step={15}
                  className="flex-1"
                />
                <i className="fas fa-redo text-gray-400"></i>
              </div>
            </div>

            {/* Quick Rotation Buttons */}
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPhotoRotation((prev) => prev - 90)}
              >
                <i className="fas fa-undo mr-2"></i>
                90° Left
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPhotoRotation((prev) => prev + 90)}
              >
                <i className="fas fa-redo mr-2"></i>
                90° Right
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setPhotoScale(1);
                  setPhotoRotation(0);
                }}
              >
                Reset
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handlePhotoSave}
              >
                Save Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
