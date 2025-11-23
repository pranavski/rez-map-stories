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
        name: 'Indigenous Lands Globe',
        sources: {
          'land': {
            type: 'vector',
            url: 'https://demotiles.maplibre.org/tiles/tiles.json'
          },
          'osm-details': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          },
          'native-land-territories': {
            type: 'raster',
            tiles: [
              'https://tiles.native-land.ca/tiles/territories/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://native-land.ca">Native Land Digital</a>'
          }
        },
        layers: [
          {
            id: 'ocean',
            type: 'background',
            paint: {
              'background-color': '#87CEEB' // Light sky blue ocean
            }
          },
          {
            id: 'land',
            type: 'fill',
            source: 'land',
            'source-layer': 'countries',
            paint: {
              'fill-color': '#C8E6C9' // Very light green base
            }
          },
          {
            id: 'osm-details-layer',
            type: 'raster',
            source: 'osm-details',
            paint: {
              'raster-opacity': 0.6 // Blend with green base
            }
          },
          {
            id: 'land-outline',
            type: 'line',
            source: 'land',
            'source-layer': 'countries',
            paint: {
              'line-color': '#66BB6A',
              'line-width': 1.5
            }
          },
          {
            id: 'native-land-layer',
            type: 'raster',
            source: 'native-land-territories',
            paint: {
              'raster-opacity': 0.5
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

    // Add click handler for native land territories
    map.current.on('click', async (e) => {
      const { lng, lat } = e.lngLat;

      try {
        const response = await fetch(
          `https://native-land.ca/api/index.php?maps=territories&position=${lat},${lng}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          const territories = data.map((t: any) => t.properties.Name).join(', ');

          new maplibregl.Popup()
            .setLngLat([lng, lat])
            .setHTML(`
              <div style="padding: 8px; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #2d5a27;">Indigenous Territories</h3>
                <p style="margin: 0; color: #333;">${territories}</p>
                <p style="margin: 8px 0 0 0; font-size: 11px; color: #666;">
                  Data from <a href="https://native-land.ca" target="_blank" style="color: #2d5a27;">Native Land Digital</a>
                </p>
              </div>
            `)
            .addTo(map.current!);
        }
      } catch (error) {
        console.log('Could not fetch territory data');
      }
    });

    // Add markers for each film
    films.forEach((film) => {
      const el = document.createElement('div');
      el.className = 'film-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.borderRadius = '50%';
      el.style.background = 'linear-gradient(135deg, #FDFD96, #FFFACD)'; // Baby yellow gradient
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.transition = 'box-shadow 0.2s ease, filter 0.2s ease';

      el.addEventListener('mouseenter', () => {
        el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.4), 0 0 20px rgba(253, 253, 150, 0.8)';
        el.style.filter = 'brightness(1.1)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        el.style.filter = 'brightness(1)';
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([film.location.lng, film.location.lat])
        .addTo(map.current!);

      el.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent territory popup from showing
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
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs max-w-xs shadow-lg">
        <p className="font-semibold text-gray-800 mb-1">Indigenous Territories Map</p>
        <p className="text-gray-600">Click anywhere on the map to see which Indigenous nations' traditional territories you're viewing.</p>
        <p className="text-gray-500 mt-1">Data: <a href="https://native-land.ca" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">Native Land Digital</a></p>
      </div>
      <style>{`
        .maplibregl-map {
          z-index: 1 !important;
        }
        .maplibregl-canvas-container,
        .maplibregl-control-container {
          z-index: 1 !important;
        }
        .maplibregl-popup-content {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default Map;
