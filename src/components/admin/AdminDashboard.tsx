import React, { useState } from 'react';
import { Bus, Route, BusStop, AdminStats, ServiceAlert } from '../../types/transit';
import {
  Shield,
  Activity,
  Plus,
  Trash2,
  Edit2,
  Radio,
  AlertTriangle,
  RefreshCw,
  Gauge,
  CheckCircle,
  Clock,
  X,
  Send,
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  buses: Bus[];
  routes: Route[];
  stops: BusStop[];
  alerts: ServiceAlert[];
  adminStats: AdminStats;
  onUpdateBus: (bus: Bus) => void;
  onAddBus: (bus: Bus) => void;
  onDeleteBus: (id: string) => void;
  onAddAlert: (alert: Omit<ServiceAlert, 'id' | 'timestamp'>) => void;
  onResetData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  buses,
  routes,
  stops,
  alerts,
  adminStats,
  onUpdateBus,
  onAddBus,
  onDeleteBus,
  onAddAlert,
  onResetData,
}) => {
  const [activeTab, setActiveTab] = useState<'fleet' | 'charts' | 'alerts'>('fleet');
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [showAddBusModal, setShowAddBusModal] = useState(false);

  // New Bus form state
  const [newBusNumber, setNewBusNumber] = useState('');
  const [newPlateNumber, setNewPlateNumber] = useState('AP 31 Z ');
  const [newRouteNumber, setNewRouteNumber] = useState('28');
  const [newBusType, setNewBusType] = useState<Bus['busType']>('Deluxe Express');
  const [newDestination, setNewDestination] = useState('Gajuwaka Central');
  const [newOrigin, setNewOrigin] = useState('RTC Complex Central');

  // Broadcast Alert form state
  const [alertTitle, setAlertTitle] = useState('');
  const [alertDesc, setAlertDesc] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'info' | 'warning' | 'alert'>('info');
  const [alertRoute, setAlertRoute] = useState('All Corridors');
  const [alertSentNotice, setAlertSentNotice] = useState(false);

  const handleCreateBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusNumber.trim()) return;

    const newBus: Bus = {
      id: `bus-custom-${Date.now()}`,
      busNumber: newBusNumber.trim().toUpperCase(),
      plateNumber: newPlateNumber.trim().toUpperCase(),
      routeId: `route-${newRouteNumber.toLowerCase()}`,
      routeNumber: newRouteNumber,
      routeName: `${newOrigin} ⇄ ${newDestination}`,
      busType: newBusType,
      currentLocationName: 'RTC Central Depot Bay 1',
      location: { lat: 17.7285, lng: 83.3038 },
      heading: 90,
      speedKmH: 28,
      origin: newOrigin,
      destination: newDestination,
      status: 'On Time',
      delayMinutes: 0,
      occupancy: 'Low',
      totalSeats: 48,
      availableSeats: 48,
      nextStopName: 'Gurudwara Junction',
      nextStopEtaMinutes: 4,
      finalEtaMinutes: 25,
      stopsRemaining: 8,
      lastUpdated: 'Just now',
      isAirConditioned: newBusType.includes('Electric') || newBusType.includes('Super'),
      isWheelchairAccessible: true,
      driverName: 'Fleet Pilot',
      driverPhone: '+91 98480 00000',
      todayTripsCompleted: 1,
    };

    onAddBus(newBus);
    setNewBusNumber('');
    setShowAddBusModal(false);
  };

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle.trim()) return;

    onAddAlert({
      title: alertTitle,
      description: alertDesc,
      severity: alertSeverity,
      affectedRoutes: [alertRoute],
      active: true,
    });

    setAlertTitle('');
    setAlertDesc('');
    setAlertSentNotice(true);
    setTimeout(() => setAlertSentNotice(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Shield className="h-4 w-4" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Fleet Operations & Monitoring Console
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Master control room: Live bus dispatch telemetry, schedule deviations, and service advisory broadcasts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddBusModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Vehicle</span>
          </button>

          <button
            onClick={onResetData}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 transition-colors"
            title="Reset to factory test data"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Fleet KPI Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500">Total Enrolled Fleet</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums mt-1">
            {adminStats.totalBuses.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Across 4 central depots</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500">Active On-Road Buses</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
            {adminStats.activeBuses.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">● AVL GPS tracking live</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500">Delayed / Deviated</div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums mt-1">
            {adminStats.delayedBuses}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">&gt; 5 min schedule variance</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-500">Punctuality Score</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums mt-1">
            {adminStats.onTimePercentage}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Target: 95.0%</div>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        {[
          { id: 'fleet', label: 'Live Vehicle Roster' },
          { id: 'charts', label: 'Fleet Analytics & Delays' },
          { id: 'alerts', label: 'Broadcast Passenger Advisory' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === t.id
                ? 'bg-slate-900 text-white dark:bg-blue-600'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Live Vehicle Roster Table */}
      {activeTab === 'fleet' && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Active Monitored Units ({buses.length})
            </span>
            <span className="text-xs text-slate-400">GPS Ping Rate: 3.5s</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="py-3 px-4">Bus #</th>
                  <th className="py-3 px-4">Corridor & Route</th>
                  <th className="py-3 px-4">Bus Type</th>
                  <th className="py-3 px-4">Current Zone</th>
                  <th className="py-3 px-4 text-center">Speed</th>
                  <th className="py-3 px-4 text-center">Occupancy</th>
                  <th className="py-3 px-4">Status & Delay</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {buses.map((bus) => (
                  <tr key={bus.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      Bus {bus.busNumber}
                      <div className="text-[10px] font-normal text-slate-400 font-mono">{bus.plateNumber}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">Route {bus.routeNumber}</div>
                      <div className="text-[11px] text-slate-400">{bus.origin} → {bus.destination}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {bus.busType}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {bus.currentLocationName}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {bus.speedKmH} km/h
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {bus.occupancy} ({bus.availableSeats} open)
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={bus.status}
                        onChange={(e) => {
                          onUpdateBus({
                            ...bus,
                            status: e.target.value as any,
                            delayMinutes: e.target.value === 'Delayed' ? 8 : 0,
                          });
                        }}
                        className={`rounded-lg py-1 px-2 text-xs font-semibold border ${
                          bus.status === 'On Time'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : bus.status === 'Delayed'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                        }`}
                      >
                        <option value="On Time">On Time</option>
                        <option value="Delayed">Delayed</option>
                        <option value="Stopped">Stopped</option>
                        <option value="Not Available">Not Available</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onDeleteBus(bus.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Decommission vehicle"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Fleet Analytics Charts */}
      {activeTab === 'charts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Corridor Delay Breakdown Chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Average Schedule Variance by Corridor (Minutes)
            </h4>
            <p className="text-xs text-slate-400 mb-6">Real-time delta versus published timetable</p>

            <div className="space-y-4 text-xs">
              {[
                { corridor: 'Corridor 28 (Gajuwaka Industrial)', delay: 2.1, color: 'bg-emerald-500' },
                { corridor: 'Corridor 500 (Anakapalli Express)', delay: 7.8, color: 'bg-amber-500' },
                { corridor: 'Corridor 10K (Kailasagiri Beach)', delay: 1.4, color: 'bg-emerald-500' },
                { corridor: 'Corridor 38A (Simhachalam)', delay: 3.2, color: 'bg-emerald-500' },
                { corridor: 'Corridor 222 (Pendurthi Belt)', delay: 2.8, color: 'bg-emerald-500' },
                { corridor: 'Corridor 999 (Steel Plant EV)', delay: 4.1, color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.corridor} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.corridor}</span>
                    <span className="font-mono text-slate-900 dark:text-white tabular-nums font-bold">
                      +{item.delay}m
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${Math.min(100, item.delay * 11)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Passenger Loading Capacity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Fleet Occupancy Distribution
            </h4>
            <p className="text-xs text-slate-400 mb-6">Passenger density load across active units</p>

            <div className="space-y-5 text-xs">
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400">Low Occupancy (&lt;40% seats full)</span>
                  <span className="font-mono font-bold">48% of Fleet</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '48%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-blue-600 dark:text-blue-400">Medium Occupancy (40%-80% full)</span>
                  <span className="font-mono font-bold">36% of Fleet</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: '36%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-rose-600 dark:text-rose-400">High / Peak Density (&gt;80% full)</span>
                  <span className="font-mono font-bold">16% of Fleet</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: '16%' }} />
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-xl bg-slate-50 p-3.5 dark:bg-slate-800/40 text-xs text-slate-500">
              ⚡ Automated Dispatch Recommendation: Additional 2 Electric AC shuttles recommended for Corridor 500 during 17:30 - 19:30 rush hour.
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Broadcast Passenger Advisory */}
      {activeTab === 'alerts' && (
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 space-y-5">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Broadcast Real-Time Advisory Alert
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Instantly pushes service banners and notification alerts to commuters on web & mobile.
            </p>
          </div>

          <form onSubmit={handleBroadcastAlert} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Advisory Title
              </label>
              <input
                type="text"
                required
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder="e.g. Traffic Diversion at Maddilapalem Circle"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Advisory Message
              </label>
              <textarea
                rows={3}
                required
                value={alertDesc}
                onChange={(e) => setAlertDesc(e.target.value)}
                placeholder="Detail route adjustments, anticipated delay, or special passenger guidelines..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Severity Level
                </label>
                <select
                  value={alertSeverity}
                  onChange={(e) => setAlertSeverity(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="info">Informational Note</option>
                  <option value="warning">Moderate Delay / Detour</option>
                  <option value="alert">Critical Service Disruption</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Corridor
                </label>
                <select
                  value={alertRoute}
                  onChange={(e) => setAlertRoute(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value="All Corridors">All Corridors</option>
                  {routes.map((r) => (
                    <option key={r.id} value={`Route ${r.routeNumber}`}>
                      Route {r.routeNumber} ({r.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {alertSentNotice && (
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700 font-semibold dark:bg-emerald-950/60 dark:text-emerald-300">
                ✓ Advisory broadcast published to all live commuter screens!
              </div>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Broadcast Notice</span>
            </button>
          </form>
        </div>
      )}

      {/* Modal: Add Vehicle */}
      {showAddBusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Commission New Transit Vehicle
              </h3>
              <button
                onClick={() => setShowAddBusModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBus} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Bus Number (e.g. 28B, 10K-X, 700)
                </label>
                <input
                  type="text"
                  required
                  value={newBusNumber}
                  onChange={(e) => setNewBusNumber(e.target.value)}
                  placeholder="e.g. 500E"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  License Plate Number
                </label>
                <input
                  type="text"
                  required
                  value={newPlateNumber}
                  onChange={(e) => setNewPlateNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Route #
                  </label>
                  <select
                    value={newRouteNumber}
                    onChange={(e) => setNewRouteNumber(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    {routes.map((r) => (
                      <option key={r.id} value={r.routeNumber}>
                        {r.routeNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bus Category
                  </label>
                  <select
                    value={newBusType}
                    onChange={(e) => setNewBusType(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  >
                    <option value="Electric AC Metro">Electric AC Metro</option>
                    <option value="Deluxe Express">Deluxe Express</option>
                    <option value="Super Luxury">Super Luxury</option>
                    <option value="Metro Express">Metro Express</option>
                    <option value="City Ordinary">City Ordinary</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Destination Terminal
                </label>
                <input
                  type="text"
                  required
                  value={newDestination}
                  onChange={(e) => setNewDestination(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBusModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                >
                  Deploy Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
