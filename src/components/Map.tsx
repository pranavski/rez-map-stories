import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { films, Film } from '@/data/films';

interface MapProps {
  onLocationClick: (film: Film) => void;
}

const Map = ({ onLocationClick }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markers = useRef<maplibregl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize the map with globe projection
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        name: 'Green Globe',
        sources: {
          'land': {
            type: 'vector',
            url: 'https://demotiles.maplibre.org/tiles/tiles.json'
          }
        },
        layers: [
          {
            id: 'ocean',
            type: 'background',
            paint: {
              'background-color': '#6B9BD1' // Ocean blue
            }
          },
          {
            id: 'land',
            type: 'fill',
            source: 'land',
            'source-layer': 'countries',
            paint: {
              'fill-color': '#4A7C4E' // Forest green for land
            }
          },
          {
            id: 'land-outline',
            type: 'line',
            source: 'land',
            'source-layer': 'countries',
            paint: {
              'line-color': '#3D6B40',
              'line-width': 1
            }
          }
        ],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf'
      },
      center: [-100, 45],
      zoom: 2.5,
      projection: 'globe'
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Set atmosphere/fog effect for globe
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(186, 210, 235)', // Light blue atmosphere
        'high-color': 'rgb(36, 92, 223)', // Upper atmosphere
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)', // Dark space
        'star-intensity': 0.6
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

      const marker = new maplibregl.Marker({ element: el })
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
      map.current = null;
    };
  }, [onLocationClick]);

  return (
    <div className="relative w-full h-full z-0">
      <div ref={mapContainer} className="absolute inset-0 z-0" />
      <style>{`
        .maplibregl-map {
          z-index: 1 !important;
        }
        .maplibregl-canvas-container,
        .maplibregl-control-container {
          z-index: 1 !important;
        }
      `}</style>
    </div>
  );
};

export default Map;
