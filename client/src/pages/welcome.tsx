import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import backgroundImage from "@assets/generated_images/ONDC_marketplace_products_background_6d9daea8.png";

interface WelcomeProps {
  onNext: () => void;
}

export default function Welcome({ onNext }: WelcomeProps) {
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
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <Card 
            className="w-full max-w-md bg-white/95 backdrop-blur-sm border-none shadow-2xl cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-3xl"
            onClick={onNext}
            data-testid="card-welcome-slide"
          >
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">🛍️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 font-sans">
                Welcome to CartCircle
              </h1>
              <h2 className="text-lg font-semibold text-primary mb-4 font-sans">
                Your Gateway to ONDC Network
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed font-sans">
                Shop from thousands of verified sellers across India through the Open Network for Digital Commerce
              </p>
              
              {/* Features List */}
              <div className="space-y-3 mb-8">
                {["Shop from multiple sellers", "Best prices guaranteed", "Wide product selection"].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-left">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700 font-sans">{feature}</span>
                  </div>
                ))}
              </div>
              
              {/* Get Started Button */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="w-full bg-primary hover:bg-primary/90 text-white font-sans"
                data-testid="button-get-started"
              >
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}