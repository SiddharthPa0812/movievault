import { Film, ShieldCheck, Sparkles } from "lucide-react";
import GoogleSignInButton from "../components/GoogleSignInButton";

const highlights = [
  {
    icon: Film,
    title: "Track every watch",
    description: "Store movies, anime, ratings, posters, and watch history in one elegant archive.",
  },
  {
    icon: Sparkles,
    title: "Beautiful dark dashboard",
    description: "Jump into gradients, premium glass cards, category tiers, and live archive stats.",
  },
  {
    icon: ShieldCheck,
    title: "Google sign-in access",
    description: "Use your Google account to enter MovieVault and keep your session ready in real time.",
  },
];

function LoginPage({ onCredential, googleClientId }) {
  return (
    <div className="login-shell">
      <section className="login-hero">
        <div className="login-copy">
          <span className="login-kicker">MovieVault</span>
          <h1>Your premium archive for movies, anime, and unforgettable watch nights.</h1>
          <p>
            Walk into a cinematic dashboard with glossy gradients, rich entry cards, and a cleaner way to preserve every
            rating, tier, and review.
          </p>
        </div>

        <div className="login-highlights">
          {highlights.map(({ icon: Icon, title, description }) => (
            <article className="glass-card login-highlight" key={title}>
              <span className="login-highlight-icon">
                <Icon size={18} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="glass-card login-panel">
        <div className="login-brand-badge">
          <img src="/cinevault-mark.svg" alt="MovieVault logo" />
        </div>
        <span className="eyebrow">Sign in to continue</span>
        <h2>Enter MovieVault</h2>
        <p className="login-panel-copy">Use Google to unlock your archive and jump straight into your dashboard.</p>
        <GoogleSignInButton clientId={googleClientId} onCredential={onCredential} />
      </aside>
    </div>
  );
}

export default LoginPage;
