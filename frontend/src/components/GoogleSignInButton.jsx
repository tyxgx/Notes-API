import { useCallback, useEffect, useRef } from 'react';

const GOOGLE_BUTTON_OPTIONS = {
  type: 'standard',
  theme: 'filled_blue',
  text: 'signin_with',
  size: 'large',
  shape: 'pill',
  width: 320,
  logo_alignment: 'left'
};

export default function GoogleSignInButton({ onCredential, disabled = false }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const buttonRef = useRef(null);
  const initializedRef = useRef(false);

  const handleCredential = useCallback((response) => {
    if (!response?.credential || typeof onCredential !== 'function') return;
    onCredential(response.credential);
  }, [onCredential]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (disabled) return;
    if (!clientId || !window.google?.accounts?.id || !buttonRef.current || initializedRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
      ux_mode: 'popup',
      auto_select: false
    });

    window.google.accounts.id.renderButton(
      buttonRef.current,
      GOOGLE_BUTTON_OPTIONS
    );

    initializedRef.current = true;
    window.google.accounts.id.prompt(); // show One Tap if available
  }, [handleCredential, disabled, clientId]);

  if (!clientId) {
    return (
      <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
        Google Sign-In is not configured. Set <code className="font-mono">VITE_GOOGLE_CLIENT_ID</code>.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={buttonRef} className="flex justify-center w-full" />
    </div>
  );
}
