import { useEffect, useState } from "react";
import { LoaderCircle, LogIn, UserPlus } from "lucide-react";
import { api } from "../api/client";

function CredentialAuth({ mode, onSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUsernameStatus("");
    setError("");
  }, [mode]);

  useEffect(() => {
    if (mode !== "signup" || !username.trim()) {
      setUsernameStatus("");
      return undefined;
    }

    const timer = window.setTimeout(async () => {
      setCheckingUsername(true);
      try {
        const { data } = await api.get("/auth/check-username/", {
          params: { username: username.trim() },
        });

        if (!data.available) {
          setUsernameStatus(data.error || "This username already exists.");
        } else {
          setUsernameStatus("Username is available.");
        }
      } catch {
        setUsernameStatus("");
      } finally {
        setCheckingUsername(false);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [username, mode]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (mode === "signup") {
      if (usernameStatus === "This username already exists.") {
        setError("This username already exists.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/auth/register/" : "/auth/login/";
      const payload =
        mode === "signup"
          ? {
              username: username.trim(),
              email: email.trim().toLowerCase(),
              password,
            }
          : {
              username: username.trim(),
              password,
            };

      const { data } = await api.post(endpoint, payload);
      onSuccess(data.user || {});
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const usernameTaken = usernameStatus === "This username already exists.";

  return (
    <form className="otp-form" onSubmit={handleSubmit}>
      <label className="field-shell">
        <span>Username</span>
        <input
          type="text"
          autoComplete="username"
          placeholder="moviefan_24"
          value={username}
          onChange={(event) => setUsername(event.target.value.replace(/\s/g, ""))}
          required
        />
        {mode === "signup" && username.trim() ? (
          <small className={`field-hint ${usernameTaken ? "field-hint-error" : "field-hint-ok"}`}>
            {checkingUsername ? "Checking username..." : usernameStatus}
          </small>
        ) : null}
      </label>

      {mode === "signup" ? (
        <label className="field-shell">
          <span>Gmail address</span>
          <input
            type="email"
            autoComplete="email"
            placeholder="you@gmail.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
      ) : null}

      <label className="field-shell">
        <span>Password</span>
        <input
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
        />
      </label>

      {mode === "signup" ? (
        <label className="field-shell">
          <span>Confirm password</span>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            minLength={8}
          />
        </label>
      ) : null}

      {error ? <p className="auth-error">{error}</p> : null}

      <button
        type="submit"
        className="primary-button auth-submit"
        disabled={loading || (mode === "signup" && usernameTaken)}
      >
        {loading ? (
          <LoaderCircle className="spin-icon" size={18} />
        ) : mode === "signup" ? (
          <UserPlus size={18} />
        ) : (
          <LogIn size={18} />
        )}
        {mode === "signup" ? "Create account" : "Sign in"}
      </button>
    </form>
  );
}

export default CredentialAuth;
