import { useState, useEffect } from "react";
import Welcome from "@/pages/welcome";
import LocationSetup from "@/pages/location-setup";
import ProfileSetup from "@/pages/profile-setup";
import AppTutorial from "@/pages/app-tutorial";
import TermsConditions from "@/pages/terms-conditions";
import Permissions from "@/pages/permissions";
import { getTerms, setTerms, getOnboarding, setOnboardingCompleted, TERMS_VERSION } from "@/lib/storage";

interface OnboardingFlowProps {
  onComplete: () => void;
  userInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

type OnboardingStep = 
  | 'welcome'
  | 'permissions'
  | 'location'
  | 'profile'
  | 'tutorial'
  | 'terms'
  | 'completed';

export default function OnboardingFlow({ onComplete, userInfo }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = useState({
    location: '',
    profileData: {},
    permissionsGranted: {
      location: false,
      notifications: false
    }
  });

  // Check if user has already completed onboarding
  useEffect(() => {
    const onboardingState = getOnboarding();
    const termsState = getTerms();
    const hasRequiredInfo = userInfo?.firstName && userInfo?.email;
    
    // If onboarding completed and has required info, skip to main app
    if (onboardingState?.completed && hasRequiredInfo) {
      onComplete();
      return;
    }

    // Check if terms are accepted and current version
    if (!termsState?.accepted || termsState.version !== TERMS_VERSION) {
      setCurrentStep('terms');
      return;
    }

    // Start onboarding flow
    setCurrentStep('welcome');
  }, [onComplete, userInfo]);

  const handleStepComplete = (step: OnboardingStep, data?: any) => {
    // Update onboarding data if provided
    if (data) {
      setOnboardingData(prev => ({
        ...prev,
        ...data
      }));
    }

    // Determine next step
    switch (step) {
      case 'welcome':
        setCurrentStep('permissions');
        break;
      case 'permissions':
        if (data) {
          setOnboardingData(prev => ({
            ...prev,
            permissionsGranted: data
          }));
        }
        setCurrentStep('location');
        break;
      case 'location':
        if (data) {
          setOnboardingData(prev => ({
            ...prev,
            location: data
          }));
        }
        // Skip profile setup if we already have user info
        if (userInfo?.firstName && userInfo?.email) {
          setCurrentStep('tutorial');
        } else {
          setCurrentStep('profile');
        }
        break;
      case 'profile':
        if (data) {
          setOnboardingData(prev => ({
            ...prev,
            profileData: data
          }));
        }
        setCurrentStep('tutorial');
        break;
      case 'tutorial':
        setCurrentStep('completed');
        break;
      case 'terms':
        setTerms(true);
        setCurrentStep('welcome');
        break;
      case 'completed':
        // Mark onboarding as completed
        setOnboardingCompleted();
        
        // Save all collected data to localStorage
        if (onboardingData.location) {
          localStorage.setItem('selectedLocation', onboardingData.location);
        }
        if (Object.keys(onboardingData.profileData).length > 0) {
          localStorage.setItem('profileData', JSON.stringify(onboardingData.profileData));
        }
        localStorage.setItem('permissionsGranted', JSON.stringify(onboardingData.permissionsGranted));
        
        onComplete();
        break;
    }
  };

  const handleSkip = (step: OnboardingStep) => {
    // Handle skip logic for each step
    switch (step) {
      case 'permissions':
        setCurrentStep('location');
        break;
      case 'location':
        if (userInfo?.firstName && userInfo?.email) {
          setCurrentStep('tutorial');
        } else {
          setCurrentStep('profile');
        }
        break;
      case 'profile':
        setCurrentStep('tutorial');
        break;
      case 'tutorial':
        setCurrentStep('completed');
        break;
      default:
        handleStepComplete(step);
    }
  };

  const handleTermsDecline = () => {
    // Redirect to landing page or show error
    window.location.href = '/';
  };

  // Render current step
  switch (currentStep) {
    case 'terms':
      return (
        <TermsConditions
          onAccept={() => handleStepComplete('terms')}
          onDecline={handleTermsDecline}
        />
      );
    case 'welcome':
      return (
        <Welcome
          onNext={() => handleStepComplete('welcome')}
        />
      );
    case 'permissions':
      return (
        <Permissions
          onNext={() => handleStepComplete('permissions')}
          onSkip={() => handleSkip('permissions')}
        />
      );
    case 'location':
      return (
        <LocationSetup
          onNext={(location) => handleStepComplete('location', location)}
          onSkip={() => handleSkip('location')}
        />
      );
    case 'profile':
      return (
        <ProfileSetup
          onNext={(profileData) => handleStepComplete('profile', { profileData })}
          onSkip={() => handleSkip('profile')}
          userInfo={userInfo}
        />
      );
    case 'tutorial':
      return (
        <AppTutorial
          onNext={() => handleStepComplete('tutorial')}
          onSkip={() => handleSkip('tutorial')}
        />
      );
    case 'completed':
      // This should not render, but just in case
      handleStepComplete('completed');
      return null;
    default:
      return null;
  }
}