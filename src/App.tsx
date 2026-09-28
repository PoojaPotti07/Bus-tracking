/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { transitService } from './services/transitService';
import { Bus, Route, BusStop, UserProfile, ServiceAlert } from './types/transit';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/home/HomePage';
import { TrackBusPage } from './components/track/TrackBusPage';
import { RoutesPage } from './components/routes/RoutesPage';
import { BusStopsPage } from './components/stops/BusStopsPage';
import { FavoritesPage } from './components/favorites/FavoritesPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { HelpCenterPage } from './components/help/HelpCenterPage';
import { AboutPage } from './components/about/AboutPage';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { ProfileModal } from './components/profile/ProfileModal';
import { AuthModal } from './components/auth/AuthModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [buses, setBuses] = useState<Bus[]>(transitService.getBuses());
  const [routes, setRoutes] = useState<Route[]>(transitService.getRoutes());
  const [stops, setStops] = useState<BusStop[]>(transitService.getStops());
  const [alerts, setAlerts] = useState<ServiceAlert[]>(transitService.getAlerts());
  const [notifications, setNotifications] = useState(transitService.getNotifications());
  const [adminStats, setAdminStats] = useState(transitService.getAdminStats());
  const [favorites, setFavorites] = useState(transitService.getFavorites());
  const [userProfile, setUserProfile] = useState<UserProfile>(transitService.getUserProfile());

  const [selectedBus, setSelectedBus] = useState<Bus | null>(buses[0] || null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem('rtc_dark_mode') === 'true' ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return false;
  });

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Subscribe to real-time simulation updates
  useEffect(() => {
    const unsubscribe = transitService.subscribe(() => {
      setBuses(transitService.getBuses());
      setRoutes(transitService.getRoutes());
      setStops(transitService.getStops());
      setAlerts(transitService.getAlerts());
      setNotifications(transitService.getNotifications());
      setAdminStats(transitService.getAdminStats());
      setFavorites(transitService.getFavorites());
      setUserProfile(transitService.getUserProfile());
    });
    return () => unsubscribe();
  }, []);

  // Sync dark mode class on <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rtc_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rtc_dark_mode', 'false');
    }
  }, [isDarkMode]);

  // Handle bus selection
  const handleSelectBus = (bus: Bus) => {
    setSelectedBus(bus);
    setCurrentTab('track');
    transitService.addSearchHistory(`Bus ${bus.busNumber}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle route selection
  const handleSelectRoute = (route: Route) => {
    setCurrentTab('routes');
    transitService.addSearchHistory(`Route ${route.routeNumber}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle favorite
  const handleToggleFavorite = (type: 'bus' | 'route' | 'stop', idOrNumber: string) => {
    transitService.toggleFavorite(type, idOrNumber);
    setFavorites(transitService.getFavorites());
  };

  // Quick navigation to stop on map
  const handleFocusOnMap = (stop: BusStop) => {
    setCurrentTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col transition-colors selection:bg-blue-600 selection:text-white">
      {/* Top Bar Contract compliant Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadCount={notifications.filter((n) => !n.read).length}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-20 lg:pb-8">
        {currentTab === 'home' && (
          <HomePage
            buses={buses}
            routes={routes}
            stops={stops}
            alerts={alerts}
            adminStats={adminStats}
            onSelectBus={handleSelectBus}
            onSelectRoute={handleSelectRoute}
            onNavigateToTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'track' && (
          <TrackBusPage
            buses={buses}
            routes={routes}
            stops={stops}
            selectedBus={selectedBus}
            onSelectBus={(bus) => setSelectedBus(bus)}
            isFavorited={selectedBus ? favorites.busNumbers.includes(selectedBus.busNumber) : false}
            onToggleFavorite={(num) => handleToggleFavorite('bus', num)}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'routes' && (
          <RoutesPage
            routes={routes}
            buses={buses}
            stops={stops}
            onSelectBus={handleSelectBus}
            isDarkMode={isDarkMode}
          />
        )}

        {currentTab === 'stops' && (
          <BusStopsPage
            stops={stops}
            buses={buses}
            onSelectBus={handleSelectBus}
            onFocusOnMap={handleFocusOnMap}
          />
        )}

        {currentTab === 'favorites' && (
          <FavoritesPage
            buses={buses}
            routes={routes}
            stops={stops}
            favorites={favorites}
            onSelectBus={handleSelectBus}
            onSelectRoute={handleSelectRoute}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToTab={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            buses={buses}
            routes={routes}
            stops={stops}
            alerts={alerts}
            adminStats={adminStats}
            onUpdateBus={(bus) => transitService.adminUpdateBus(bus)}
            onAddBus={(bus) => transitService.adminAddBus(bus)}
            onDeleteBus={(id) => transitService.adminDeleteBus(id)}
            onAddAlert={(alert) => transitService.adminAddAlert(alert)}
            onResetData={() => transitService.resetToDefault()}
          />
        )}

        {currentTab === 'help' && <HelpCenterPage />}

        {currentTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile Ergonomic Thumb Bottom Bar */}
      <MobileNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Slide-out Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => transitService.markNotificationAsRead(id)}
        onClearAll={() => transitService.clearAllNotifications()}
        onSelectBusNumber={(busNum) => {
          const found = buses.find((b) => b.busNumber === busNum);
          if (found) handleSelectBus(found);
          else setCurrentTab('track');
        }}
      />

      {/* Profile & Settings Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={userProfile}
        onUpdateProfile={(updated) => transitService.updateUserProfile(updated)}
        onOpenAuth={() => setIsAuthOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(updatedUser) => {
          transitService.updateUserProfile(updatedUser);
        }}
      />
    </div>
  );
}
