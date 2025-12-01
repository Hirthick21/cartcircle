import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import backgroundImage from "@assets/generated_images/ONDC_marketplace_products_background_6d9daea8.png";

interface TermsConditionsProps {
  onAccept: () => void;
  onDecline: () => void;
}

export default function TermsConditions({ onAccept, onDecline }: TermsConditionsProps) {
  const [allTermsAccepted, setAllTermsAccepted] = useState(false);

  const combinedTermsContent = `TERMS OF SERVICE & PRIVACY POLICY

Welcome to CartCircle, your gateway to the Open Network for Digital Commerce (ONDC).

TERMS OF SERVICE
By using our app, you agree to:

1. Account Usage
   • Provide accurate information during registration
   • Keep your account secure and confidential
   • Use the app only for lawful purposes

2. Shopping & Orders
   • Product information is provided by ONDC network sellers
   • Prices and availability may change without notice
   • You're responsible for reviewing orders before confirmation

3. Payments & Refunds
   • All payments are processed securely through ONDC protocols
   • Refund policies are set by individual sellers
   • Disputed transactions follow ONDC resolution procedures

4. Limitation of Liability
   • CartCircle acts as a facilitator in the ONDC network
   • We don't guarantee product quality or seller performance
   • Maximum liability is limited to the order value

PRIVACY POLICY
We respect your privacy and protect your personal data.

Data Collection:
   • Account information (name, email, phone)
   • Location data for seller discovery
   • Order history and preferences
   • Device information for app optimization

Data Usage:
   • Personalizing your shopping experience
   • Processing orders through ONDC network
   • Sending order updates and notifications
   • Improving our services

Data Sharing:
   • With ONDC network participants for order processing
   • With payment providers for transaction processing
   • We never sell your personal data to third parties

ONDC NETWORK TERMS
As an ONDC participant, you agree to:

1. Network Participation
   • Abide by ONDC network protocols and standards
   • Respect other network participants
   • Follow dispute resolution procedures

2. Seller Interactions
   • Deal directly with individual sellers for support
   • Follow seller-specific return and refund policies
   • Provide honest reviews and feedback

3. Data Sharing
   • Your order data is shared with relevant sellers
   • Transaction data follows ONDC protocols
   • Network data helps improve overall ecosystem`;

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
          <div className="text-5xl mb-4">📋</div>
          <h1 className="text-2xl font-bold mb-2 font-sans">Terms & Conditions</h1>
          <p className="text-white/80 font-sans">
            Please review and accept our terms to continue
          </p>
        </div>

        {/* Terms Content */}
        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {/* Combined Terms & Privacy Policy */}
            <Card className="bg-white/95 backdrop-blur-sm border-none shadow-xl mb-6">
              <CardContent className="p-6">
                <h3 className="font-bold text-gray-900 mb-4 font-sans">Terms & Privacy Policy</h3>
                <ScrollArea className="h-80 w-full rounded border p-4 bg-gray-50">
                  <div className="text-xs text-gray-700 whitespace-pre-line font-sans leading-relaxed">
                    {combinedTermsContent}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Agreement Checkbox */}
            <Card className="bg-primary/10 border-primary/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Checkbox
                    id="all-terms"
                    checked={allTermsAccepted}
                    onCheckedChange={(checked) => setAllTermsAccepted(checked === true)}
                    data-testid="checkbox-all-terms"
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="all-terms" className="text-white font-medium cursor-pointer font-sans">
                      I have read and agree to the Terms of Service, Privacy Policy, and ONDC Network Terms
                    </Label>
                    <p className="text-xs text-white/80 mt-2 font-sans">
                      By checking this box, you confirm that you are of legal age and agree to be bound by these terms and conditions.
                    </p>
                  </div>
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
              onClick={onDecline}
              className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 font-sans"
              data-testid="button-decline-terms"
            >
              Decline
            </Button>
            <Button
              onClick={onAccept}
              disabled={!allTermsAccepted}
              className={`flex-1 font-sans ${
                allTermsAccepted 
                  ? 'bg-primary hover:bg-primary/90 text-white' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
              data-testid="button-accept-terms"
            >
              Accept & Continue
            </Button>
          </div>
          {!allTermsAccepted && (
            <p className="text-center text-white/70 text-sm font-sans">
              Please accept the terms and conditions to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}