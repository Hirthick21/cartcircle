
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Bell, Camera } from "lucide-react";

interface PermissionsProps {
  onNext: () => void;
  onSkip?: () => void;
}

export default function Permissions({ onNext, onSkip }: PermissionsProps) {
  const [locationPermission, setLocationPermission] = useState<PermissionState>("prompt");
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check current permissions status
    if (typeof navigator !== "undefined" && "permissions" in navigator) {
      navigator.permissions.query({ name: "geolocation" as PermissionName })
        .then(result => setLocationPermission(result.state))
        .catch(() => setLocationPermission("prompt"));
    }

    if (typeof Notification !== "undefined") {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestLocationPermission = async () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      return;
    }

    setIsLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          enableHighAccuracy: false
        });
      });
      
      setLocationPermission("granted");
    } catch (error) {
      setLocationPermission("denied");
    } finally {
      setIsLoading(false);
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === "undefined") {
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            App Permissions
          </CardTitle>
          <p className="text-gray-600 mt-2">
            We need a few permissions to provide you with the best shopping experience
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {/* Location Permission */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-medium">Location Access</h3>
                  <p className="text-sm text-gray-500">
                    Find nearby stores and delivery options
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {locationPermission === "granted" && (
                  <span className="text-green-600 text-sm">✓ Granted</span>
                )}
                {locationPermission === "denied" && (
                  <span className="text-red-600 text-sm">✗ Denied</span>
                )}
                {locationPermission === "prompt" && (
                  <Button 
                    size="sm" 
                    onClick={requestLocationPermission}
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "Allow"}
                  </Button>
                )}
              </div>
            </div>

            {/* Notification Permission */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-gray-500">
                    Get updates on your orders and offers
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {notificationPermission === "granted" && (
                  <span className="text-green-600 text-sm">✓ Granted</span>
                )}
                {notificationPermission === "denied" && (
                  <span className="text-red-600 text-sm">✗ Denied</span>
                )}
                {notificationPermission === "default" && (
                  <Button 
                    size="sm" 
                    onClick={requestNotificationPermission}
                  >
                    Allow
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <Button 
              onClick={handleContinue}
              className="w-full"
              size="lg"
            >
              Continue
            </Button>
            {onSkip && (
              <Button 
                onClick={onSkip}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Skip for now
              </Button>
            )}
          </div>

          <p className="text-xs text-gray-500 text-center">
            You can change these permissions later in your browser settings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
