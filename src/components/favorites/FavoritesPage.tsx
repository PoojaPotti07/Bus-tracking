import React from 'react';
import { Bus, Route, BusStop } from '../../types/transit';
import { Bookmark, Compass, MapPin, ArrowRight, Trash2, Clock, Bell } from 'lucide-react';

interface FavoritesPageProps {
  buses: Bus[];
  routes: Route[];
  stops: BusStop[];
  favorites: {
    busNumbers: string[];
    routeIds: string[];
    stopIds: string[];
  };
  onSelectBus: (bus: Bus) => void;
  onSelectRoute: (route: Route) => void;
  onToggleFavorite: (type: 'bus' | 'route' | 'stop', idOrNumber: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  buses,
  routes,
  stops,
  favorites,
  onSelectBus,
  onSelectRoute,
  onToggleFavorite,
  onNavigateToTab,
}) => {
  const favoriteBuses = buses.filter((b) => favorites.busNumbers.includes(b.busNumber));
  const favoriteRoutes = routes.filter((r) => favorites.routeIds.includes(r.id));
  const favoriteStops = stops.filter((s) => favorites.stopIds.includes(s.id));

  const hasAnyFavorites =
    favoriteBuses.length > 0 || favoriteRoutes.length > 0 || favoriteStops.length > 0;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          My Saved Commuter Corridors
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Instant access to your frequent buses, daily transit routes, and local bus stops.
        </p>
      </div>

      {!hasAnyFavorites ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Bookmark className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600" />
          <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
            No saved favorites yet
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Bookmark your daily commute buses, routes, or boarding stops by clicking the bookmark icon on any bus card.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={() => onNavigateToTab('track')}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Explore Live Buses
            </button>
            <button
              onClick={() => onNavigateToTab('routes')}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Browse Routes
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Favorite Buses */}
          {favoriteBuses.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Favorite Buses ({favoriteBuses.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteBuses.map((bus) => (
                  <div
                    key={bus.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                            Bus {bus.busNumber}
                          </span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                            {bus.busType}
                          </span>
                        </div>
                        <button
                          onClick={() => onToggleFavorite('bus', bus.busNumber)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                          title="Remove bookmark"
                        >
                          <Bookmark className="h-4 w-4 fill-rose-500 text-rose-500" />
                        </button>
                      </div>

                      <div className="mt-3 space-y-1.5 text-xs">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">
                          {bus.origin} → {bus.destination}
                        </div>
                        <div className="text-slate-500">
                          Near: <span className="font-medium text-slate-700 dark:text-slate-300">{bus.currentLocationName}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            ETA: {bus.finalEtaMinutes} min
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            {bus.speedKmH} km/h · {bus.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => onSelectBus(bus)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        <Compass className="h-3.5 w-3.5" />
                        <span>Live Track Bus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Routes */}
          {favoriteRoutes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Favorite Corridors ({favoriteRoutes.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">
                          Route {route.routeNumber}
                        </span>
                        <button
                          onClick={() => onToggleFavorite('route', route.id)}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          <Bookmark className="h-4 w-4 fill-current" />
                        </button>
                      </div>

                      <div className="mt-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {route.name}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500 font-mono">
                        Frequency: Every {route.frequencyMinutes}m · {route.distanceKm} km
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => onSelectRoute(route)}
                        className="w-full rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                      >
                        View Corridor Schedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Stops */}
          {favoriteStops.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Favorite Bus Stops ({favoriteStops.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteStops.map((stop) => (
                  <div
                    key={stop.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {stop.name}
                      </span>
                      <button
                        onClick={() => onToggleFavorite('stop', stop.id)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Bookmark className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {stop.area} · Code: {stop.code}
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      {stop.passingRoutes.map((rt) => (
                        <span key={rt} className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                          {rt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
