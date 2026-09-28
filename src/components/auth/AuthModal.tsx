import React, { useState } from 'react';
import { Bus, X, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { UserProfile } from '../../types/transit';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'forgot') {
      setFeedback('Password reset link sent to your registered email.');
      setTimeout(() => {
        setFeedback(null);
        setMode('login');
      }, 2500);
      return;
    }

    // Successful mock login/signup
    const name = fullName || email.split('@')[0] || 'Commuter';
    onLoginSuccess({
      name,
      email: email || 'commuter@aprtc.gov.in',
      isGuest: false,
    });
    onClose();
  };

  const handleGoogleLogin = () => {
    onLoginSuccess({
      name: 'Google Commuter',
      email: 'user@gmail.com',
      isGuest: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Bus className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {mode === 'login' ? 'Sign In to RTC LiveTrack' : mode === 'signup' ? 'Create Commuter Account' : 'Reset Password'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {feedback && (
          <div className="rounded-xl bg-blue-50 p-3 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            {feedback}
          </div>
        )}

        {/* Google One-Click Login */}
        {mode !== 'forgot' && (
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        )}

        {mode !== 'forgot' && (
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            <span>or with email</span>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Commuter Name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* Mode switch */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                onClick={() => setMode('login')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>

        {/* Guest Mode option */}
        <div className="border-t border-slate-100 pt-3 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            Continue as Guest Commuter →
          </button>
        </div>

      </div>
    </div>
  );
};
