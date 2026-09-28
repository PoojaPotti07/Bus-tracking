import React from 'react';
import { Bus, Phone, ShieldAlert, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onTabChange: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onTabChange }) => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 dark:border-slate-800 dark:bg-slate-950 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Bus className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                RTC LiveTrack
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time public transit tracking network. Providing commuters with GPS telemetry, live ETAs, and stop arrival intelligence.
            </p>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              State Road Transport Corporation · Digital Transit Initiative
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onTabChange('track')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Track Live Bus
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('routes')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Corridor Routes & Timings
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('stops')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Bus Stop Arrivals Finder
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('favorites')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  My Saved Corridors
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('admin')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Fleet Operations Console
                </button>
              </li>
            </ul>
          </div>

          {/* Commuter Services */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              Commuter Support
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button onClick={() => onTabChange('help')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Lost & Found Registration
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('help')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Report Bus GPS Offset
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('help')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Student & Senior Pass Inquiries
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange('about')} className="hover:text-blue-600 dark:hover:text-blue-400">
                  GTFS Open Data Standards
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency & Helpline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white">
              24/7 Helpline & Safety
            </h4>
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 dark:text-blue-200">
                <Phone className="h-3.5 w-3.5 text-blue-600" />
                RTC Central Helpdesk: 0866-2570005
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
                Women Safety Emergency: 1091 / 112
              </div>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Fleet GPS tracking refreshed every 3.5 seconds.
            </p>
          </div>

        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          © {new Date().getFullYear()} RTC LiveTrack. Built for citizen mobility.
        </div>
      </div>
    </footer>
  );
};
