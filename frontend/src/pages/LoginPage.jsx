import { useState } from "react";
import CredentialAuth from "../components/CredentialAuth";

function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("signin");

  return (
    <div className="auth-page">
      <div className="auth-aurora auth-aurora-one" />
      <div className="auth-aurora auth-aurora-two" />
      <div className="auth-aurora auth-aurora-three" />
      <div className="auth-grid-overlay" />

      <div className="auth-stage">
        <section className="auth-showcase">
          <div className="auth-orbit">
            <span className="auth-orbit-ring auth-orbit-ring-a" />
            <span className="auth-orbit-ring auth-orbit-ring-b" />
            <div className="auth-orbit-core">
              <img src="/cinevault-mark.svg" alt="MovieVault" />
            </div>
          </div>
          <div className="auth-showcase-copy">
            <span className="auth-badge">MovieVault</span>
            <h1>Cinematic archive. One vault.</h1>
            <p>Track movies and anime with ratings, posters, tiers, and a dashboard built for late-night marathons.</p>
          </div>
        </section>

        <section className="glass-card auth-card">
          <div className="auth-tabs">
            <button type="button" className={mode === "signin" ? "active" : ""} onClick={() => setMode("signin")}>
              Sign in
            </button>
            <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
              Sign up
            </button>
          </div>

          <div className="auth-card-head">
            <h2>{mode === "signup" ? "Create your vault" : "Welcome back"}</h2>
            <p>
              {mode === "signup"
                ? "Pick a unique username, add your Gmail, and secure your vault with a password."
                : "Sign in with your username and password to open your archive."}
            </p>
          </div>

          <CredentialAuth mode={mode} onSuccess={onLogin} />
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
