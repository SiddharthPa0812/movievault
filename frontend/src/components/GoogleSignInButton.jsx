import { useEffect, useRef, useState } from "react";
import { loadGoogleScript } from "../utils/googleAuth";

function GoogleSignInButton({ clientId, onCredential }) {
  const buttonRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!clientId || !buttonRef.current) return;

    let mounted = true;

    loadGoogleScript()
      .then((google) => {
        if (!mounted || !google?.accounts?.id) return;
        google.accounts.id.initialize({
          client_id: clientId,
          callback: onCredential,
          auto_select: false,
        });
        google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          width: 320,
        });
        google.accounts.id.prompt();
      })
      .catch(() => {
        if (mounted) {
          setError("Google sign-in couldn't load. Check your connection or client ID setup.");
        }
      });

    return () => {
      mounted = false;
    };
  }, [clientId, onCredential]);

  if (!clientId) {
    return (
      <div className="google-missing">
        <strong>Google sign-in needs setup</strong>
        <p>Add `VITE_GOOGLE_CLIENT_ID` to your frontend environment, then restart the frontend server.</p>
      </div>
    );
  }

  return (
    <div className="google-auth-shell">
      <div ref={buttonRef} className="google-button-slot" />
      {error ? <p className="auth-note auth-error">{error}</p> : null}
    </div>
  );
}

export default GoogleSignInButton;
