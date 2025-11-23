import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { films, Film } from '@/data/films';

interface MapProps {
  onLocationClick: (film: Film) => void;
}

const Map = ({ onLocationClick }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenError, setTokenError] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('token') as string;
    
    if (token) {
      localStorage.setItem('mapbox_token', token);
      setMapboxToken(token);
      setTokenError(false);
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        zoom: 2.5,
        center: [-100, 45],
        projection: 'globe' as any,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(245, 237, 230)',
          'high-color': 'rgb(220, 200, 180)',
          'horizon-blend': 0.05,
        });
      });

      // Add markers for each film
      films.forEach((film) => {
        const el = document.createElement('div');
        el.className = 'film-marker';
        el.style.width = '32px';
        el.style.height = '32px';
        el.style.borderRadius = '50%';
        el.style.background = 'linear-gradient(135deg, hsl(25 75% 47%), hsl(35 60% 60%))';
        el.style.border = '3px solid white';
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        el.style.cursor = 'pointer';
        el.style.transition = 'box-shadow 0.2s ease, filter 0.2s ease';
        
        el.addEventListener('mouseenter', () => {
          el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(211, 84, 0, 0.6)';
          el.style.filter = 'brightness(1.2)';
        });
        
        el.addEventListener('mouseleave', () => {
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          el.style.filter = 'brightness(1)';
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([film.location.lng, film.location.lat])
          .addTo(map.current!);

        el.addEventListener('click', () => {
          onLocationClick(film);
          map.current?.flyTo({
            center: [film.location.lng, film.location.lat],
            zoom: 6,
            duration: 1500
          });
        });

        markers.current.push(marker);
      });

      return () => {
        markers.current.forEach(marker => marker.remove());
        markers.current = [];
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setTokenError(true);
    }
  }, [mapboxToken, onLocationClick]);

  if (!mapboxToken) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-earth-sand">
        <div className="max-w-md mx-auto p-8 bg-card rounded-xl shadow-elevated">
          <h2 className="text-2xl font-serif font-bold mb-4 text-foreground">Mapbox Token Required</h2>
          <p className="text-muted-foreground mb-6">
            To display the interactive map, please enter your Mapbox public token. 
            Get one free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>.
          </p>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <input
              type="text"
              name="token"
              placeholder="pk.ey..."
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
              required
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              Save Token
            </button>
          </form>
          {tokenError && (
            <p className="mt-4 text-destructive text-sm">
              Invalid token. Please check your token and try again.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
