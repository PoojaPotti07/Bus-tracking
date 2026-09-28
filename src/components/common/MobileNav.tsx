import React from 'react';
import { Home, Compass, MapPin, Bookmark, Settings } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'track', label: 'Live Track', icon: Compass },
    { id: 'routes', label: 'Routes', icon: MapPin },
    { id: 'favorites', label: 'Saved', icon: Bookmark },
    { id: 'admin', label: 'Admin', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] tracking-tight mt-1 whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
