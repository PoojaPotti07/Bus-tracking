import React, { useState } from 'react';
import { UserProfile } from '../../types/transit';
import { User, Globe, Bell, History, Shield, Moon, Sun, X, Check, LogOut, LogIn } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenAuth: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onOpenAuth,
  isDarkMode,
  onToggleDarkMode,
}) => {
  if (!isOpen) return null;

  const [savedNotice, setSavedNotice] = useState(false);

  const handleLanguageChange = (lang: UserProfile['language']) => {
    onUpdateProfile({ language: lang });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleClearHistory = () => {
    onUpdateProfile({ searchHistory: [] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-sm">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {profile.name}
              </h3>
              <div className="text-[11px] text-slate-400">
                {profile.isGuest ? 'Guest Commuter Account' : profile.email}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {savedNotice && (
          <div className="rounded-xl bg-emerald-50 p-2.5 text-center text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            ✓ Preferences saved successfully!
          </div>
        )}

        {/* Guest conversion banner */}
        {profile.isGuest && (
          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3 dark:border-blue-900/50 dark:bg-blue-950/20 text-xs flex items-center justify-between">
            <span className="text-blue-900 dark:text-blue-200">
              Sign in to sync your bus bookmarks across devices.
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="rounded-lg bg-blue-600 px-3 py-1 text-white font-semibold hover:bg-blue-700 whitespace-nowrap text-xs"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Language Selection */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Globe className="h-3.5 w-3.5 text-blue-600" />
            <span>Regional Language</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['English', 'Telugu', 'Hindi'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-colors ${
                  profile.language === lang
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {lang === 'Telugu' ? 'తెలుగు (Telugu)' : lang === 'Hindi' ? 'हिन्दी (Hindi)' : 'English'}
              </button>
            ))}
          </div>
        </div>

        {/* Push Notification Preferences */}
        <div className="space-y-3">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Bell className="h-3.5 w-3.5 text-blue-600" />
            <span>Alert Preferences</span>
          </label>

          <div className="space-y-2 text-xs">
            <label className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-slate-700 dark:text-slate-300">Notify when bus is 5 min away</span>
              <input
                type="checkbox"
                checked={profile.notifyOnArrival}
                onChange={(e) => onUpdateProfile({ notifyOnArrival: e.target.checked })}
                className="h-4 w-4 rounded accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-slate-100 p-2.5 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-slate-700 dark:text-slate-300">Traffic delay alerts (&gt; 5 min)</span>
              <input
                type="checkbox"
                checked={profile.notifyOnDelay}
                onChange={(e) => onUpdateProfile({ notifyOnDelay: e.target.checked })}
                className="h-4 w-4 rounded accent-blue-600"
              />
            </label>
          </div>
        </div>

        {/* Search History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <History className="h-3.5 w-3.5 text-blue-600" />
              <span>Recent Search History</span>
            </label>
            {profile.searchHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {profile.searchHistory.length === 0 ? (
              <span className="text-xs text-slate-400">No search history</span>
            ) : (
              profile.searchHistory.map((h, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                >
                  {h}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
