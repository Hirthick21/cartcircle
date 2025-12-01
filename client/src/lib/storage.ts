
// ──────────────────────────────────────────────────────────────
// FILE: src/lib/storage.ts
// ──────────────────────────────────────────────────────────────
export const TERMS_VERSION = '2025-11-01'; // bump when Terms/Privacy change
export const LS_TERMS = 'cc_terms';
export const LS_ONB = 'cc_onboarding';
export const LS_PROFILE = 'cc_profile';

type TermsState = { accepted: boolean; version: string; ts: number };
type OnbState = { completed: boolean; ts: number; version: string };

export function getTerms(): TermsState | null {
  const raw = localStorage.getItem(LS_TERMS);
  return raw ? JSON.parse(raw) : null;
}

export function setTerms(accepted: boolean): void {
  const payload: TermsState = { accepted, version: TERMS_VERSION, ts: Date.now() };
  localStorage.setItem(LS_TERMS, JSON.stringify(payload));
}

export function getOnboarding(): OnbState | null {
  const raw = localStorage.getItem(LS_ONB);
  return raw ? JSON.parse(raw) : null;
}

export function setOnboarding(completed: boolean): void {
  const payload: OnbState = { completed, version: TERMS_VERSION, ts: Date.now() };
  localStorage.setItem(LS_ONB, JSON.stringify(payload));
}

export function setOnboardingCompleted(): void {
  const payload: OnbState = { completed: true, version: TERMS_VERSION, ts: Date.now() };
  localStorage.setItem(LS_ONB, JSON.stringify(payload));
}

export function getProfile(): any | null {
  const raw = localStorage.getItem(LS_PROFILE);
  return raw ? JSON.parse(raw) : null;
}

export function setProfile(profile: any): void {
  localStorage.setItem(LS_PROFILE, JSON.stringify(profile));
}

export function clearAll(): void {
  localStorage.removeItem(LS_TERMS);
  localStorage.removeItem(LS_ONB);
  localStorage.removeItem(LS_PROFILE);
}
