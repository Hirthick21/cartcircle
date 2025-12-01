
import { FeatureCard } from "./feature-card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export function FeaturesGrid() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const features = [
    {
      id: "partners",
      icon: "fas fa-handshake",
      title: "Partner Seller Network",
      subtitle: "Exclusive Discounts",
      description: "Exclusive partnerships with local sellers for better prices",
      highlight: "Min Order: ₹1,500",
      highlightValue: "Up to 25% OFF",
      badge: {
        text: "Contract Partners",
        variant: "primary" as const
      },
      bgGradient: "bg-gradient-to-br from-orange-50 to-red-50",
      action: () => {
        navigate('/xtra-mart');
        toast({
          title: "Partner Network",
          description: "Explore exclusive deals from partner sellers",
        });
      }
    },
    {
      id: "credit",
      icon: "fas fa-credit-card",
      title: "Monthly Credit Option",
      subtitle: "0% Interest",
      description: "Shop now, pay between 10th-15th of next month",
      highlight: "No Interest",
      highlightValue: "Credit Limit: ₹10,000",
      badge: {
        text: "Buy Now, Pay Later",
        variant: "info" as const
      },
      bgGradient: "bg-gradient-to-br from-blue-50 to-cyan-50",
      action: () => {
        navigate('/xtra-mart');
        toast({
          title: "Credit Option",
          description: "Shop now and pay later with 0% interest",
        });
      }
    },
    {
      id: "delivery",
      icon: "fas fa-truck",
      title: "Event Place Delivery",
      subtitle: "Tamil Nadu Special",
      description: "Direct delivery to your festival, function, or gathering venue",
      highlight: "Min Order: ₹2,000",
      highlightValue: "Free Delivery",
      badge: {
        text: "Festival Delivery",
        variant: "purple" as const
      },
      bgGradient: "bg-gradient-to-br from-purple-50 to-pink-50",
      action: () => {
        navigate('/xtra-mart');
        toast({
          title: "Event Delivery",
          description: "Special delivery service for events and gatherings",
        });
      }
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {features.map((feature, index) => (
        <div key={feature.id} onClick={feature.action} className="cursor-pointer">
          <FeatureCard {...feature} />
        </div>
      ))}
    </div>
  );
}
