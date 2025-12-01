import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import backgroundImage from "@assets/generated_images/ONDC_marketplace_products_background_6d9daea8.png";

interface LocationSetupProps {
  onNext: (location: string) => void;
  onSkip: () => void;
}

export default function LocationSetup({ onNext, onSkip }: LocationSetupProps) {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [customLocation, setCustomLocation] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const popularCities = [
    { name: "Bengaluru, Karnataka", emoji: "🏙️" },
    { name: "Delhi, Delhi", emoji: "🏛️" },
    { name: "Mumbai, Maharashtra", emoji: "🌆" },
    { name: "Hyderabad, Telangana", emoji: "🕌" },
    { name: "Chennai, Tamil Nadu", emoji: "🏖️" },
    { name: "Kolkata, West Bengal", emoji: "🌉" },
    { name: "Pune, Maharashtra", emoji: "🏘️" },
    { name: "Ahmedabad, Gujarat", emoji: "🕌" },
    { name: "Jaipur, Rajasthan", emoji: "🏰" },
    { name: "Lucknow, Uttar Pradesh", emoji: "🏛️" }
  ];

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      // Simulate reverse geocoding (in real app, you'd use a geocoding API)
      const detectedLocation = "Bengaluru, Karnataka"; // Default fallback
      setSelectedLocation(detectedLocation);
    } catch (error) {
      console.error("Location detection failed:", error);
      // Fallback to manual selection
      setShowCustomInput(true);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowCustomInput(false);
    setCustomLocation("");
  };

  const handleCustomLocationSubmit = () => {
    if (customLocation.trim()) {
      setSelectedLocation(customLocation.trim());
      setShowCustomInput(false);
    }
  };

  const handleContinue = () => {
    const finalLocation = selectedLocation || customLocation.trim();
    if (finalLocation) {
      // Store in localStorage for persistence
      localStorage.setItem('selectedLocation', finalLocation);
      onNext(finalLocation);
    }
  };

  const canProceed = selectedLocation || customLocation.trim();

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
      <div className="relative z-10 flex flex-col h-full text-white">
        {/* Header */}
        <div className="text-center pt-12 px-6">
          <div className="text-5xl mb-4">📍</div>
          <h1 className="text-2xl font-bold mb-2 font-sans">Choose Your Location</h1>
          <p className="text-white/80 font-sans mb-6">
            We'll show you sellers and products available in your area
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {/* Auto-detect Location */}
            <Card className="bg-white/95 backdrop-blur-sm border-none shadow-xl mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">🎯</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1 font-sans">Auto-detect Location</h3>
                    <p className="text-sm text-gray-600 font-sans">Get your precise location automatically</p>
                  </div>
                  <Button
                    onClick={handleDetectLocation}
                    disabled={isDetecting}
                    className="bg-primary hover:bg-primary/90 text-white font-sans"
                    data-testid="button-detect-location"
                  >
                    {isDetecting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Detecting...
                      </div>
                    ) : (
                      "Detect"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Selected Location Display */}
            {selectedLocation && (
              <Card className="bg-primary/10 border-primary/30 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">✅</div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80 font-sans">Selected Location</p>
                      <p className="font-semibold text-white font-sans">{selectedLocation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Manual Location Selection */}
            {!showCustomInput ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white font-sans">Popular Cities</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowCustomInput(true)}
                    className="text-white/70 hover:text-white hover:bg-white/10 text-sm font-sans"
                    data-testid="button-custom-location"
                  >
                    Other City
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {popularCities.map((city) => (
                    <Card 
                      key={city.name}
                      className={`cursor-pointer transition-all duration-200 border-2 ${
                        selectedLocation === city.name 
                          ? 'bg-primary/20 border-primary shadow-lg' 
                          : 'bg-white/95 border-transparent hover:bg-white hover:shadow-md'
                      }`}
                      onClick={() => handleLocationSelect(city.name)}
                      data-testid={`location-${city.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{city.emoji}</div>
                          <span className={`font-semibold font-sans ${
                            selectedLocation === city.name ? 'text-white' : 'text-gray-900'
                          }`}>
                            {city.name}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white font-sans">Enter Your City</h3>
                  <Button
                    variant="ghost"
                    onClick={() => setShowCustomInput(false)}
                    className="text-white/70 hover:text-white hover:bg-white/10 text-sm font-sans"
                    data-testid="button-back-to-cities"
                  >
                    Back
                  </Button>
                </div>
                
                <Card className="bg-white/95 backdrop-blur-sm border-none shadow-xl">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Enter city, state"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        className="font-sans"
                        data-testid="input-custom-location"
                      />
                      <Button
                        onClick={handleCustomLocationSubmit}
                        disabled={!customLocation.trim()}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-sans"
                        data-testid="button-submit-custom-location"
                      >
                        Use This Location
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 font-sans"
              data-testid="button-skip-location"
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!canProceed}
              className={`flex-1 font-sans ${
                canProceed 
                  ? 'bg-primary hover:bg-primary/90 text-white' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              data-testid="button-continue-location"
            >
              Continue
            </Button>
          </div>
          {!canProceed && (
            <p className="text-center text-white/70 text-sm font-sans">
              Please select or enter your location to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}