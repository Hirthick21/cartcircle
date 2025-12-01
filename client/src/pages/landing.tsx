import { Button } from "@/components/ui/button";
import backgroundImage from "@assets/generated_images/ONDC_marketplace_products_background_6d9daea8.png";
import { setTerms, setOnboardingCompleted } from "@/lib/storage";

export default function Landing() {
  const handleClick = () => {
    // Mark onboarding as completed and terms as accepted
    setOnboardingCompleted();
    setTerms(true);
    // Redirect to login which will then go to home
    window.location.href = '/api/login';
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      {/* Background with ONDC marketplace image */}
      <div className="absolute inset-0 w-full h-full">
        {/* Main background image */}
        <img 
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'brightness(0.8) saturate(1.2) blur(0.5px)',
            minWidth: '100vw',
            minHeight: '100vh',
          }}
        />
        
        {/* Animated floating elements for depth */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, index) => (
            <div
              key={`glow-${index}`}
              className="absolute rounded-full opacity-20"
              style={{
                width: `${20 + (index % 3) * 15}px`,
                height: `${20 + (index % 3) * 15}px`,
                left: `${(index * 23 + 10) % 90}%`,
                top: `${(index * 31 + 15) % 85}%`,
                background: `radial-gradient(circle, ${
                  ['rgba(255, 165, 0, 0.3)', 'rgba(255, 99, 71, 0.3)', 'rgba(138, 43, 226, 0.3)', 'rgba(30, 144, 255, 0.3)'][index % 4]
                } 0%, transparent 70%)`,
                animation: `float ${8 + (index % 4) * 2}s ease-in-out infinite`,
                animationDelay: `${(index * 0.8) % 4}s`
              }}
            />
          ))}
        </div>
        
        {/* Gradient overlays for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-transparent to-purple-900/20"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/15 via-transparent to-amber-900/15"></div>
        
        {/* Subtle animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, index) => (
            <div
              key={`particle-${index}`}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `${['rgba(255, 255, 255, 0.4)', 'rgba(255, 215, 0, 0.6)', 'rgba(255, 140, 0, 0.5)', 'rgba(138, 43, 226, 0.4)'][index % 4]}`,
                animation: `float ${12 + Math.random() * 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full h-screen flex items-center justify-center p-8">
        <div className="text-center cursor-pointer max-w-xl mx-auto" onClick={handleClick} data-testid="logo-title-clickable">
          {/* Logo */}
          <div className="w-28 h-28 mx-auto mb-12 rounded-full fuel-yellow flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/30 hover:scale-110 transition-all duration-300">
            <span className="text-white text-3xl font-bold">CC</span>
          </div>
          
          {/* Title */}
          <h1 className="text-6xl sm:text-7xl font-bold text-white drop-shadow-xl hover:scale-105 transition-all duration-300 mb-6">CartCircle</h1>
          <p className="text-white/95 text-2xl font-light drop-shadow-lg">Shop from ONDC Network</p>
        </div>
      </div>
      
      {/* CSS animations and overrides */}
      <style>{`
        /* Override body styles for landing page */
        body {
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          background: transparent !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
        }
        
        html {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
        }
        
        #root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          overflow: hidden !important;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg) scale(1);
          }
          33% {
            transform: translateY(-12px) rotate(3deg) scale(1.05);
          }
          66% {
            transform: translateY(-6px) rotate(-2deg) scale(0.98);
          }
        }
      `}</style>
    </div>
  );
}