
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  highlightValue: string;
  badge?: {
    text: string;
    variant: 'primary' | 'success' | 'info' | 'purple';
  };
  bgGradient: string;
  onClick?: () => void;
}

export function FeatureCard({ 
  icon, 
  title, 
  subtitle, 
  description, 
  highlight, 
  highlightValue, 
  badge,
  bgGradient,
  onClick 
}: FeatureCardProps) {
  const getBadgeStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-red-500 to-orange-500 text-white';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'purple':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default:
        return 'bg-gradient-to-r from-fuel-yellow-500 to-fuel-yellow-400 text-white';
    }
  };

  return (
    <Card className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] border-0 ${bgGradient} group cursor-pointer active:scale-[0.98]`} onClick={onClick}>
      <CardContent className="p-3">
        {/* Badge */}
        {badge && (
          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${getBadgeStyles(badge.variant)}`}>
            <i className="fas fa-heart mr-1 text-xs"></i>
            {badge.text}
          </div>
        )}

        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-0.5 leading-tight">
              {title}
            </h3>
            <p className="text-sm text-gray-700 font-medium mb-1">
              {subtitle}
            </p>
            <p className="text-xs text-gray-600 leading-snug">
              {description}
            </p>
          </div>
          
          {/* Icon Container */}
          <div className="ml-2 flex-shrink-0">
            <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
              <i className={`${icon} text-fuel-yellow-600 text-base`}></i>
            </div>
          </div>
        </div>

        {/* Highlight Section */}
        <div className="flex items-center justify-between pt-2 border-t border-white/20">
          <div>
            <span className="text-base font-bold text-gray-900">
              {highlightValue}
            </span>
            <p className="text-xs text-gray-600 font-medium">
              {highlight}
            </p>
          </div>
          
          {/* Action Button */}
          <div className="text-right">
            <i className="fas fa-arrow-right text-fuel-yellow-600 group-hover:translate-x-0.5 transition-transform duration-300 text-sm"></i>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
