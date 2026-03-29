import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MobileContainer } from "@/components/layout/mobile-container";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Users, Calendar, MapPin, Gift } from "lucide-react";
import { PartnerSellersModal } from "@/components/modals/partner-sellers-modal";
import { CreditModal } from "@/components/modals/credit-modal";
import { EventDeliveryModal } from "@/components/modals/event-delivery-modal";
import { RewardsModal } from "@/components/modals/rewards-modal";

export default function XtraMart() {
  const [, navigate] = useLocation();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const scrollingTexts = [
    { text: "Your Home", emoji: "🏡" },
    { text: "Your Office", emoji: "🏢" }, 
    { text: "Your Festival", emoji: "🪔" },
    { text: "Your Function", emoji: "💍" },
    { text: "Your Gathering", emoji: "👨‍👩‍👧‍👦" },
    { text: "Your Celebration", emoji: "🎊" },
    { text: "Your Event", emoji: "🎪" },
    { text: "Your Party", emoji: "🎂" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prevIndex) => {
        return (prevIndex + 1) % scrollingTexts.length;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [scrollingTexts.length]);

  const handleCardClick = (modalType: string) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="page-seamless-wrapper">
      <MobileContainer className="seamless-content-container">
        {/* Seamless Header */}
        <div className="relative overflow-hidden seamless-transition">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFEDD5] via-[#FFEDD5] to-[#FFEDD5]"></div>
          <div className="relative p-4 pb-8">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
                className="bg-white/30 text-gray-800 hover:bg-white/40 rounded-full transition-all duration-300 p-0 w-9 h-9 flex items-center justify-center backdrop-blur-md border border-white/50 shadow-xl hover:scale-105"
                data-testid="button-back"
              >
                <i className="fas fa-chevron-left text-sm font-bold drop-shadow-sm"></i>
              </Button>
              <div className="flex-1">
                <h1 className="text-xl font-bold drop-shadow-sm tracking-wide" style={{ color: '#F76B1E' }} data-testid="text-title">Xtra Mart</h1>
                <p className="text-orange-400 text-sm font-medium drop-shadow-sm" data-testid="text-subtitle">Premium services & offers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seamless Blend Section - positioned to overlap header gradient */}
        <div className="relative -mt-6 pt-3 pb-3" style={{ 
          background: 'linear-gradient(180deg, #FFEDD5 0%, #FFF0DB 8%, #FFF3E1 16%, #FFF6E7 24%, #FFF8ED 32%, rgba(255,250,243,1) 40%, rgba(255,252,248,1) 50%, rgba(255,253,251,1) 60%, rgba(255,254,253,1) 70%, rgba(255,255,254,1) 80%, white 90%, white 100%)'
        }}>
          <div className="relative flex items-center justify-center px-4">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 drop-shadow-sm">We Deliver to</span>
                <div className="h-8 overflow-hidden relative bg-gradient-to-r from-orange-500/40 to-yellow-500/40 rounded-lg px-3 backdrop-blur-sm border border-orange-400/50 shadow-lg">
                  <div 
                    className="transition-transform duration-1000 ease-in-out"
                    style={{ 
                      transform: `translateY(-${currentTextIndex * 32}px)` 
                    }}
                  >
                    {scrollingTexts.map((item, index) => (
                      <p 
                        key={index}
                        className={`text-gray-900 text-sm font-bold h-8 flex items-center justify-center gap-1.5 ${
                          index === currentTextIndex ? 'animate-pulse' : ''
                        }`}
                        style={{
                          textShadow: '0 1px 2px rgba(255,255,255,0.5)',
                          backgroundColor: index === currentTextIndex ? 'rgba(255,255,255,0.3)' : 'transparent',
                          borderRadius: '4px'
                        }}
                      >
                        <span>{item.text}</span>
                        <span 
                          style={{
                            fontSize: '1.25rem',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                            display: 'inline-block'
                          }}
                        >
                          {item.emoji}
                        </span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="px-4 pb-2 space-y-4 pt-2" style={{ background: 'white' }}>
        {/* Partner Seller Network Card */}
        <Card 
          className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-orange-50 to-red-50 cursor-pointer"
          onClick={() => handleCardClick('partners')}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs px-2 py-1">
                    <Users className="w-3 h-3 mr-1" />
                    Contract Partners
                  </Badge>
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <i className="fas fa-tags"></i>
                    Exclusive Discounts
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 font-sans">
                  Partner Seller Network
                </h3>
                <p className="text-sm text-gray-600 leading-tight">
                  Exclusive partnerships with local sellers for better prices
                </p>
              </div>
              <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm ml-3">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-orange-200">
              <div>
                <span className="text-lg font-bold text-orange-600">Up to 25% OFF</span>
                <p className="text-xs text-gray-500 font-medium">Min Order: ₹1,500</p>
              </div>
              <i className="fas fa-arrow-right text-orange-600 text-sm"></i>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Credit Option Card */}
        <Card 
          className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 cursor-pointer"
          onClick={() => handleCardClick('credit')}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs px-2 py-1">
                    <CreditCard className="w-3 h-3 mr-1" />
                    Buy Now, Pay Later
                  </Badge>
                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    0% Interest
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 font-sans">
                  Monthly Credit Option
                </h3>
                <p className="text-sm text-gray-600 leading-tight">
                  Shop now, pay between 10th-15th of next month
                </p>
              </div>
              <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm ml-3">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-blue-200">
              <div>
                <span className="text-lg font-bold text-blue-600">Credit Limit: ₹10,000</span>
                <p className="text-xs text-gray-500 font-medium">No Interest</p>
              </div>
              <i className="fas fa-arrow-right text-blue-600 text-sm"></i>
            </div>
          </CardContent>
        </Card>

        {/* Event Place Delivery Card */}
        <Card 
          className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-purple-50 to-pink-50 cursor-pointer"
          onClick={() => handleCardClick('events')}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    Festival Delivery
                  </Badge>
                  <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    Tamil Nadu Special
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 font-sans">
                  Event Place Delivery
                </h3>
                <p className="text-sm text-gray-600 leading-tight">
                  Direct delivery to your festival, function, or gathering venue
                </p>
              </div>
              <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm ml-3">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-purple-200">
              <div>
                <span className="text-lg font-bold text-purple-600">Free Delivery</span>
                <p className="text-xs text-gray-500 font-medium">Min Order: ₹2,000</p>
              </div>
              <i className="fas fa-arrow-right text-purple-600 text-sm"></i>
            </div>
          </CardContent>
        </Card>

        {/* Premium Rewards Card */}
        <Card 
          className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-fuel-yellow-50 to-yellow-50 cursor-pointer"
          onClick={() => handleCardClick('rewards')}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-fuel-yellow-500 to-yellow-500 text-white text-xs px-2 py-1">
                    <Gift className="w-3 h-3 mr-1" />
                    Premium Rewards
                  </Badge>
                  <span className="text-xs font-bold text-fuel-yellow-600 bg-fuel-yellow-100 px-2 py-1 rounded-full">
                    Loyalty Points
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 font-sans">
                  Smart Rewards System
                </h3>
                <p className="text-sm text-gray-600 leading-tight">
                  Earn points, unlock exclusive deals and premium benefits
                </p>
              </div>
              <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm ml-3">
                <Gift className="w-5 h-5 text-fuel-yellow-600" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-fuel-yellow-200">
              <div>
                <span className="text-lg font-bold text-fuel-yellow-600">Join Premium</span>
                <p className="text-xs text-gray-500 font-medium">Exclusive Benefits</p>
              </div>
              <i className="fas fa-arrow-right text-fuel-yellow-600 text-sm"></i>
            </div>
          </CardContent>
        </Card>

        {/* Bottom spacing for navigation */}
        <div className="pb-20"></div>
        </div>

        <BottomNav activeTab="xtra-mart" />

        {/* Modals */}
        <PartnerSellersModal 
          isOpen={activeModal === 'partners'} 
          onClose={closeModal} 
        />
        <CreditModal 
          isOpen={activeModal === 'credit'} 
          onClose={closeModal} 
        />
        <EventDeliveryModal 
          isOpen={activeModal === 'events'} 
          onClose={closeModal} 
        />
        <RewardsModal 
          isOpen={activeModal === 'rewards'} 
          onClose={closeModal} 
        />
      </MobileContainer>
    </div>
  );
}