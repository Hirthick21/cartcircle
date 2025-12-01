import { useLocation } from "wouter";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Help() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const helpTopics = [
    {
      id: 1,
      icon: "fas fa-shopping-bag",
      title: "Order Issues",
      description: "Track orders, returns & refunds",
    },
    {
      id: 2,
      icon: "fas fa-credit-card",
      title: "Payment & Wallet",
      description: "Payment methods & wallet queries",
    },
    {
      id: 3,
      icon: "fas fa-truck",
      title: "Delivery & Tracking",
      description: "Delivery status & address changes",
    },
    {
      id: 4,
      icon: "fas fa-user-circle",
      title: "Account Settings",
      description: "Profile, privacy & security",
    },
    {
      id: 5,
      icon: "fas fa-gift",
      title: "Rewards & Coupons",
      description: "Redeem rewards & apply coupons",
    },
    {
      id: 6,
      icon: "fas fa-question-circle",
      title: "Other Issues",
      description: "General queries & feedback",
    },
  ];

  const contactOptions = [
    {
      id: 1,
      icon: "fas fa-comments",
      title: "Live Chat",
      description: "Chat with our support team",
      action: () => toast({ title: "Chat", description: "Live chat coming soon" }),
    },
    {
      id: 2,
      icon: "fas fa-phone",
      title: "Call Us",
      description: "1800-XXX-XXXX (Toll Free)",
      action: () => window.open("tel:1800XXXXXXX"),
    },
    {
      id: 3,
      icon: "fas fa-envelope",
      title: "Email Support",
      description: "support@cartcircle.com",
      action: () => window.open("mailto:support@cartcircle.com"),
    },
  ];

  return (
    <div className="page-seamless-wrapper">
      <MobileContainer className="seamless-content-container">
        {/* Header */}
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
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }}>Help & Support</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm">How can we help you?</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative -mt-6 pt-8 px-4 py-6" style={{
          background: 'linear-gradient(180deg, #FFF9F0 0%, #FFFCF5 10%, #FFFEFA 20%, rgba(255,255,255,0.95) 30%, rgba(255,255,255,0.98) 40%, white 50%)'
        }}>
          {/* Help Topics */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Browse Help Topics</h2>
            <div className="grid grid-cols-2 gap-3">
              {helpTopics.map((topic) => (
                <Card 
                  key={topic.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-200"
                  onClick={() => toast({ title: topic.title, description: "Help article coming soon" })}
                >
                  <CardContent className="p-4 text-center">
                    <i className={`${topic.icon} text-primary text-3xl mb-2`}></i>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">{topic.title}</h3>
                    <p className="text-xs text-gray-600">{topic.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Options */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="space-y-3">
              {contactOptions.map((option) => (
                <Card 
                  key={option.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] duration-200"
                  onClick={option.action}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <i className={`${option.icon} text-primary text-2xl w-8 flex items-center justify-center`}></i>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{option.title}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      <i className="fas fa-chevron-right text-gray-400"></i>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Frequently Asked Questions</h3>
                  <p className="text-sm text-gray-600">Find quick answers</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({ title: "FAQs", description: "FAQ section coming soon" })}
                >
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <BottomNav activeTab="profile" />
      </MobileContainer>
    </div>
  );
}