"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const NEU_DOMAINS = ["@northeastern.edu", "@husky.neu.edu"];

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function isNeuEmail(addr: string) {
    return NEU_DOMAINS.some((d) => addr.toLowerCase().endsWith(d));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isNeuEmail(email)) {
      setError(
        "Only Northeastern email addresses are allowed (@northeastern.edu or @husky.neu.edu)"
      );
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split("@")[0] },
        emailRedirectTo: `${window.location.origin}/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="auth-page">
        <div className="auth-shell">
          <div className="auth-header">
            <Link href="/" className="auth-logo">
              E[X]
            </Link>
            <p className="auth-tagline">Northeastern Prediction Markets</p>
          </div>
          <div className="auth-confirm">
            <div className="auth-confirm-icon">&#10003;</div>
            <h2 className="auth-title">Check your email</h2>
            <p className="auth-confirm-text">
              We sent a confirmation link to <strong>{email}</strong>. Click it
              to activate your account and receive your 1,000 Husky Tokens.
            </p>
            <Link
              href="/login"
              className="auth-btn"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-header">
          <Link href="/" className="auth-logo">
            E[X]
          </Link>
          <p className="auth-tagline">Northeastern Prediction Markets</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">
            NEU students only &middot; 1,000 Husky Tokens on signup
          </p>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label className="auth-label" htmlFor="display-name">
              Display name
            </label>
            <input
              id="display-name"
              type="text"
              className="auth-input"
              placeholder="huskybets"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              NEU email
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="you@northeastern.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="auth-input"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create account →"}
          </button>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link href="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
