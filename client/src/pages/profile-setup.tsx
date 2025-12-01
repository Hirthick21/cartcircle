import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import backgroundImage from "@assets/generated_images/ONDC_marketplace_products_background_6d9daea8.png";

interface ProfileSetupProps {
  onNext: (profileData: any) => void;
  onSkip: () => void;
  userInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export default function ProfileSetup({ onNext, onSkip, userInfo }: ProfileSetupProps) {
  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    phone: "",
    gender: "",
    interests: [] as string[]
  });

  const interestCategories = [
    { id: "grocery", name: "Grocery & Essentials", emoji: "🛒" },
    { id: "fashion", name: "Fashion & Beauty", emoji: "👗" },
    { id: "electronics", name: "Electronics", emoji: "📱" },
    { id: "home", name: "Home & Kitchen", emoji: "🏠" },
    { id: "health", name: "Health & Wellness", emoji: "💊" },
    { id: "books", name: "Books & Education", emoji: "📚" },
    { id: "sports", name: "Sports & Fitness", emoji: "⚽" },
    { id: "automotive", name: "Automotive", emoji: "🚗" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleContinue = () => {
    onNext(formData);
  };

  const isFormValid = formData.firstName.trim() && formData.phone.trim();

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
        <div className="text-center pt-8 px-6">
          <div className="text-5xl mb-4">👤</div>
          <h1 className="text-2xl font-bold mb-2 font-sans">Complete Your Profile</h1>
          <p className="text-white/80 font-sans">
            Help us personalize your shopping experience
          </p>
        </div>

        {/* Form Content */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="max-w-md mx-auto space-y-6">
            {/* Basic Information */}
            <Card className="bg-white/95 backdrop-blur-sm border-none shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 font-sans">Basic Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-700 font-sans">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="font-sans"
                        data-testid="input-first-name"
                        disabled={!!userInfo?.firstName}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-700 font-sans">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="font-sans"
                        data-testid="input-last-name"
                        disabled={!!userInfo?.lastName}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-sans">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="font-sans"
                      data-testid="input-email"
                      disabled={!!userInfo?.email}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-sans">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="font-sans"
                      data-testid="input-phone"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 font-sans">Gender (Optional)</Label>
                    <RadioGroup 
                      value={formData.gender} 
                      onValueChange={(value) => handleInputChange("gender", value)}
                      className="flex gap-4 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" data-testid="radio-male" />
                        <Label htmlFor="male" className="text-gray-700 font-sans">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" data-testid="radio-female" />
                        <Label htmlFor="female" className="text-gray-700 font-sans">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="other" data-testid="radio-other" />
                        <Label htmlFor="other" className="text-gray-700 font-sans">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shopping Interests */}
            <Card className="bg-white/95 backdrop-blur-sm border-none shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-2 font-sans">Shopping Interests</h3>
                <p className="text-sm text-gray-600 mb-4 font-sans">
                  Select categories you're interested in (optional)
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {interestCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        formData.interests.includes(category.id)
                          ? 'bg-primary/10 border-primary'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => toggleInterest(category.id)}
                      data-testid={`interest-${category.id}`}
                    >
                      <div className="text-center">
                        <div className="text-xl mb-1">{category.emoji}</div>
                        <p className={`text-xs font-medium font-sans ${
                          formData.interests.includes(category.id) ? 'text-primary' : 'text-gray-700'
                        }`}>
                          {category.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-6 space-y-4">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 font-sans"
              data-testid="button-skip-profile"
            >
              Skip for Now
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!isFormValid}
              className={`flex-1 font-sans ${
                isFormValid 
                  ? 'bg-primary hover:bg-primary/90 text-white' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              data-testid="button-continue-profile"
            >
              Continue
            </Button>
          </div>
          {!isFormValid && (
            <p className="text-center text-white/70 text-sm font-sans">
              Please fill in your name and phone number
            </p>
          )}
        </div>
      </div>
    </div>
  );
}