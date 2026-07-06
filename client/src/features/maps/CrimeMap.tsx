import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import type { GeoPoint } from '@aegis/shared';

const center: [number, number] = [14.65, 76.5];

const colorFor = (weight: number) => {
  if (weight > 0.9) return '#a13d2d';
  if (weight > 0.7) return '#b7791f';
  if (weight > 0.5) return '#176b58';
  return '#5c6875';
};

export const CrimeMap = ({ points }: { points: GeoPoint[] }) => (
  <MapContainer center={center} zoom={7} scrollWheelZoom className="min-h-[390px]">
    <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    {points.map((point) => (
      <CircleMarker
        key={point.id}
        center={[point.latitude, point.longitude]}
        radius={6 + point.weight * 8}
        pathOptions={{ color: colorFor(point.weight), fillColor: colorFor(point.weight), fillOpacity: 0.38, weight: 1 }}
      >
        <Popup>
          <strong>{point.category}</strong>
          <br />
          {point.district}
          <br />
          {new Date(point.occurredAt).toLocaleDateString()}
        </Popup>
      </CircleMarker>
    ))}
  </MapContainer>
);
