import React, { useState } from 'react';
import { BusStop, Bus, StopArrivalInfo } from '../../types/transit';
import { transitService } from '../../services/transitService';
import {
  Search,
  MapPin,
  Clock,
  Compass,
  Navigation,
  ExternalLink,
  CheckCircle,
  Accessibility,
  Wifi,
  Sparkles,
  ArrowRight,
  X,
  Bookmark,
} from 'lucide-react';

interface BusStopsPageProps {
  stops: BusStop[];
  buses: Bus[];
  onSelectBus: (bus: Bus) => void;
  onFocusOnMap: (stop: BusStop) => void;
}

export const BusStopsPage: React.FC<BusStopsPageProps> = ({
  stops,
  buses,
  onSelectBus,
  onFocusOnMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStopModal, setSelectedStopModal] = useState<BusStop | null>(null);
  const [navigatingStopId, setNavigatingStopId] = useState<string | null>(null);

  // User simulated position (near Dwaraka Nagar RTC Hub: 17.7285, 83.3038)
  const userLat = 17.7285;
  const userLng = 83.3038;

  const nearbyStops = transitService.getNearbyStops(userLat, userLng, 25);

  const filteredStops = nearbyStops.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.passingRoutes.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleNavigate = (stop: BusStop) => {
    setNavigatingStopId(stop.id);
    onFocusOnMap(stop);
    setTimeout(() => setNavigatingStopId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Bus Stops & Live Departure Boards
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Find nearby bus stations, walking distance estimates, and upcoming bus arrivals.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stop name, code or route (e.g. RTC Complex)..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Stops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStops.map((stop) => {
          const arrivals = transitService.getArrivalsForStop(stop.id);

          return (
            <div
              key={stop.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-600 transition-all"
            >
              <div>
                {/* Header: Name, Distance & Code */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {stop.name}
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {stop.area} {stop.platform ? `· ${stop.platform}` : ''}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {stop.code}
                    </span>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 font-semibold">
                      {stop.distanceKm} km ({stop.walkingMinutes} min walk)
                    </div>
                  </div>
                </div>

                {/* Passing Corridors */}
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 font-medium">Routes:</span>
                  {stop.passingRoutes.map((rt) => (
                    <span
                      key={rt}
                      className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-bold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300"
                    >
                      {rt}
                    </span>
                  ))}
                </div>

                {/* Live Approaching Buses Widget */}
                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between pb-2 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Next Incoming Buses</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-normal">Live ETA</span>
                  </div>

                  {arrivals.length === 0 ? (
                    <div className="py-2 text-center text-xs text-slate-400">
                      No buses within 30 min window
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {arrivals.slice(0, 3).map((arr) => (
                        <div
                          key={arr.busId}
                          onClick={() => {
                            const found = buses.find((b) => b.id === arr.busId);
                            if (found) onSelectBus(found);
                          }}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-white hover:bg-blue-50/60 dark:bg-slate-900 dark:hover:bg-blue-900/20 cursor-pointer transition-colors text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-blue-600 dark:text-blue-400">
                              Bus {arr.busNumber}
                            </span>
                            <span className="text-[11px] text-slate-500 truncate max-w-[130px]">
                              → {arr.destination}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 tabular-nums">
                            {arr.etaMinutes} min
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stop Amenities */}
                <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  {stop.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-md border border-slate-200 bg-white px-2 py-0.5 dark:border-slate-800 dark:bg-slate-900"
                    >
                      ✓ {amenity}
                    </span>
                  ))}
                  {stop.amenities.length > 3 && (
                    <span className="text-slate-400">+{stop.amenities.length - 3} more</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedStopModal(stop)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Full Timetable →
                </button>

                <button
                  onClick={() => handleNavigate(stop)}
                  className="flex items-center gap-1 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>{navigatingStopId === stop.id ? 'Located!' : 'Navigate'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stop Full Timetable Modal */}
      {selectedStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 max-h-[85vh] overflow-y-auto space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedStopModal.name}
                </h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Code: {selectedStopModal.code} · {selectedStopModal.area}
                </div>
              </div>
              <button
                onClick={() => setSelectedStopModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Amenities list */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Available Amenities
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {selectedStopModal.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    ✓ {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Complete incoming arrivals */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Live Next Bus Arrivals
              </div>
              <div className="space-y-2">
                {transitService.getArrivalsForStop(selectedStopModal.id).map((arr) => (
                  <div
                    key={arr.busId}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-blue-600 dark:text-blue-400">
                          Bus {arr.busNumber}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ({arr.busType})
                        </span>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 mt-0.5">
                        Towards: <span className="font-semibold">{arr.destination}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                        {arr.etaMinutes} min
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Occupancy: {arr.occupancy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedStopModal(null)}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Close Timetable
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
