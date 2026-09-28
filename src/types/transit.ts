export type BusType = 'Electric AC Metro' | 'Super Luxury' | 'Deluxe Express' | 'City Ordinary' | 'Metro Express';

export type BusStatus = 'On Time' | 'Delayed' | 'Stopped' | 'Not Available';

export type OccupancyLevel = 'Low' | 'Medium' | 'High';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface BusStop {
  id: string;
  name: string;
  code: string;
  area: string;
  location: LatLng;
  platform?: string;
  amenities: string[]; // e.g. "Shelter", "Digital Display", "Seating", "Wheelchair Ramp"
  passingRoutes: string[]; // route IDs or numbers
}

export interface StopWithArrival {
  stop: BusStop;
  scheduledTime: string;
  estimatedTime: string;
  status: 'passed' | 'current' | 'upcoming';
  distanceFromPrevKm: number;
}

export interface Bus {
  id: string;
  busNumber: string; // e.g. "28", "10K", "38A", "500", "222"
  plateNumber: string;
  routeId: string;
  routeNumber: string;
  routeName: string;
  busType: BusType;
  currentLocationName: string;
  location: LatLng;
  heading: number; // 0-360 degrees
  speedKmH: number;
  origin: string;
  destination: string;
  status: BusStatus;
  delayMinutes: number;
  occupancy: OccupancyLevel;
  totalSeats: number;
  availableSeats: number;
  nextStopName: string;
  nextStopEtaMinutes: number;
  finalEtaMinutes: number;
  stopsRemaining: number;
  lastUpdated: string; // ISO string or relative time
  isAirConditioned: boolean;
  isWheelchairAccessible: boolean;
  driverName: string;
  driverPhone: string;
  todayTripsCompleted: number;
}

export interface Route {
  id: string;
  routeNumber: string;
  name: string;
  origin: string;
  destination: string;
  distanceKm: number;
  averageDurationMinutes: number;
  frequencyMinutes: number;
  firstBusTime: string;
  lastBusTime: string;
  stopsCount: number;
  stopIds: string[];
  waypoints: LatLng[];
  activeBusCount: number;
  corridorType: 'Coastal Express' | 'Industrial Metro' | 'Urban Commuter' | 'University Link';
  fareInr: {
    min: number;
    max: number;
  };
}

export interface StopArrivalInfo {
  busId: string;
  busNumber: string;
  routeNumber: string;
  destination: string;
  busType: BusType;
  etaMinutes: number;
  status: BusStatus;
  occupancy: OccupancyLevel;
}

export interface ServiceAlert {
  id: string;
  severity: 'info' | 'warning' | 'alert';
  title: string;
  description: string;
  affectedRoutes: string[];
  timestamp: string;
  active: boolean;
}

export interface NotificationMessage {
  id: string;
  title: string;
  body: string;
  time: string;
  busNumber?: string;
  routeNumber?: string;
  type: 'arrival' | 'delay' | 'favorite' | 'alert';
  read: boolean;
}

export interface UserFavorite {
  busNumbers: string[];
  routeIds: string[];
  stopIds: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  isGuest: boolean;
  language: 'English' | 'Telugu' | 'Hindi';
  darkMode: boolean;
  notifyOnArrival: boolean;
  notifyOnDelay: boolean;
  notifyProximityMinutes: number;
  searchHistory: string[];
}

export interface AdminStats {
  totalBuses: number;
  activeBuses: number;
  delayedBuses: number;
  maintenanceBuses: number;
  totalRoutes: number;
  totalStops: number;
  onTimePercentage: number;
  dailyPassengersEstimated: number;
}
