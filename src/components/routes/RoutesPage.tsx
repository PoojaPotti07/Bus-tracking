import React, { useState } from 'react';
import { Route, Bus, BusStop } from '../../types/transit';
import { LiveMap } from '../map/LiveMap';
import {
  Search,
  MapPin,
  Clock,
  Compass,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Calendar,
  X,
  CheckCircle,
} from 'lucide-react';

interface RoutesPageProps {
  routes: Route[];
  buses: Bus[];
  stops: BusStop[];
  onSelectBus: (bus: Bus) => void;
  isDarkMode: boolean;
}

export const RoutesPage: React.FC<RoutesPageProps> = ({
  routes,
  buses,
  stops,
  onSelectBus,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('all');
  const [activeModalRoute, setActiveModalRoute] = useState<Route | null>(null);

  const corridorOptions = [
    { id: 'all', label: 'All Corridors' },
    { id: 'Industrial Metro', label: 'Industrial Metro' },
    { id: 'Coastal Express', label: 'Coastal Express' },
    { id: 'Urban Commuter', label: 'Urban Commuter' },
    { id: 'University Link', label: 'University Link' },
  ];

  const filteredRoutes = routes.filter((r) => {
    const matchesSearch =
      r.routeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.destination.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCorridor =
      selectedCorridor === 'all' || r.corridorType === selectedCorridor;

    return matchesSearch && matchesCorridor;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            RTC Corridor & Route Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Explore scheduled frequencies, first/last departure timings, and live active fleets on each corridor.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search route # or destination..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Corridor Filter Tabs (Interactive Segmented Control) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {corridorOptions.map((opt) => {
          const isSelected = selectedCorridor === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSelectedCorridor(opt.id)}
              className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRoutes.map((route) => {
          const activeBusesOnRoute = buses.filter(
            (b) => b.routeNumber === route.routeNumber
          );

          return (
            <div
              key={route.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-600 transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-extrabold text-white">
                      Route {route.routeNumber}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {route.corridorType}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    Every {route.frequencyMinutes}m
                  </span>
                </div>

                {/* Name */}
                <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                  {route.name}
                </h3>

                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {route.origin} → {route.destination}
                </div>

                {/* Route Specs Grid */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/50">
                    <div className="text-[11px] text-slate-400">Approx Time</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                      {route.averageDurationMinutes} mins
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/50">
                    <div className="text-[11px] text-slate-400">Distance & Stops</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
                      {route.distanceKm} km · {route.stopsCount} stops
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/50">
                    <div className="text-[11px] text-slate-400">First / Last Bus</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-[11px] mt-0.5">
                      {route.firstBusTime} - {route.lastBusTime}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/50">
                    <div className="text-[11px] text-slate-400">Active Live Buses</div>
                    <div className="font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                      {activeBusesOnRoute.length} on track
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Fare: ₹{route.fareInr.min} - ₹{route.fareInr.max}
                </span>
                <button
                  onClick={() => setActiveModalRoute(route)}
                  className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  <span>View Route Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Route Details Modal */}
      {activeModalRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-extrabold text-white">
                    Route {activeModalRoute.routeNumber}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {activeModalRoute.name}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 font-mono">
                  {activeModalRoute.corridorType} · {activeModalRoute.distanceKm} km · {activeModalRoute.stopsCount} Total Bus Stops
                </div>
              </div>

              <button
                onClick={() => setActiveModalRoute(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Route Map Preview */}
            <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <LiveMap
                buses={buses.filter((b) => b.routeNumber === activeModalRoute.routeNumber)}
                stops={stops}
                routes={[activeModalRoute]}
                selectedRouteId={activeModalRoute.id}
                onSelectBus={(b) => {
                  setActiveModalRoute(null);
                  onSelectBus(b);
                }}
                isDarkMode={isDarkMode}
                className="h-full w-full"
              />
            </div>

            {/* Timings & Service Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="text-slate-400">First Bus</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  {activeModalRoute.firstBusTime}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="text-slate-400">Last Bus</div>
                <div className="font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  {activeModalRoute.lastBusTime}
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="text-slate-400">Departure Frequency</div>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                  Every {activeModalRoute.frequencyMinutes} mins
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="text-slate-400">Corridor Fare</div>
                <div className="font-bold text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                  ₹{activeModalRoute.fareInr.min} - ₹{activeModalRoute.fareInr.max}
                </div>
              </div>
            </div>

            {/* List of Route Stops */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
                Complete Corridors Stops ({activeModalRoute.stopIds.length} Key Hubs)
              </h4>
              <div className="space-y-2">
                {activeModalRoute.stopIds.map((stopId, idx) => {
                  const stop = stops.find((s) => s.id === stopId);
                  return (
                    <div
                      key={stopId}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/30 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-bold text-[11px] font-mono">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-200">
                            {stop ? stop.name : `Hub ${idx + 1}`}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {stop?.area} · Code: {stop?.code}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {idx === 0 ? 'Start Terminal' : idx === activeModalRoute.stopIds.length - 1 ? 'End Terminal' : `~${idx * 12} mins`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer action */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setActiveModalRoute(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
