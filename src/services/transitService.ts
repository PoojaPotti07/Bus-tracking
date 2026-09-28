import {
  Bus,
  BusStop,
  Route,
  ServiceAlert,
  NotificationMessage,
  AdminStats,
  StopArrivalInfo,
  UserProfile,
} from '../types/transit';
import {
  INITIAL_BUSES,
  INITIAL_BUS_STOPS,
  INITIAL_ROUTES,
  INITIAL_ALERTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ADMIN_STATS,
} from '../data/mockTransitData';

const STORAGE_KEYS = {
  BUSES: 'rtc_livetrack_buses_v1',
  ROUTES: 'rtc_livetrack_routes_v1',
  STOPS: 'rtc_livetrack_stops_v1',
  ALERTS: 'rtc_livetrack_alerts_v1',
  NOTIFICATIONS: 'rtc_livetrack_notifs_v1',
  FAVORITES: 'rtc_livetrack_favorites_v1',
  USER_PROFILE: 'rtc_livetrack_user_v1',
  SEARCH_HISTORY: 'rtc_livetrack_history_v1',
};

// Safe storage access
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota
  }
}

class TransitService {
  private buses: Bus[];
  private routes: Route[];
  private stops: BusStop[];
  private alerts: ServiceAlert[];
  private notifications: NotificationMessage[];
  private listeners: Set<() => void> = new Set();
  private simulationInterval: number | null = null;

  constructor() {
    this.buses = getStored<Bus[]>(STORAGE_KEYS.BUSES, INITIAL_BUSES);
    this.routes = getStored<Route[]>(STORAGE_KEYS.ROUTES, INITIAL_ROUTES);
    this.stops = getStored<BusStop[]>(STORAGE_KEYS.STOPS, INITIAL_BUS_STOPS);
    this.alerts = getStored<ServiceAlert[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
    this.notifications = getStored<NotificationMessage[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      INITIAL_NOTIFICATIONS
    );

    this.startSimulation();
  }

  // Subscribe to live updates
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // Live simulation: slowly moves buses along slight deviations, updates speed, decrements ETA
  private startSimulation(): void {
    if (typeof window === 'undefined') return;

    this.simulationInterval = window.setInterval(() => {
      this.buses = this.buses.map((bus) => {
        if (bus.status === 'Stopped') {
          // 20% chance to start moving
          if (Math.random() < 0.25) {
            return {
              ...bus,
              status: 'On Time',
              speedKmH: 26 + Math.floor(Math.random() * 12),
              lastUpdated: 'Just now',
            };
          }
          return bus;
        }

        // Small drift along heading
        const rad = (bus.heading * Math.PI) / 180;
        const driftKm = (bus.speedKmH / 3600) * 3; // 3 seconds travel
        const degLat = driftKm / 111;
        const degLng = driftKm / (111 * Math.cos((bus.location.lat * Math.PI) / 180));

        let newLat = bus.location.lat + Math.cos(rad) * degLat * 0.35;
        let newLng = bus.location.lng + Math.sin(rad) * degLng * 0.35;

        // Keep within Visakhapatnam corridor bounding box:
        // Lat: 17.62 to 17.85, Lng: 83.15 to 83.42
        let heading = bus.heading;
        if (newLat < 17.65 || newLat > 17.83 || newLng < 83.16 || newLng > 83.40) {
          heading = (heading + 180) % 360;
          newLat = Math.max(17.66, Math.min(17.82, newLat));
          newLng = Math.max(83.17, Math.min(83.39, newLng));
        }

        // Slight speed oscillation
        const speedDelta = (Math.random() - 0.48) * 3;
        const newSpeed = Math.max(15, Math.min(55, Math.round(bus.speedKmH + speedDelta)));

        // ETA jitter/decrement
        const nextEta = Math.max(1, bus.nextStopEtaMinutes);
        const finalEta = Math.max(3, bus.finalEtaMinutes);

        return {
          ...bus,
          location: { lat: newLat, lng: newLng },
          heading,
          speedKmH: newSpeed,
          nextStopEtaMinutes: nextEta,
          finalEtaMinutes: finalEta,
          lastUpdated: 'Just now',
        };
      });

      this.notify();
    }, 3500);
  }

  // Bus Queries
  public getBuses(): Bus[] {
    return [...this.buses];
  }

  public getBusById(id: string): Bus | undefined {
    return this.buses.find((b) => b.id === id);
  }

  public getBusByNumber(busNumber: string): Bus | undefined {
    const clean = busNumber.trim().toUpperCase();
    return this.buses.find(
      (b) => b.busNumber.toUpperCase() === clean || b.routeNumber.toUpperCase() === clean
    );
  }

  public getRoutes(): Route[] {
    return [...this.routes];
  }

  public getRouteById(id: string): Route | undefined {
    return this.routes.find((r) => r.id === id || r.routeNumber.toUpperCase() === id.toUpperCase());
  }

  public getStops(): BusStop[] {
    return [...this.stops];
  }

  public getStopById(id: string): BusStop | undefined {
    return this.stops.find((s) => s.id === id);
  }

  // Get buses passing or approaching a specific stop
  public getArrivalsForStop(stopId: string): StopArrivalInfo[] {
    const stop = this.getStopById(stopId);
    if (!stop) return [];

    const arrivals: StopArrivalInfo[] = [];

    // Filter buses whose route passes this stop
    this.buses.forEach((bus) => {
      if (stop.passingRoutes.includes(bus.routeNumber)) {
        // Compute realistic distance to stop
        const distKm = this.calculateDistanceKm(bus.location, stop.location);
        const etaMin = Math.max(2, Math.round((distKm / Math.max(15, bus.speedKmH)) * 60));

        arrivals.push({
          busId: bus.id,
          busNumber: bus.busNumber,
          routeNumber: bus.routeNumber,
          destination: bus.destination,
          busType: bus.busType,
          etaMinutes: etaMin,
          status: bus.status,
          occupancy: bus.occupancy,
        });
      }
    });

    return arrivals.sort((a, b) => a.etaMinutes - b.etaMinutes);
  }

  // Smart Search across buses, routes, origins, destinations, and stops
  public searchTransit(query: string): {
    buses: Bus[];
    routes: Route[];
    stops: BusStop[];
  } {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { buses: this.buses.slice(0, 4), routes: this.routes.slice(0, 4), stops: this.stops.slice(0, 4) };
    }

    const matchedBuses = this.buses.filter(
      (b) =>
        b.busNumber.toLowerCase().includes(q) ||
        b.routeNumber.toLowerCase().includes(q) ||
        b.routeName.toLowerCase().includes(q) ||
        b.origin.toLowerCase().includes(q) ||
        b.destination.toLowerCase().includes(q) ||
        b.currentLocationName.toLowerCase().includes(q)
    );

    const matchedRoutes = this.routes.filter(
      (r) =>
        r.routeNumber.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.origin.toLowerCase().includes(q) ||
        r.destination.toLowerCase().includes(q) ||
        r.corridorType.toLowerCase().includes(q)
    );

    const matchedStops = this.stops.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q) ||
        s.passingRoutes.some((rt) => rt.toLowerCase().includes(q))
    );

    return {
      buses: matchedBuses,
      routes: matchedRoutes,
      stops: matchedStops,
    };
  }

  // Distance helper (Haversine Formula)
  public calculateDistanceKm(pos1: { lat: number; lng: number }, pos2: { lat: number; lng: number }): number {
    const R = 6371; // km
    const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180;
    const dLng = ((pos2.lng - pos1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1.lat * Math.PI) / 180) *
        Math.cos((pos2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(1));
  }

  // Get nearby stops based on coordinates
  public getNearbyStops(userLat: number, userLng: number, maxRadiusKm = 10): (BusStop & { distanceKm: number; walkingMinutes: number })[] {
    return this.stops
      .map((stop) => {
        const distanceKm = this.calculateDistanceKm({ lat: userLat, lng: userLng }, stop.location);
        const walkingMinutes = Math.round(distanceKm * 12); // ~5 km/h walking pace
        return {
          ...stop,
          distanceKm,
          walkingMinutes,
        };
      })
      .filter((s) => s.distanceKm <= maxRadiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }

  // Favorites
  public getFavorites(): { busNumbers: string[]; routeIds: string[]; stopIds: string[] } {
    return getStored(STORAGE_KEYS.FAVORITES, {
      busNumbers: ['28', '10K'],
      routeIds: ['route-28', 'route-10k'],
      stopIds: ['stop-1', 'stop-4'],
    });
  }

  public toggleFavorite(type: 'bus' | 'route' | 'stop', idOrNumber: string): boolean {
    const current = this.getFavorites();
    let isNowFavorited = false;

    if (type === 'bus') {
      const idx = current.busNumbers.indexOf(idOrNumber);
      if (idx >= 0) {
        current.busNumbers.splice(idx, 1);
      } else {
        current.busNumbers.push(idOrNumber);
        isNowFavorited = true;
      }
    } else if (type === 'route') {
      const idx = current.routeIds.indexOf(idOrNumber);
      if (idx >= 0) {
        current.routeIds.splice(idx, 1);
      } else {
        current.routeIds.push(idOrNumber);
        isNowFavorited = true;
      }
    } else if (type === 'stop') {
      const idx = current.stopIds.indexOf(idOrNumber);
      if (idx >= 0) {
        current.stopIds.splice(idx, 1);
      } else {
        current.stopIds.push(idOrNumber);
        isNowFavorited = true;
      }
    }

    setStored(STORAGE_KEYS.FAVORITES, current);
    this.notify();
    return isNowFavorited;
  }

  // Alerts
  public getAlerts(): ServiceAlert[] {
    return [...this.alerts];
  }

  // Notifications
  public getNotifications(): NotificationMessage[] {
    return [...this.notifications];
  }

  public markNotificationAsRead(id: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setStored(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public clearAllNotifications(): void {
    this.notifications = [];
    setStored(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  public addNotification(notification: Omit<NotificationMessage, 'id' | 'read'>): void {
    const newItem: NotificationMessage = {
      ...notification,
      id: `notif-${Date.now()}`,
      read: false,
    };
    this.notifications.unshift(newItem);
    setStored(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }

  // User Profile
  public getUserProfile(): UserProfile {
    return getStored<UserProfile>(STORAGE_KEYS.USER_PROFILE, {
      id: 'guest-user-1',
      name: 'Commuter Guest',
      email: 'commuter@aprtc.gov.in',
      phone: '+91 98480 12345',
      isGuest: true,
      language: 'English',
      darkMode: false,
      notifyOnArrival: true,
      notifyOnDelay: true,
      notifyProximityMinutes: 5,
      searchHistory: ['Bus 28', 'RTC Complex to Gajuwaka', 'Bus 10K', 'MVP Colony'],
    });
  }

  public updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    setStored(STORAGE_KEYS.USER_PROFILE, updated);
    this.notify();
    return updated;
  }

  public addSearchHistory(item: string): void {
    const clean = item.trim();
    if (!clean) return;
    const profile = this.getUserProfile();
    const updatedHistory = [clean, ...profile.searchHistory.filter((h) => h !== clean)].slice(0, 8);
    this.updateUserProfile({ searchHistory: updatedHistory });
  }

  // Admin Fleet Operations
  public getAdminStats(): AdminStats {
    const totalBuses = this.buses.length + 1312;
    const activeBuses = this.buses.filter((b) => b.status !== 'Not Available').length + 1240;
    const delayedBuses = this.buses.filter((b) => b.status === 'Delayed').length + 62;
    const onTimePercentage = Number(
      (((activeBuses - delayedBuses) / activeBuses) * 100).toFixed(1)
    );

    return {
      totalBuses,
      activeBuses,
      delayedBuses,
      maintenanceBuses: 8,
      totalRoutes: this.routes.length + 178,
      totalStops: this.stops.length + 3405,
      onTimePercentage,
      dailyPassengersEstimated: 485000,
    };
  }

  public adminUpdateBus(updatedBus: Bus): void {
    this.buses = this.buses.map((b) => (b.id === updatedBus.id ? updatedBus : b));
    setStored(STORAGE_KEYS.BUSES, this.buses);
    this.notify();
  }

  public adminAddBus(newBus: Bus): void {
    this.buses.unshift(newBus);
    setStored(STORAGE_KEYS.BUSES, this.buses);
    this.notify();
  }

  public adminDeleteBus(id: string): void {
    this.buses = this.buses.filter((b) => b.id !== id);
    setStored(STORAGE_KEYS.BUSES, this.buses);
    this.notify();
  }

  public adminAddRoute(newRoute: Route): void {
    this.routes.unshift(newRoute);
    setStored(STORAGE_KEYS.ROUTES, this.routes);
    this.notify();
  }

  public adminDeleteRoute(id: string): void {
    this.routes = this.routes.filter((r) => r.id !== id);
    setStored(STORAGE_KEYS.ROUTES, this.routes);
    this.notify();
  }

  public adminAddStop(newStop: BusStop): void {
    this.stops.unshift(newStop);
    setStored(STORAGE_KEYS.STOPS, this.stops);
    this.notify();
  }

  public adminDeleteStop(id: string): void {
    this.stops = this.stops.filter((s) => s.id !== id);
    setStored(STORAGE_KEYS.STOPS, this.stops);
    this.notify();
  }

  public adminAddAlert(alert: Omit<ServiceAlert, 'id' | 'timestamp'>): void {
    const newAlert: ServiceAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: 'Just now',
    };
    this.alerts.unshift(newAlert);
    setStored(STORAGE_KEYS.ALERTS, this.alerts);
    this.notify();
  }

  public resetToDefault(): void {
    this.buses = [...INITIAL_BUSES];
    this.routes = [...INITIAL_ROUTES];
    this.stops = [...INITIAL_BUS_STOPS];
    this.alerts = [...INITIAL_ALERTS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    setStored(STORAGE_KEYS.BUSES, this.buses);
    setStored(STORAGE_KEYS.ROUTES, this.routes);
    setStored(STORAGE_KEYS.STOPS, this.stops);
    setStored(STORAGE_KEYS.ALERTS, this.alerts);
    setStored(STORAGE_KEYS.NOTIFICATIONS, this.notifications);
    this.notify();
  }
}

export const transitService = new TransitService();
