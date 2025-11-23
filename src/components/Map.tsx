import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { films, Film } from '@/data/films';

interface MapProps {
  onLocationClick: (film: Film) => void;
}

const Map = ({ onLocationClick }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize the map
    map.current = L.map(mapContainer.current, {
      center: [45, -100],
      zoom: 3,
      zoomControl: false,
    });

    // Add OpenStreetMap tiles (free, no token required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map.current);

    // Add zoom control to top-right (like Mapbox had it)
    L.control.zoom({
      position: 'topright'
    }).addTo(map.current);

    // Create custom icon for markers
    const createCustomIcon = () => {
      return L.divIcon({
        className: 'custom-marker',
        html: `<div class="film-marker-inner"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    };

    // Add markers for each film
    films.forEach((film) => {
      const marker = L.marker([film.location.lat, film.location.lng], {
        icon: createCustomIcon(),
      }).addTo(map.current!);

      // Add click event
      marker.on('click', () => {
        onLocationClick(film);
        map.current?.flyTo([film.location.lat, film.location.lng], 6, {
          duration: 1.5,
        });
      });

      markers.current.push(marker);
    });

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [onLocationClick]);

  return (
    <div className="relative w-full h-full z-0">
      <div ref={mapContainer} className="absolute inset-0 z-0" />
      <style>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .film-marker-inner {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, hsl(25 75% 47%), hsl(35 60% 60%));
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          transition: box-shadow 0.2s ease, filter 0.2s ease;
        }
        .film-marker-inner:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(211, 84, 0, 0.6);
          filter: brightness(1.2);
        }
        .leaflet-container {
          background: hsl(35 30% 90%);
          z-index: 1 !important;
        }
        .leaflet-pane,
        .leaflet-control-container {
          z-index: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default Map;
