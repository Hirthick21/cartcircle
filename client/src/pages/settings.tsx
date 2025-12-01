import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const [, navigate] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    smsUpdates: false,
    orderUpdates: true,
    promotions: true,
    darkMode: false,
    locationServices: true,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please login to access settings",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast({
      title: "Settings Updated",
      description: "Your preferences have been saved",
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

  const settingsOptions = [
    {
      id: 1,
      icon: "fas fa-user",
      title: "Contact Info",
      description: "Update your contact details",
      path: "/contact-info",
    },
    {
      id: 2,
      icon: "fas fa-bell",
      title: "Notifications",
      description: "Manage notification preferences",
      path: "/notifications",
    },
    {
      id: 3,
      icon: "fas fa-lock",
      title: "Privacy & Security",
      description: "Control your privacy settings",
      action: () => toast({ title: "Privacy", description: "Privacy settings coming soon" }),
    },
    {
      id: 4,
      icon: "fas fa-credit-card",
      title: "Payment Methods",
      description: "Manage saved payment options",
      path: "/payments",
    },
    {
      id: 5,
      icon: "fas fa-map-marker-alt",
      title: "Saved Addresses",
      description: "Manage delivery addresses",
      path: "/addresses",
    },
    {
      id: 6,
      icon: "fas fa-language",
      title: "Language",
      description: "Change app language",
      action: () => toast({ title: "Language", description: "Language settings coming soon" }),
    },
  ];

  return (
    <div className="page-seamless-wrapper">
      <MobileContainer className="seamless-content-container">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#F1AC23] via-[#F8D555] to-transparent"></div>
          <div className="relative p-4 pb-6">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-10 h-10 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
              >
                <i className="fas fa-chevron-left text-lg font-bold drop-shadow-sm"></i>
              </button>

              <div>
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Settings</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm">App preferences</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 pt-8 px-4 py-6" style={{
          background: 'linear-gradient(180deg, #FFF9F0 0%, #FFFCF5 10%, #FFFEFA 20%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.98) 40%, white 50%)'
        }}>
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-3">Notifications</h3>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive push notifications</p>
                    </div>
                    <Switch checked={settings.notifications} onCheckedChange={() => handleToggle('notifications')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Email Updates</Label>
                      <p className="text-sm text-gray-600">Get updates via email</p>
                    </div>
                    <Switch checked={settings.emailUpdates} onCheckedChange={() => handleToggle('emailUpdates')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">SMS Updates</Label>
                      <p className="text-sm text-gray-600">Receive SMS notifications</p>
                    </div>
                    <Switch checked={settings.smsUpdates} onCheckedChange={() => handleToggle('smsUpdates')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Order Updates</Label>
                      <p className="text-sm text-gray-600">Track your orders</p>
                    </div>
                    <Switch checked={settings.orderUpdates} onCheckedChange={() => handleToggle('orderUpdates')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Promotions</Label>
                      <p className="text-sm text-gray-600">Offers and deals</p>
                    </div>
                    <Switch checked={settings.promotions} onCheckedChange={() => handleToggle('promotions')} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">App Preferences</h3>
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Dark Mode</Label>
                      <p className="text-sm text-gray-600">Use dark theme</p>
                    </div>
                    <Switch checked={settings.darkMode} onCheckedChange={() => handleToggle('darkMode')} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-semibold">Location Services</Label>
                      <p className="text-sm text-gray-600">Enable location tracking</p>
                    </div>
                    <Switch checked={settings.locationServices} onCheckedChange={() => handleToggle('locationServices')} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">About</h3>
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version</span>
                    <span className="font-semibold">1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Build</span>
                    <span className="font-semibold">2025.01</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-32">
              <h3 className="font-bold text-lg mb-3">More</h3>
              <Card>
                <CardContent className="p-4 space-y-3">
                  {settingsOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center justify-between cursor-pointer py-2"
                      onClick={() => {
                        if (option.path) {
                          navigate(option.path);
                        } else if (option.action) {
                          option.action();
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <i className={`${option.icon} w-5 text-center text-orange-500`}></i>
                        <div>
                          <p className="font-semibold text-gray-800">{option.title}</p>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </div>
                      </div>
                      <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <BottomNav activeTab="profile" />
      </MobileContainer>
    </div>
  );
}