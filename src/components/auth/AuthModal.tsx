import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Brain,
  ArrowRight,
  X,
  Mail,
  Lock,
  User as UserIcon,
  CheckCircle2,
} from 'lucide-react';
import { User } from '../../types';
import { mockLoginWithEmail, mockLoginWithGoogle, mockSignup } from '../../services/mockAuth';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const user = await mockLoginWithGoogle();
      onSuccess(user);
      onClose();
    } catch {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const user = await mockSignup(name, email, password);
        onSuccess(user);
      } else {
        const user = await mockLoginWithEmail(email, password);
        onSuccess(user);
      }
      onClose();
    } catch {
      setError('Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative flex flex-col md:flex-row w-full max-w-4xl min-h-[580px] rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 rounded-full bg-neutral-800/80 p-2 text-neutral-400 hover:bg-neutral-700 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Left: Form Area */}
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 z-10 bg-neutral-900">
            <div>
              {/* Brand Logo */}
              <div className="flex items-center gap-2.5 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px]">
                  <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-neutral-950">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                  </div>
                </div>
                <span className="font-extrabold text-base text-neutral-100 tracking-tight">
                  Dilshad AI
                </span>
              </div>

              {/* Heading & Subtitle */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-100 tracking-tight">
                {mode === 'login' ? 'Welcome to Dilshad AI' : 'Create your Dilshad AI account'}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 mb-6">
                {mode === 'login'
                  ? 'Your intelligent AI assistant.'
                  : 'Start thinking, drafting, and building with next-gen models.'}
              </p>

              {/* Continue with Google */}
              <button
                id="btn-auth-google"
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border border-neutral-700/80 bg-neutral-950 px-4 py-3 text-xs sm:text-sm font-semibold text-neutral-100 hover:bg-neutral-800/80 hover:border-neutral-600 transition shadow-sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center my-5">
                <div className="flex-1 border-t border-neutral-800" />
                <span className="px-3 text-[11px] uppercase font-mono text-neutral-500">OR</span>
                <div className="flex-1 border-t border-neutral-800" />
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Dilshad Developer"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@workspace.ai"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => alert('Password reset link sent to provided email address.')}
                        className="text-[11px] text-indigo-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 py-2.5 pl-10 pr-3 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                  id="btn-auth-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition mt-4"
                >
                  <span>{mode === 'login' ? 'Continue' : 'Create Account'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Bottom Toggle / Terms */}
            <div className="pt-6 border-t border-neutral-800/80 text-center text-xs text-neutral-400">
              {mode === 'login' ? (
                <p>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-semibold text-indigo-400 hover:underline"
                  >
                    Create account
                  </button>
                </p>
              ) : (
                <div className="space-y-2">
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="font-semibold text-indigo-400 hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    By registering, you agree to Dilshad AI Terms of Service and Privacy Policy.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Branding & Feature Visual (Desktop Split-Screen) */}
          <div className="hidden md:flex flex-1 flex-col justify-between p-10 bg-gradient-to-br from-indigo-950/60 via-neutral-950 to-neutral-950 border-l border-neutral-800/80 relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-900/40 border border-indigo-500/30 px-3 py-1 text-xs font-semibold text-indigo-300 mb-6">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>Next-Gen Dilshad AI Engine</span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                Intelligent Reasoning for the Modern Frontier
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-sm">
                Seamlessly synthesize long documents, code complex architectures, and generate high-impact strategy in seconds.
              </p>
            </div>

            {/* Feature Highlights List */}
            <div className="relative z-10 space-y-3.5 my-8">
              {[
                'Deep reasoning engine with multi-step validation',
                '2 Million token unified multimodal context window',
                'Zero-latency coding copilot with markdown execution',
                'Enterprise-grade private workspace security',
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs text-neutral-200">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-800/80 pt-4">
              <span>Dilshad AI v2.5 Pro</span>
              <span>SOC2 & Enterprise Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
