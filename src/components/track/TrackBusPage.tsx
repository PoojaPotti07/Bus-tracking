import React, { useState } from 'react';
import { Bus, Route, BusStop } from '../../types/transit';
import { LiveMap } from '../map/LiveMap';
import {
  Search,
  Gauge,
  Clock,
  Compass,
  MapPin,
  Share2,
  Bookmark,
  Users,
  AlertCircle,
  Phone,
  CheckCircle2,
  Circle,
  QrCode,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface TrackBusPageProps {
  buses: Bus[];
  routes: Route[];
  stops: BusStop[];
  selectedBus: Bus | null;
  onSelectBus: (bus: Bus) => void;
  isFavorited: boolean;
  onToggleFavorite: (busNumber: string) => void;
  isDarkMode: boolean;
}

export const TrackBusPage: React.FC<TrackBusPageProps> = ({
  buses,
  routes,
  stops,
  selectedBus,
  onSelectBus,
  isFavorited,
  onToggleFavorite,
  isDarkMode,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const activeBus = selectedBus || buses[0];

  const matchingBuses = buses.filter(
    (b) =>
      b.busNumber.toLowerCase().includes(searchInput.toLowerCase()) ||
      b.destination.toLowerCase().includes(searchInput.toLowerCase()) ||
      b.origin.toLowerCase().includes(searchInput.toLowerCase())
  );

  const activeRoute = routes.find(
    (r) => r.id === activeBus.routeId || r.routeNumber === activeBus.routeNumber
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `https://rtclivetrack.transport.gov/track?bus=${activeBus.busNumber}`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Mock stops progress for this bus route
  const routeStops = activeRoute
    ? activeRoute.stopIds
        .map((id) => stops.find((s) => s.id === id))
        .filter((s): s is BusStop => !!s)
    : stops.slice(0, 5);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Top Search & Bus Selector Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search Bus Number (e.g. 28, 10K, 38A, 500, 222)..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Quick bus selection pill bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 whitespace-nowrap mr-1">Quick Select:</span>
          {buses.map((bus) => {
            const isSelected = activeBus.id === bus.id;
            return (
              <button
                key={bus.id}
                onClick={() => onSelectBus(bus)}
                className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                Bus {bus.busNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tracking Grid: Map on left, Telemetry card on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Map (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Live Radar: Bus {activeBus.busNumber} in Motion
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Updated: {activeBus.lastUpdated}
            </span>
          </div>

          <div className="h-[460px] lg:h-[580px] w-full">
            <LiveMap
              buses={buses}
              stops={stops}
              routes={routes}
              selectedBusId={activeBus.id}
              selectedRouteId={activeRoute?.id}
              onSelectBus={onSelectBus}
              isDarkMode={isDarkMode}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* Telemetry & Route Timeline Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Bus Status Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs">
            
            {/* Header: Bus Number & Actions */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Bus {activeBus.busNumber}
                  </span>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">
                    {activeBus.busType}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                  {activeBus.plateNumber} · Route {activeBus.routeNumber}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFavorite(activeBus.busNumber)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                    isFavorited
                      ? 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                  title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
                  aria-label="Toggle Favorite"
                >
                  <Bookmark className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                  title="Share live location"
                  aria-label="Share Location"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => setShowQRModal(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
                  title="View Bus QR Transit Pass"
                  aria-label="Bus QR"
                >
                  <QrCode className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Status & ETA Headline */}
            <div className="py-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-slate-400">Estimated Arrival (Destination)</div>
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    {activeBus.finalEtaMinutes} <span className="text-base font-medium">mins</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Current Status</div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${
                      activeBus.status === 'On Time'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : activeBus.status === 'Delayed'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {activeBus.status}
                    {activeBus.delayMinutes > 0 && ` (+${activeBus.delayMinutes}m)`}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {activeBus.origin} → {activeBus.destination}
                </span>
                <span className="font-mono text-slate-400">
                  {activeBus.stopsRemaining} stops remaining
                </span>
              </div>
            </div>

            {/* Real-time Telemetry Indicators */}
            <div className="grid grid-cols-3 gap-3 py-4 border-b border-slate-100 dark:border-slate-800 text-center">
              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                  <Gauge className="h-3 w-3" />
                  <span>Speed</span>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                  {activeBus.speedKmH} <span className="text-[10px] font-normal">km/h</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                  <Users className="h-3 w-3" />
                  <span>Occupancy</span>
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeBus.occupancy}
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800/50">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>Next Stop</span>
                </div>
                <div className="text-base font-bold text-blue-600 dark:text-blue-400 tabular-nums mt-0.5">
                  {activeBus.nextStopEtaMinutes} <span className="text-[10px] font-normal">min</span>
                </div>
              </div>
            </div>

            {/* Current Geo Location & Next Stop */}
            <div className="pt-4 space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Current Position:</span>{' '}
                  <span className="text-slate-900 dark:text-white font-medium">{activeBus.currentLocationName}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Compass className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Next Approaching Stop:</span>{' '}
                  <span className="text-slate-900 dark:text-white font-medium">{activeBus.nextStopName}</span>
                </div>
              </div>
            </div>

            {/* Driver & Bus Specs */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/40 text-xs flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-[11px]">Pilot In-Charge</div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">{activeBus.driverName}</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-[11px]">Available Seats</div>
                <div className="font-mono font-bold text-slate-900 dark:text-white">
                  {activeBus.availableSeats} / {activeBus.totalSeats}
                </div>
              </div>
            </div>

          </div>

          {/* Route Progression Timeline */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Stop Sequence Progression
            </h4>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {routeStops.map((stop, idx) => {
                const isFirst = idx === 0;
                const isCurrent = idx === 1;
                const isUpcoming = idx > 1;

                return (
                  <div key={stop.id} className="relative flex items-start justify-between text-xs">
                    {/* Circle Dot indicator */}
                    <div
                      className={`absolute -left-6 top-0.5 flex h-4 w-4 items-center justify-center rounded-full ${
                        isFirst
                          ? 'bg-emerald-500 text-white'
                          : isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40'
                          : 'bg-white border-2 border-slate-300 dark:border-slate-600 dark:bg-slate-900'
                      }`}
                    >
                      {isFirst ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Circle className="h-2 w-2" />
                      )}
                    </div>

                    <div>
                      <div
                        className={`font-semibold ${
                          isCurrent
                            ? 'text-blue-600 dark:text-blue-400 font-bold'
                            : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {stop.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {stop.area} {stop.platform ? `· ${stop.platform}` : ''}
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      {isFirst && <span className="text-emerald-600 text-[11px]">Departed</span>}
                      {isCurrent && (
                        <span className="text-blue-600 font-bold text-xs">
                          {activeBus.nextStopEtaMinutes} min
                        </span>
                      )}
                      {isUpcoming && (
                        <span className="text-slate-400 text-[11px]">
                          ~{activeBus.nextStopEtaMinutes + (idx - 1) * 4} min
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* QR Transit Pass Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 text-center space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Bus {activeBus.busNumber} Digital Boarding Pass
              </span>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="space-y-2">
                <QrCode className="h-28 w-28 mx-auto text-slate-800 dark:text-white" />
                <div className="text-[10px] font-mono text-slate-500">
                  REF: RTC-LIVE-{activeBus.busNumber}-{Date.now().toString().slice(-6)}
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400">
              Show this QR code at the ticket validation terminal or to the on-board conductor for instant route clearance.
            </div>

            <button
              onClick={() => setShowQRModal(false)}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
