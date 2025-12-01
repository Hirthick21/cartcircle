
import React from 'react';
import { Redirect } from 'wouter';
import { useAuthContext } from '../auth/AuthContext';
import { getTerms, TERMS_VERSION, getOnboarding } from '../lib/storage';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Redirect to="/" />;
  return <>{children}</>;
};

export const RequireTerms: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const state = getTerms();
  const valid = !!state?.accepted && state.version === TERMS_VERSION;
  if (!valid) return <Redirect to="/terms" />;
  return <>{children}</>;
};

export const RequireOnboarding: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const onb = getOnboarding();
  if (!onb?.completed) return <Redirect to="/onboarding" />;
  return <>{children}</>;
};
