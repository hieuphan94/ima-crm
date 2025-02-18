import { VIETNAM_LOCATIONS } from '@/constants/vietnam-locations';
import 'maplibre-gl/dist/maplibre-gl.css';
import Map, { Layer, Marker, Source } from 'react-map-gl/maplibre';
const vietnamGeoJson = await import('./vietnam-geo.json').then((m) => m.default); // Import file GeoJSON

export default function MapLibre({
  position = { lng: 105.8542, lat: 14.4974 },
  zoom = 5,
  locations = [],
}) {
  // Debug log để kiểm tra input locations
  console.log('Input locations:', locations);

  const getMatchedLocations = () => {
    const matched = locations
      .map((locationName) => {
        // Chuẩn hóa tên địa điểm bằng cách loại bỏ khoảng trắng và chuyển thành chữ thường
        const normalizedInput = locationName.toLowerCase().replace(/\s+/g, '');

        const matchedLocation = VIETNAM_LOCATIONS.find((vLoc) => {
          const normalizedName = vLoc.name.toLowerCase().replace(/\s+/g, '');
          const normalizedId = vLoc.id.toLowerCase().replace(/\s+/g, '');
          return normalizedName === normalizedInput || normalizedId === normalizedInput;
        });

        if (matchedLocation) {
          console.log('Matched location:', matchedLocation);
          return {
            name: matchedLocation.name,
            ...matchedLocation.coordinates,
          };
        }
        console.log('No match found for:', locationName);
        return null;
      })
      .filter(Boolean);

    console.log('Final matched locations:', matched);
    return matched;
  };

  const matchedLocations = getMatchedLocations();

  // Calculate bounds if there are locations
  const getBounds = () => {
    if (matchedLocations.length === 0) {
      return [
        [102.14486, 8.38135], // Default Southwest coordinates
        [109.46407, 23.39291], // Default Northeast coordinates
      ];
    }

    const lngs = matchedLocations.map((loc) => loc.lng);
    const lats = matchedLocations.map((loc) => loc.lat);

    return [
      [Math.min(...lngs) - 0.5, Math.min(...lats) - 0.5], // Southwest
      [Math.max(...lngs) + 0.5, Math.max(...lats) + 0.5], // Northeast
    ];
  };

  return (
    <Map
      initialViewState={{
        longitude: position.lng,
        latitude: position.lat,
        zoom: zoom,
        bounds: getBounds(),
      }}
      style={{ width: 400, height: 400, borderRadius: '0.5rem' }}
      mapStyle={{
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap Contributors',
          },
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      }}
    >
      {/* Add Vietnam provinces overlay */}
      <Source id="vietnam-provinces" type="geojson" data={vietnamGeoJson}>
        <Layer
          id="province-fills"
          type="fill"
          paint={{
            'fill-color': '#166534',
            'fill-opacity': 0.9,
          }}
        />
        <Layer
          id="province-borders"
          type="line"
          paint={{
            'line-color': '#14532d',
            'line-width': 1,
            'line-opacity': 0.9,
          }}
        />
        <Layer
          id="province-labels"
          type="symbol"
          layout={{
            'text-field': ['get', 'name'],
            'text-size': 12,
            'text-allow-overlap': false,
            'text-ignore-placement': false,
            'text-anchor': 'center',
          }}
          paint={{
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1,
          }}
        />
      </Source>

      {matchedLocations.map((location, index) => (
        <Marker key={index} longitude={location.lng} latitude={location.lat} anchor="bottom">
          <div className="relative group cursor-pointer">
            {/* Marker với style mới */}
            <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2">
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full">
                <div className="w-2 h-2 bg-red-500 rotate-45"></div>
              </div>
            </div>

            {/* Tooltip khi hover (có thể giữ lại hoặc bỏ đi) */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block">
              <div className="bg-white px-3 py-1 rounded-lg shadow-lg text-sm font-medium text-gray-900 whitespace-nowrap">
                {location.name}
              </div>
            </div>
          </div>
        </Marker>
      ))}
    </Map>
  );
}
