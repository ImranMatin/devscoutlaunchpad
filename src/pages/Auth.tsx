import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) setError(error.message);
      else setMessage("Check your email for a password reset link.");
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
      else navigate("/dashboard");
    } else {
      const { error } = await signUp(email, password);
      if (error) setError(error.message);
      else setMessage("Check your email to verify your account before signing in.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3 mb-8">
          <img src={logo} alt="DevScoutLaunchPad logo" className="w-12 h-12 rounded-lg" />
          <h1 className="text-2xl font-bold text-foreground">DevScoutLaunchPad</h1>
        </Link>

        <div className="glass-panel p-8">
          {mode === "forgot" ? (
            <>
              <h2 className="text-lg font-semibold text-foreground mb-2">Reset Password</h2>
              <p className="text-sm text-muted-foreground mb-6">Enter your email and we'll send you a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 bg-card/60 border-border" />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                {message && <p className="text-sm text-primary">{message}</p>}
                <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Send Reset Link
                </Button>
                <button type="button" onClick={() => { setMode("login"); setError(""); setMessage(""); }} className="w-full text-sm text-muted-foreground hover:text-primary transition-colors">
                  Back to Sign In
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex mb-6 rounded-lg overflow-hidden border border-border">
                <button
                  onClick={() => { setMode("login"); setError(""); setMessage(""); }}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode === "login" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMode("signup"); setError(""); setMessage(""); }}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${mode === "signup" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  Sign Up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10 bg-card/60 border-border" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="pl-10 bg-card/60 border-border" />
                  </div>
                </div>

                {mode === "login" && (
                  <button type="button" onClick={() => { setMode("forgot"); setError(""); setMessage(""); }} className="text-xs text-muted-foreground hover:text-primary transition-colors">
                    Forgot password?
                  </button>
                )}

                {error && <p className="text-sm text-destructive">{error}</p>}
                {message && <p className="text-sm text-primary">{message}</p>}

                <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {mode === "login" ? "Sign In" : "Create Account"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
