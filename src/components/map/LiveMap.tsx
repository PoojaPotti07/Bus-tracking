import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Bus, BusStop, Route } from '../../types/transit';
import { Locate, Layers, Navigation, Info, Users, Clock, Gauge } from 'lucide-react';

interface LiveMapProps {
  buses: Bus[];
  stops: BusStop[];
  routes?: Route[];
  selectedBusId?: string | null;
  selectedRouteId?: string | null;
  onSelectBus?: (bus: Bus) => void;
  onSelectStop?: (stop: BusStop) => void;
  isDarkMode?: boolean;
  className?: string;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  buses,
  stops,
  routes = [],
  selectedBusId,
  selectedRouteId,
  onSelectBus,
  onSelectStop,
  isDarkMode = false,
  className = 'h-[500px] w-full',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const busMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const stopMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [showStops, setShowStops] = useState(true);
  const [showBuses, setShowBuses] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>([17.7285, 83.3038]);
  const [locatingUser, setLocatingUser] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default center around Visakhapatnam RTC Hub
    const map = L.map(mapContainerRef.current, {
      center: [17.7285, 83.2800],
      zoom: 12,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer based on Dark Mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    const tiles = L.tileLayer(tileUrl, {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    tileLayerRef.current = tiles;
  }, [isDarkMode]);

  // Update Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    let activeRoute: Route | undefined;
    if (selectedRouteId) {
      activeRoute = routes.find((r) => r.id === selectedRouteId || r.routeNumber === selectedRouteId);
    } else if (selectedBusId) {
      const bus = buses.find((b) => b.id === selectedBusId);
      if (bus) {
        activeRoute = routes.find((r) => r.id === bus.routeId || r.routeNumber === bus.routeNumber);
      }
    }

    if (activeRoute && activeRoute.waypoints.length > 0) {
      const latlngs: [number, number][] = activeRoute.waypoints.map((w) => [w.lat, w.lng]);
      const polyline = L.polyline(latlngs, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
        smoothFactor: 1,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      routePolylineRef.current = polyline;
    }
  }, [selectedRouteId, selectedBusId, routes, buses]);

  // Update Bus Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!showBuses) {
      busMarkersRef.current.forEach((marker) => map.removeLayer(marker));
      busMarkersRef.current.clear();
      return;
    }

    const currentBusIds = new Set(buses.map((b) => b.id));

    // Remove obsolete markers
    busMarkersRef.current.forEach((marker, id) => {
      if (!currentBusIds.has(id)) {
        map.removeLayer(marker);
        busMarkersRef.current.delete(id);
      }
    });

    // Update or add bus markers
    buses.forEach((bus) => {
      const isSelected = bus.id === selectedBusId;
      const statusColor =
        bus.status === 'On Time'
          ? '#16a34a'
          : bus.status === 'Delayed'
          ? '#d97706'
          : bus.status === 'Stopped'
          ? '#dc2626'
          : '#64748b';

      const customHtml = `
        <div class="relative flex items-center justify-center cursor-pointer transition-transform ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110'
        }" style="width: 44px; height: 44px;">
          <div class="absolute inset-0 rounded-full ${
            isSelected ? 'bus-pulsing-ring' : ''
          }" style="color: ${statusColor};"></div>
          <div class="relative flex items-center gap-1 px-2 py-1 rounded-full shadow-md font-bold text-xs text-white" style="background-color: ${
            isSelected ? '#1d4ed8' : statusColor
          };">
            <svg style="transform: rotate(${bus.heading}deg);" class="w-3 h-3 text-white transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
            <span>${bus.busNumber}</span>
          </div>
        </div>
      `;

      const busIcon = L.divIcon({
        html: customHtml,
        className: 'custom-bus-icon',
        iconSize: [44, 44],
        iconAnchor: [22, 22],
        popupAnchor: [0, -20],
      });

      let marker = busMarkersRef.current.get(bus.id);

      if (marker) {
        marker.setLatLng([bus.location.lat, bus.location.lng]);
        marker.setIcon(busIcon);
      } else {
        marker = L.marker([bus.location.lat, bus.location.lng], { icon: busIcon }).addTo(map);
        marker.on('click', () => {
          if (onSelectBus) onSelectBus(bus);
        });
        busMarkersRef.current.set(bus.id, marker);
      }

      // Popup Content
      const popupHtml = `
        <div class="p-3 text-slate-800 bg-white font-sans text-xs min-w-[220px]">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <span class="font-bold text-sm text-blue-600">Bus ${bus.busNumber}</span>
            <span class="font-semibold px-2 py-0.5 rounded text-[10px] ${
              bus.status === 'On Time'
                ? 'bg-emerald-50 text-emerald-700'
                : bus.status === 'Delayed'
                ? 'bg-amber-50 text-amber-700'
                : 'bg-rose-50 text-rose-700'
            }">${bus.status}</span>
          </div>
          <div class="mt-2 space-y-1 text-slate-600">
            <div><strong class="text-slate-900">Destination:</strong> ${bus.destination}</div>
            <div><strong class="text-slate-900">Near:</strong> ${bus.currentLocationName}</div>
            <div class="flex items-center justify-between pt-1 text-slate-500 font-mono">
              <span>ETA: ${bus.finalEtaMinutes} min</span>
              <span>${bus.speedKmH} km/h</span>
            </div>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);
    });

    // If selected bus changed, pan to it smoothly
    if (selectedBusId) {
      const selectedBus = buses.find((b) => b.id === selectedBusId);
      if (selectedBus) {
        map.panTo([selectedBus.location.lat, selectedBus.location.lng], {
          animate: true,
          duration: 0.8,
        });
      }
    }
  }, [buses, selectedBusId, showBuses, onSelectBus]);

  // Update Stop Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!showStops) {
      stopMarkersRef.current.forEach((marker) => map.removeLayer(marker));
      stopMarkersRef.current.clear();
      return;
    }

    stops.forEach((stop) => {
      if (stopMarkersRef.current.has(stop.id)) return;

      const stopHtml = `
        <div class="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-white border-2 border-white shadow-md hover:scale-125 transition-transform cursor-pointer" title="${stop.name}">
          <span class="text-[9px] font-bold">🚏</span>
        </div>
      `;

      const stopIcon = L.divIcon({
        html: stopHtml,
        className: 'custom-stop-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });

      const marker = L.marker([stop.location.lat, stop.location.lng], { icon: stopIcon }).addTo(map);

      marker.on('click', () => {
        if (onSelectStop) onSelectStop(stop);
      });

      const popupHtml = `
        <div class="p-3 text-slate-800 bg-white font-sans text-xs min-w-[200px]">
          <div class="font-bold text-slate-900 text-sm">${stop.name}</div>
          <div class="text-slate-500 text-[11px] mt-0.5">${stop.area} · ${stop.code}</div>
          <div class="mt-2 text-slate-600">
            <span class="font-semibold text-slate-800">Passing Routes:</span> ${stop.passingRoutes.join(', ')}
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);
      stopMarkersRef.current.set(stop.id, marker);
    });
  }, [stops, showStops, onSelectStop]);

  // Locate User / Reset Center
  const handleLocateMe = () => {
    setLocatingUser(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserLocation([lat, lng]);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([lat, lng], 14, { animate: true });
          }
          setLocatingUser(false);
        },
        () => {
          // Fallback to RTC Complex Central Hub
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([17.7285, 83.3038], 13, { animate: true });
          }
          setLocatingUser(false);
        },
        { timeout: 5000 }
      );
    } else {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([17.7285, 83.3038], 13, { animate: true });
      }
      setLocatingUser(false);
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 ${className}`}>
      {/* Map Container */}
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Floating Map Controls & Overlays */}
      <div className="absolute top-3 left-3 z-[400] flex flex-col gap-2">
        {/* Toggle Layers */}
        <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <button
            onClick={() => setShowBuses(!showBuses)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              showBuses
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Buses ({buses.length})
          </button>
          <button
            onClick={() => setShowStops(!showStops)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              showStops
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
            }`}
          >
            <span>🚏 Stops</span>
          </button>
        </div>
      </div>

      {/* Center / Locate Me Button */}
      <div className="absolute bottom-4 right-4 z-[400] flex flex-col gap-2">
        <button
          onClick={handleLocateMe}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-md hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          title="Center on RTC Complex / My Location"
          aria-label="My Location"
        >
          <Locate className={`h-5 w-5 text-blue-600 ${locatingUser ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] hidden sm:flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/95 px-3 py-1.5 text-[11px] text-slate-600 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>On Time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Delayed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          <span>Stopped</span>
        </div>
      </div>
    </div>
  );
};
