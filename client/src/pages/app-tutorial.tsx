import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import backgroundImage from "@assets/generated_images/ONDC_marketplace_products_background_6d9daea8.png";

interface AppTutorialProps {
  onNext: () => void;
  onSkip: () => void;
}

export default function AppTutorial({ onNext, onSkip }: AppTutorialProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const tutorialSlides = [
    {
      title: "Discover Products",
      description: "Search and browse products from multiple sellers across the ONDC network",
      icon: "🔍",
      visual: "📱",
      steps: [
        "Use the search bar to find products",
        "Browse by categories",
        "Compare prices from different sellers",
        "Check seller ratings and reviews"
      ]
    },
    {
      title: "Smart Shopping Cart",
      description: "Add products from different sellers to your cart and checkout seamlessly",
      icon: "🛒",
      visual: "💳",
      steps: [
        "Add items from multiple sellers",
        "Review your cart before checkout",
        "Choose delivery options",
        "Pay securely in one transaction"
      ]
    },
    {
      title: "Track Your Orders",
      description: "Monitor your orders in real-time from purchase to delivery",
      icon: "📦",
      visual: "🚚",
      steps: [
        "Get instant order confirmations",
        "Track delivery in real-time",
        "Receive notifications at each step",
        "Rate your experience"
      ]
    },
    {
      title: "ONDC Benefits",
      description: "Experience the power of open digital commerce with fair pricing and choice",
      icon: "🌟",
      visual: "🤝",
      steps: [
        "No platform fees markup",
        "Support local businesses",
        "Transparent pricing",
        "Equal market access"
      ]
    }
  ];

  const handleNext = () => {
    if (currentSlide < tutorialSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      {/* Background with ONDC marketplace image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'brightness(0.7) saturate(1.2) blur(0.5px)',
            minWidth: '100vw',
            minHeight: '100vh',
          }}
        />
        
        {/* Gradient overlays for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-transparent to-purple-900/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full text-white">
        {/* Skip Button */}
        <div className="flex justify-end p-4">
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-white/70 hover:text-white hover:bg-white/10 font-sans"
            data-testid="button-skip-tutorial"
          >
            Skip Tutorial
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-none shadow-2xl">
            <CardContent className="p-8 text-center">
              {/* Main Icon */}
              <div className="text-6xl mb-6">{tutorialSlides[currentSlide].icon}</div>
              
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-3 font-sans">
                {tutorialSlides[currentSlide].title}
              </h1>
              
              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed font-sans">
                {tutorialSlides[currentSlide].description}
              </p>

              {/* Visual Representation */}
              <div className="flex justify-center items-center gap-4 mb-6">
                <div className="text-4xl">{tutorialSlides[currentSlide].visual}</div>
                <div className="flex-1 h-px bg-gradient-to-r from-primary to-secondary"></div>
                <div className="text-4xl">✨</div>
              </div>
              
              {/* Steps List */}
              <div className="space-y-3 text-left">
                {tutorialSlides[currentSlide].steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold font-sans">{index + 1}</span>
                    </div>
                    <span className="text-gray-700 text-sm font-sans">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="p-6">
          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {tutorialSlides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {currentSlide > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 font-sans"
                data-testid="button-back-tutorial"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 bg-primary hover:bg-primary/90 text-white font-sans"
              data-testid="button-next-tutorial"
            >
              {currentSlide === tutorialSlides.length - 1 ? "Let's Shop!" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}