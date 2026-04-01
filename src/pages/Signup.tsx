import * as React from "react";
import { motion } from "motion/react";
import { GraduationCap, Mail, Lock, User, School, ArrowRight, Github, Chrome, Loader2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "../contexts/AuthContext";

export function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, login, loginWithGoogle } = useAuth();
  
  const isLogin = location.pathname === "/login";
  const [role, setRole] = React.useState<UserRole>("teacher");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name, role);
      }
      navigate("/dashboard");
    } catch (err: any) {
      if (err.code === "auth/operation-not-allowed") {
        setError("Email/Password registration is not enabled in the Firebase Console. Please enable it under Authentication > Sign-in method.");
      } else {
        setError(err.message || "An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
              <GraduationCap size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">BeleX</span>
          </Link>
          <h2 className="text-4xl font-bold text-slate-900 font-serif">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-slate-500">
            {isLogin ? "Log in to your academic dashboard." : "Join the elite academic ecosystem."}
          </p>
        </div>

        <Card className="p-8 shadow-xl border-slate-100">
          {!isLogin && (
            <div className="mb-8 flex rounded-full bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setRole("teacher")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-all ${role === "teacher" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <User size={16} />
                I am a Teacher
              </button>
              <button
                type="button"
                onClick={() => setRole("school")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-bold transition-all ${role === "school" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <School size={16} />
                Hire for School
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label htmlFor="terms" className="ml-2 block text-xs text-slate-500">
                  I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </label>
              </div>
            )}

            <Button className="w-full h-12 text-base" size="lg" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  {isLogin ? "Log In" : "Create Account"}
                  <ArrowRight className="ml-2" size={18} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4">
            <Button 
              type="button"
              variant="outline" 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="h-12 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              <Chrome size={18} className="mr-2" />
              Google
            </Button>
          </div>
        </Card>

        <p className="text-center text-sm text-slate-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link to={isLogin ? "/signup" : "/login"} className="font-bold text-primary hover:underline">
            {isLogin ? "Sign up" : "Log in"}
          </Link>
        </p>
      </div>
    </div>
  );
}
