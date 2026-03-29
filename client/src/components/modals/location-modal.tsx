import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect?: (location: string) => void;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string | undefined;

if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

export function LocationModal({ open, onOpenChange, onLocationSelect }: LocationModalProps) {
  const { toast } = useToast();
  const [searchLocation, setSearchLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState("Bengaluru, Karnataka");
  const [showMapView, setShowMapView] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    place_name: string;
    center: [number, number];
    text: string;
    place_type: string[];
    relevance?: number; // Added for sorting
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Search for places using Mapbox Geocoding API
  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      // Get user's current location for proximity bias
      const getUserLocation = (): Promise<{ lat: number; lng: number } | null> => {
        return new Promise((resolve) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                });
              },
              () => resolve(null),
              { timeout: 3000, maximumAge: 300000 }
            );
          } else {
            resolve(null);
          }
        });
      };

      const userLocation = await getUserLocation();
      const proximityParam = userLocation 
        ? `&proximity=${userLocation.lng},${userLocation.lat}` 
        : '&proximity=77.5946,12.9716'; // Default to Bangalore

      const searches = [];

      // Search 1: Address-focused search (highest priority for door numbers)
      searches.push(
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          `access_token=${MAPBOX_TOKEN}&` +
          `country=IN&` +
          `limit=10&` +
          `types=address&` +
          `${proximityParam}&` +
          `autocomplete=true`
        )
      );

      // Search 2: POI + Address (for landmarks with addresses)
      searches.push(
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          `access_token=${MAPBOX_TOKEN}&` +
          `country=IN&` +
          `limit=5&` +
          `types=address,poi&` +
          `${proximityParam}&` +
          `autocomplete=true`
        )
      );

      // Search 3: All types as fallback
      searches.push(
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
          `access_token=${MAPBOX_TOKEN}&` +
          `country=IN&` +
          `limit=5&` +
          `types=address,poi,place,locality&` +
          `${proximityParam}&` +
          `autocomplete=true`
        )
      );

      const responses = await Promise.all(searches);
      const allFeatures: any[] = [];
      const seenIds = new Set<string>();

      for (const response of responses) {
        if (response.ok) {
          const data = await response.json();
          if (data.features) {
            data.features.forEach((feature: any) => {
              if (!seenIds.has(feature.id)) {
                seenIds.add(feature.id);

                // Enhanced scoring system
                let matchScore = 0;
                const placeName = feature.place_name.toLowerCase();
                const queryLower = query.toLowerCase();
                const text = (feature.text || '').toLowerCase();
                const address = (feature.address || '').toLowerCase();

                // Bonus for address type (highest priority)
                if (feature.place_type.includes('address')) {
                  matchScore += 50;
                }

                // Bonus if query contains numbers (likely door number)
                const hasNumbers = /\d/.test(query);
                if (hasNumbers && feature.address) {
                  matchScore += 30;
                }

                // Bonus for exact text match
                if (text === queryLower || address === queryLower) {
                  matchScore += 40;
                }

                // Bonus if place name starts with query
                if (placeName.startsWith(queryLower)) {
                  matchScore += 20;
                }

                // Count matching words
                const queryWords = queryLower.split(/[\s,]+/).filter(w => w.length > 1);
                queryWords.forEach(word => {
                  if (placeName.includes(word)) {
                    matchScore += 5;
                  }
                });

                // Mapbox relevance score
                matchScore += (feature.relevance || 0) * 10;

                feature.matchScore = matchScore;
                allFeatures.push(feature);
              }
            });
          }
        }
      }

      // Sort by match score (highest first)
      allFeatures.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

      // Take top 10 results
      setSearchResults(allFeatures.slice(0, 10));

    } catch (error) {
      console.error('Error searching places:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchLocation && searchLocation.length > 2) {
        searchPlaces(searchLocation);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchLocation]);

  const initializeMap = () => {
    if (!mapRef.current || mapInstance.current) return;

    // Check if Mapbox token is available
    if (!MAPBOX_TOKEN) {
      console.warn('Mapbox token not configured. Map features will be limited.');
      toast({
        title: "Mapbox Token Missing",
        description: "Map functionality requires a Mapbox access token. Please configure it in your environment variables.",
        variant: "destructive"
      });
      return;
    }

    // Get user's location first, then initialize map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const accuracy = position.coords.accuracy;

          console.log('High accuracy location detected:', {
            lat: userLat,
            lng: userLng,
            accuracy: accuracy + 'm'
          });

          try {
            // Ensure container still exists
            if (!mapRef.current) {
              console.error('Map container disappeared before initialization');
              return;
            }

            // Calculate appropriate zoom level based on accuracy
            let zoomLevel = 18; // default
            if (accuracy < 20) {
              zoomLevel = 20; // Very accurate - zoom in close
            } else if (accuracy < 50) {
              zoomLevel = 19;
            } else if (accuracy < 100) {
              zoomLevel = 18;
            } else if (accuracy < 500) {
              zoomLevel = 16;
            } else if (accuracy < 1000) {
              zoomLevel = 15;
            } else {
              zoomLevel = 14; // Poor accuracy - zoom out more to see surroundings
            }

            // Initialize Mapbox map with user's actual location
            const map = new mapboxgl.Map({
              container: mapRef.current!,
              style: 'mapbox://styles/mapbox/streets-v12',
              center: [userLng, userLat], // Use actual GPS coordinates
              zoom: zoomLevel,
              projection: 'mercator' as any
            });

            mapInstance.current = map;

            // Add navigation controls
            map.addControl(new mapboxgl.NavigationControl(), 'top-right');

            // Wait for map to load
            map.on('load', () => {
              console.log('Mapbox map loaded successfully at user location');

              // Update the address for user's location
              handleMapMove(userLat, userLng);

              // Log accuracy info without showing toasts
              console.log('GPS accuracy:', accuracy + 'm');
            });

            map.on('error', (e) => {
              console.error('Mapbox error:', e);
              toast({
                title: "Map Error",
                description: `Failed to load map: ${e.error.message}. Please try again.`,
                variant: "destructive"
              });
            });

            // Add drag event listeners with debouncing
            map.on('movestart', () => {
              setIsLoadingAddress(true);
            });

            map.on('moveend', () => {
              const center = map.getCenter();
              handleMapMove(center.lat, center.lng);
            });

          } catch (error) {
            console.error('Error initializing Mapbox map:', error);
            toast({
              title: "Map Error",
              description: "Failed to initialize map. Please try again.",
              variant: "destructive"
            });
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Could not detect location. ';

          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please enable location permissions in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information unavailable. Please check your GPS/network.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out. Please try searching for your location manually.';
              break;
          }

          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive",
            duration: 5000,
          });

          // Close map view and let user search manually
          setShowMapView(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 0
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Please search for your location manually.",
        variant: "destructive",
      });
      setShowMapView(false);
    }
  };

  const handleMapMove = async (lat: number, lng: number) => {
    // Clear any existing timeout
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
    }

    setIsLoadingAddress(true);

    // Debounce the geocoding request
    moveTimeoutRef.current = setTimeout(async () => {
      try {
        const address = await reverseGeocode(lat, lng);
        setSelectedMapLocation({ lat, lng, address });
      } catch (error) {
        console.error('Error fetching address:', error);
        setSelectedMapLocation({ lat, lng, address: 'Bengaluru, Karnataka, India' });
      }
      setIsLoadingAddress(false);
    }, 500); // Wait 500ms after user stops moving the map
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Check if Mapbox token is available
    if (!MAPBOX_TOKEN) {
      console.warn('Mapbox token not configured. Reverse geocoding will not work.');
      return `${lat.toFixed(7)}°N, ${lng.toFixed(7)}°E`;
    }

    try {
      // Use maximum precision coordinates
      const precisionLng = parseFloat(lng.toFixed(10));
      const precisionLat = parseFloat(lat.toFixed(10));

      // Try multiple geocoding requests for better accuracy
      const responses = await Promise.all([
        // Request 1: Address-focused with POI
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${precisionLng},${precisionLat}.json?` +
          `access_token=${MAPBOX_TOKEN}&` +
          `types=address,poi&` +
          `limit=3&` +
          `language=en&` +
          `reverseMode=distance`
        ),
        // Request 2: Include all location types
        fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${precisionLng},${precisionLat}.json?` +
          `access_token=${MAPBOX_TOKEN}&` +
          `types=address,poi,locality,neighborhood,place&` +
          `limit=5&` +
          `language=en`
        )
      ]);

      for (const response of responses) {
        if (response.ok) {
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            // Prefer addresses over POIs
            const addressFeature = data.features.find((f: any) =>
              f.place_type.includes('address') ||
              f.id.startsWith('address')
            );

            const selectedFeature = addressFeature || data.features[0];
            const address = selectedFeature.place_name;
            const distance = selectedFeature.properties?.distance || 0;

            console.log('Geocoded address:', address, 'distance:', distance + 'm', 'for coordinates:', {
              lat: precisionLat,
              lng: precisionLng
            });

            // If distance is too large, warn user
            if (distance > 100) {
              console.warn('Address is', distance, 'meters away from pin location');
            }

            return address;
          }
        }
      }

      console.error('All geocoding attempts failed');
    } catch (error) {
      console.error('Geocoding error:', error);
    }

    // Fallback with coordinates
    return `${lat.toFixed(7)}°N, ${lng.toFixed(7)}°E`;
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (mapInstance.current) {
            mapInstance.current.flyTo({
              center: [lng, lat],
              zoom: 16
            });
          }

          fetchAddressFromCoords(lat, lng);
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to get your location. ';

          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access and try again.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'Please try again.';
              break;
          }

          toast({
            title: "Location Error",
            description: errorMessage,
            variant: "destructive",
          });

          // Fallback to default location
          setTimeout(() => {
            handleSelectLocation("Bengaluru, Karnataka, India");
          }, 2000);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });

      setTimeout(() => {
        handleSelectLocation("Bengaluru, Karnataka, India");
      }, 2000);
    }
  };

  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    setIsLoadingAddress(true);
    try {
      const address = await reverseGeocode(lat, lng);
      setCurrentLocation(address);
      setSearchLocation(address);
      setSelectedMapLocation({ lat, lng, address });
      onLocationSelect?.(address);
    } catch (error) {
      console.error("Error fetching address:", error);
      const errorMsg = `${lat.toFixed(6)}°N, ${lng.toFixed(6)}°E`;
      setCurrentLocation(errorMsg);
      setSearchLocation(errorMsg);
      setSelectedMapLocation({ lat, lng, address: errorMsg });
      onLocationSelect?.(errorMsg);

      toast({
        title: "Address Not Found",
        description: "Could not get address for this location. Showing coordinates instead.",
        variant: "destructive",
      });
    }
    setIsLoadingAddress(false);
  };

  const handleSelectLocation = (location: string) => {
    setCurrentLocation(location);
    onLocationSelect?.(location);
    onOpenChange(false);
  };

  const handleSearchResultSelect = async (result: any) => {
    try {
      const [lng, lat] = result.center;
      const address = result.place_name;

      setCurrentLocation(address);
      setSearchLocation(address);
      onLocationSelect?.(address);
      setSearchResults([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error selecting place:', error);
      toast({
        title: "Error",
        description: "Failed to select location. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMapSelection = () => {
    setShowMapView(true);
    setSearchResults([]);
    setSearchLocation("");
  };

  const handleConfirmMapLocation = () => {
    if (selectedMapLocation) {
      const locationToSave = selectedMapLocation.address;

      console.log("Confirming location:", {
        address: locationToSave,
        lat: selectedMapLocation.lat,
        lng: selectedMapLocation.lng,
        isManuallyEdited: isEditingAddress || manualAddress !== ""
      });

      setCurrentLocation(locationToSave);
      localStorage.setItem('selectedLocation', locationToSave);
      localStorage.setItem('selectedLocationCoords', JSON.stringify({
        lat: selectedMapLocation.lat,
        lng: selectedMapLocation.lng
      }));

      toast({
        title: "Location Saved",
        description: `Your delivery location has been set to: ${locationToSave}`,
        duration: 3000,
      });

      // Go back to the main location modal view instead of closing
      setShowMapView(false);
      setSelectedMapLocation(null);
      setIsEditingAddress(false);
      setManualAddress("");
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      // Don't close the modal - just go back to the main view
      // The user can now see the updated location and decide to close or change it
    }
  };

  useEffect(() => {
    if (showMapView) {
      // Clean up any existing map first
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (error) {
          console.error('Error removing existing map:', error);
        }
        mapInstance.current = null;
      }

      setTimeout(() => {
        initializeMap();
      }, 100);
    }

    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (error) {
          console.error('Error removing map on cleanup:', error);
        }
        mapInstance.current = null;
      }
    };
  }, [showMapView]);

  useEffect(() => {
    if (!open) {
      setShowMapView(false);
      setSelectedMapLocation(null);
      setSearchResults([]);
      setSearchLocation("");
      setIsEditingAddress(false);
      setManualAddress("");

      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
        moveTimeoutRef.current = null;
      }

      if (markerRef.current) {
        try {
          markerRef.current.remove();
        } catch (error) {
          console.error('Error removing marker:', error);
        }
        markerRef.current = null;
      }

      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (error) {
          console.error('Error removing map:', error);
        }
        mapInstance.current = null;
      }
    }
  }, [open]);

  if (showMapView) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-screen h-screen max-w-none mx-0 flex flex-col p-0 bg-white rounded-none border-0 shadow-xl sm:max-w-sm sm:mx-auto sm:h-[85vh] sm:rounded-2xl">
          <DialogHeader className="p-4 border-b border-gray-100">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => {
                    setShowMapView(false);
                    setSearchResults([]);
                    setSearchLocation("");
                    setSelectedMapLocation(null);
                    setIsEditingAddress(false);
                    setManualAddress("");

                    if (moveTimeoutRef.current) {
                      clearTimeout(moveTimeoutRef.current);
                      moveTimeoutRef.current = null;
                    }

                    if (markerRef.current) {
                      try {
                        markerRef.current.remove();
                      } catch (error) {
                        console.error('Error removing marker:', error);
                      }
                      markerRef.current = null;
                    }

                    if (mapInstance.current) {
                      try {
                        mapInstance.current.remove();
                      } catch (error) {
                        console.error('Error removing map:', error);
                      }
                      mapInstance.current = null;
                    }
                  }}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                  data-testid="button-back-from-map"
                >
                  <i className="fas fa-arrow-left text-gray-600"></i>
                </Button>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Select Location</h3>
                  <p className="text-sm text-gray-500">Move map to adjust pin</p>
                </div>
              </div>
            </DialogTitle>
            <DialogDescription className="sr-only">Move the map pin to select your delivery location</DialogDescription>
          </DialogHeader>

          <div className="flex-1 relative overflow-hidden">
            <div
              ref={mapRef}
              className="w-full h-full"
              style={{ minHeight: '400px' }}
            />

            {/* GPS Accuracy Helper */}
            {selectedMapLocation && (
              <div className="absolute top-4 left-4 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-sm z-10">
                <div className="flex items-start gap-2">
                  <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                  <div className="flex-1 text-xs text-blue-800">
                    <strong>Tip:</strong> Drag the map to move the pin to your exact building/house location. The blue circle (if visible) shows GPS uncertainty area.
                  </div>
                </div>
              </div>
            )}

            {/* Centered Pin */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="relative">
                <svg
                  width="40"
                  height="48"
                  viewBox="0 0 40 48"
                  className="drop-shadow-lg"
                >
                  <ellipse cx="20" cy="44" rx="8" ry="4" fill="rgba(0,0,0,0.2)" />
                  <path
                    d="M20 0C12.268 0 6 6.268 6 14c0 10.5 14 34 14 34s14-23.5 14-34c0-7.732-6.268-14-14-14z"
                    fill="#ef4444"
                    stroke="#fff"
                    strokeWidth="2"
                  />
                  <circle cx="20" cy="14" r="6" fill="#fff" />
                  <circle cx="20" cy="14" r="3" fill="#ef4444" />
                </svg>
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-red-500/30 rounded-full animate-ping"></div>
              </div>
            </div>

            {selectedMapLocation && (
              <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg z-10">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <i className="fas fa-map-marker-alt text-white text-xs"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-1">Selected location</p>
                    {isEditingAddress ? (
                      <div className="space-y-2">
                        <Input
                          value={manualAddress}
                          onChange={(e) => setManualAddress(e.target.value)}
                          placeholder="Enter your exact address"
                          className="text-sm"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setIsEditingAddress(false);
                              setManualAddress("");
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={async () => {
                              if (manualAddress.trim()) {
                                setIsLoadingAddress(true);

                                try {
                                  // Geocode the manual address to get coordinates
                                  const response = await fetch(
                                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(manualAddress.trim())}.json?` +
                                    `access_token=${MAPBOX_TOKEN}&` +
                                    `country=IN&` +
                                    `limit=1&` +
                                    `types=address,poi,place`
                                  );

                                  if (response.ok) {
                                    const data = await response.json();

                                    if (data.features && data.features.length > 0) {
                                      const [lng, lat] = data.features[0].center;
                                      const geocodedAddress = data.features[0].place_name;

                                      // Update location with geocoded coordinates
                                      setSelectedMapLocation({
                                        lat,
                                        lng,
                                        address: geocodedAddress
                                      });

                                      // Move map to the new location
                                      if (mapInstance.current) {
                                        mapInstance.current.flyTo({
                                          center: [lng, lat],
                                          zoom: 18,
                                          duration: 1500
                                        });
                                      }

                                      setIsEditingAddress(false);
                                      setManualAddress("");

                                      toast({
                                        title: "Location Found",
                                        description: "Map moved to the entered address. Adjust pin if needed.",
                                      });
                                    } else {
                                      toast({
                                        title: "Address Not Found",
                                        description: "Could not find this address. Please try a different one.",
                                        variant: "destructive",
                                      });
                                    }
                                  }
                                } catch (error) {
                                  console.error('Error geocoding address:', error);
                                  toast({
                                    title: "Error",
                                    description: "Failed to find address. Please try again.",
                                    variant: "destructive",
                                  });
                                } finally {
                                  setIsLoadingAddress(false);
                                }
                              }
                            }}
                            className="flex-1 bg-fuel-yellow-500 hover:bg-fuel-yellow-600"
                            disabled={isLoadingAddress}
                          >
                            {isLoadingAddress ? (
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Finding...</span>
                              </div>
                            ) : (
                              "Save & Move Pin"
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-gray-900 leading-relaxed break-words">
                          {isLoadingAddress ? (
                            <span className="flex items-center space-x-2">
                              <div className="w-3 h-3 border border-gray-400 border-t-fuel-yellow-500 rounded-full animate-spin flex-shrink-0"></div>
                              <span>Getting address...</span>
                            </span>
                          ) : (
                            selectedMapLocation.address
                          )}
                        </p>
                        {!isLoadingAddress && (
                          <button
                            onClick={() => {
                              setManualAddress(selectedMapLocation.address);
                              setIsEditingAddress(true);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700 mt-2 flex items-center gap-1"
                          >
                            <i className="fas fa-edit"></i>
                            <span>Edit address</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100">
            {selectedMapLocation && (
              <Button
                onClick={handleConfirmMapLocation}
                className="w-full bg-fuel-yellow-500 hover:bg-fuel-yellow-600 text-white py-3 rounded-xl font-medium"
                disabled={isLoadingAddress}
                data-testid="button-confirm-map-location"
              >
                {isLoadingAddress ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Confirm Location"
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none mx-0 my-0 overflow-hidden flex flex-col p-0 bg-white rounded-none border-0 shadow-xl sm:max-w-md sm:mx-auto sm:max-h-[90vh] sm:rounded-2xl sm:my-auto">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Set location</h3>
              <p className="text-sm text-gray-500 mt-1">Where should we deliver?</p>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">Search for or select your delivery address</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="relative mb-3">
            <Input
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search for area, street name..."
              className="pl-10 pr-4 py-3 rounded-xl border-0 bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-500 outline-none shadow-none focus:outline-none focus:ring-0 focus:shadow-none focus:border-0"
              data-testid="input-location-search"
            />
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button
              onClick={handleUseCurrentLocation}
              className="bg-fuel-yellow-500 hover:bg-fuel-yellow-600 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
              data-testid="button-current-location"
            >
              <i className="fas fa-location-arrow text-sm"></i>
              <span>Current Location</span>
            </Button>
            <Button
              onClick={handleMapSelection}
              className="bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
              data-testid="button-choose-map"
            >
              <i className="fas fa-map text-sm"></i>
              <span>Choose on Map</span>
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 mb-3">
                Search Results ({searchResults.length})
              </h4>
              {searchResults.map((result: any, index: number) => {
                // Highlight matching parts of the query in the place name
                const queryParts = searchLocation.toLowerCase().split(/[\s,]+/).filter(p => p.length > 2);
                const placeName = result.place_name;

                return (
                  <button
                    key={result.id || index}
                    onClick={() => handleSearchResultSelect(result)}
                    className="w-full flex items-start space-x-3 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-colors text-left"
                  >
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i className="fas fa-map-marker-alt text-orange-600 text-xs"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm mb-1">
                        {result.text || result.place_name?.split(',')[0]}
                      </p>
                      <p className="text-xs text-gray-600 break-words leading-relaxed line-clamp-2">
                        {placeName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {result.place_type.includes('address') && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                            Exact Address
                          </span>
                        )}
                        {result.address && (
                          <span className="text-[10px] text-gray-500">
                            #{result.address}
                          </span>
                        )}
                      </div>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400 text-xs flex-shrink-0 mt-2"></i>
                  </button>
                );
              })}
            </div>
          )}

          {isSearching && searchLocation.length > 2 && (
            <div className="flex items-center justify-center py-2 mb-4">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-fuel-yellow-500 rounded-full animate-spin"></div>
                <span className="text-sm">Searching...</span>
              </div>
            </div>
          )}

          {currentLocation && currentLocation !== "Bengaluru, Karnataka" && (
            <div className="mb-4">
              <button
                onClick={() => handleSelectLocation(currentLocation)}
                className="w-full bg-fuel-yellow-50 border border-fuel-yellow-200 rounded-xl p-3 hover:bg-fuel-yellow-100 hover:border-fuel-yellow-300 transition-colors text-left"
                data-testid="button-current-location-select"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-fuel-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fas fa-location-arrow text-white text-xs"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-fuel-yellow-800 uppercase tracking-wide">Current Location</p>
                    <p className="text-sm text-gray-900 font-medium mt-1 break-words leading-relaxed">{currentLocation}</p>
                  </div>
                  <i className="fas fa-check text-fuel-yellow-600 text-sm flex-shrink-0 mt-1"></i>
                </div>
              </button>
            </div>
          )}

          {!searchResults.length && !isSearching && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Saved addresses</h4>
              <div className="space-y-2">
                <button
                  onClick={() => handleSelectLocation("123 MG Road, Bengaluru, Karnataka 560001")}
                  className="w-full flex items-start space-x-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors text-left"
                  data-testid="button-address-home"
                >
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fas fa-home text-green-600 text-xs"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm mb-1">Home</p>
                    <p className="text-xs text-gray-600 break-words leading-relaxed">
                      123 MG Road, Bengaluru, Karnataka 560001
                    </p>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400 text-xs flex-shrink-0 mt-2"></i>
                </button>

                <button
                  onClick={() => handleSelectLocation("45 Brigade Road, Bengaluru, Karnataka 560025")}
                  className="w-full flex items-start space-x-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors text-left"
                  data-testid="button-address-work"
                >
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fas fa-briefcase text-blue-600 text-xs"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm mb-1">Work</p>
                    <p className="text-xs text-gray-600 break-words leading-relaxed">
                      45 Brigade Road, Bengaluru, Karnataka 560025
                    </p>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400 text-xs flex-shrink-0 mt-2"></i>
                </button>

                <button
                  onClick={() => handleSelectLocation("78 Koramangala 4th Block, Bengaluru, Karnataka 560034")}
                  className="w-full flex items-start space-x-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors text-left"
                  data-testid="button-address-friend"
                >
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i className="fas fa-heart text-purple-600 text-xs"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm mb-1">Friend's Place</p>
                    <p className="text-xs text-gray-600 break-words leading-relaxed">
                      78 Koramangala 4th Block, Bengaluru, Karnataka 560034
                    </p>
                  </div>
                  <i className="fas fa-chevron-right text-gray-400 text-xs flex-shrink-0 mt-2"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}