import React, { useState } from 'react';
import { Bus, Route, BusStop, ServiceAlert, AdminStats } from '../../types/transit';
import { LiveMap } from '../map/LiveMap';
import {
  Search,
  Navigation,
  Compass,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';

interface HomePageProps {
  buses: Bus[];
  routes: Route[];
  stops: BusStop[];
  alerts: ServiceAlert[];
  adminStats: AdminStats;
  onSelectBus: (bus: Bus) => void;
  onSelectRoute: (route: Route) => void;
  onNavigateToTab: (tab: string) => void;
  isDarkMode: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  buses,
  routes,
  stops,
  alerts,
  adminStats,
  onSelectBus,
  onSelectRoute,
  onNavigateToTab,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'bus' | 'route' | 'stop'>('all');

  // Filter items matching query
  const filteredBuses = buses.filter(
    (b) =>
      b.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRoutes = routes.filter(
    (r) =>
      r.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStops = stops.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 text-white dark:border-slate-800">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/rtc_hero_transit_1790616941416.jpg"
            alt="RTC City Express Bus"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
        </div>

        <div className="relative z-10 px-6 py-12 sm:px-12 lg:py-16">
          <div className="max-w-3xl space-y-6">
            
            {/* Header metadata */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <span>Public Transit Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>Live GPS Telemetry</span>
              <span aria-hidden="true">·</span>
              <span>Zero-Carbon EV Corridors</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white [text-wrap:balance]">
              Track Your RTC Bus in Real Time
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              Find buses, routes, and estimated arrival times instantly. Experience accurate live GPS locations, stop predictions, and crowd indicators across city corridors.
            </p>

            {/* Smart Search Box */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/95 p-2 shadow-2xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Bus # (e.g. 28, 10K, 500), Route, or Stop..."
                    className="w-full rounded-xl bg-transparent py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-white"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (filteredBuses.length > 0) {
                        onSelectBus(filteredBuses[0]);
                      } else {
                        onNavigateToTab('track');
                      }
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-semibold text-white shadow-md hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    <Compass className="h-4 w-4" />
                    <span>Track Bus</span>
                  </button>

                  <button
                    onClick={() => onNavigateToTab('stops')}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                  >
                    <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span>Nearby Stops</span>
                  </button>
                </div>
              </div>

              {/* Live Search Quick Results Dropdown */}
              {hasSearch && (
                <div className="mt-3 border-t border-slate-100 pt-3 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2 px-2 pb-2 text-[11px] font-semibold text-slate-400 uppercase">
                    Matching Transit Entities ({filteredBuses.length + filteredRoutes.length + filteredStops.length})
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1">
                    {/* Bus results */}
                    {filteredBuses.map((bus) => (
                      <button
                        key={bus.id}
                        onClick={() => onSelectBus(bus)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/60 dark:hover:bg-blue-900/30 text-left transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Bus {bus.busNumber}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{bus.destination}</div>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded dark:bg-emerald-950/60 dark:text-emerald-400">
                          {bus.finalEtaMinutes}m
                        </span>
                      </button>
                    ))}

                    {/* Route results */}
                    {filteredRoutes.map((route) => (
                      <button
                        key={route.id}
                        onClick={() => onSelectRoute(route)}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 dark:bg-slate-800/60 dark:hover:bg-blue-900/30 text-left transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">Route {route.routeNumber}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[140px]">{route.name}</div>
                        </div>
                        <span className="text-[10px] text-blue-600 font-semibold">View</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Recent Search Chips & Popular Shortcuts */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-300">
              <span className="text-slate-400">Popular Corridors:</span>
              {['Bus 28', 'Bus 10K', 'Bus 38A', 'Bus 500', 'Metro EV 999'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const busNum = tag.replace('Bus ', '').replace('Metro EV ', '');
                    const found = buses.find((b) => b.busNumber === busNum);
                    if (found) onSelectBus(found);
                    else onNavigateToTab('track');
                  }}
                  className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/20 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Live Service Alerts Ticker */}
      {alerts.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                <span>{alerts[0].title}</span>
                <span aria-hidden="true">·</span>
                <span className="font-normal font-mono">{alerts[0].timestamp}</span>
              </div>
              <p className="mt-1 text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                {alerts[0].description} Affected routes:{' '}
                <span className="font-bold">{alerts[0].affectedRoutes.join(', ')}</span>.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('routes')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 dark:text-amber-300 whitespace-nowrap"
            >
              Details →
            </button>
          </div>
        </section>
      )}

      {/* Quick Statistics Grid */}
      <section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs text-slate-500 dark:text-slate-400">Active Fleet Buses</div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {adminStats.activeBuses.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time GPS connected</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs text-slate-500 dark:text-slate-400">Monitored Routes</div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {adminStats.totalRoutes}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Urban, Coastal & Express
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs text-slate-500 dark:text-slate-400">Network Bus Stops</div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
              {adminStats.totalStops.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              With walking distance ETA
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs text-slate-500 dark:text-slate-400">On-Time Performance</div>
            <div className="mt-2 text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
              {adminStats.onTimePercentage}%
            </div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Average delay: 3.2 min
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Live Telemetry Preview */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Live Fleet Transit Radar
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Watch real-time bus positions, headings, and stop arrivals across the regional network.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('track')}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <span>Open Fullscreen Tracker</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="h-[420px] w-full">
          <LiveMap
            buses={buses}
            stops={stops}
            routes={routes}
            onSelectBus={onSelectBus}
            isDarkMode={isDarkMode}
            className="h-full w-full"
          />
        </div>
      </section>

      {/* Popular Corridors Spotlight */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              High-Frequency Corridors
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Most frequented routes with live bus count and departure frequency.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('routes')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            All {routes.length} Corridors →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {routes.slice(0, 4).map((route) => (
            <div
              key={route.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-extrabold text-blue-700 dark:bg-blue-950/70 dark:text-blue-300">
                    Route {route.routeNumber}
                  </span>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    Every {route.frequencyMinutes}m
                  </span>
                </div>

                <h3 className="mt-3 font-bold text-slate-900 dark:text-white line-clamp-1">
                  {route.name}
                </h3>

                <div className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Corridor:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{route.corridorType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Journey:</span>
                    <span className="font-mono">{route.averageDurationMinutes} mins ({route.distanceKm} km)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Buses:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {route.activeBusCount} buses
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  ₹{route.fareInr.min} - ₹{route.fareInr.max}
                </span>
                <button
                  onClick={() => onSelectRoute(route)}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  <span>Track Route</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Showcase: Transit Modernization & Commuter Tech */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Civic Mobility Infrastructure
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white [text-wrap:balance]">
            Intelligent Public Transit Built for Daily Commuters
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            RTC LiveTrack unifies multi-depot fleet management, automatic vehicle location (AVL), and on-bus passenger information displays (PIDS). Whether you are a student commuting to Andhra University or an employee heading to the Steel Plant, get exact countdown ETAs before stepping out.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="text-xs font-bold text-slate-900 dark:text-white">99.8% GPS Accuracy</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Sub-second telemetry updates</div>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="text-xs font-bold text-slate-900 dark:text-white">Smart Crowding Alert</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Real-time seat occupancy gauge</div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigateToTab('about')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
            >
              <span>Learn About Fleet Tech</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
          <img
            src="/src/assets/images/rtc_bus_terminal_1790616954676.jpg"
            alt="RTC Modern Bus Terminal"
            referrerPolicy="no-referrer"
            className="h-64 sm:h-72 w-full object-cover"
          />
        </div>
      </section>

    </div>
  );
};
