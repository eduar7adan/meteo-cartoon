import { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import { MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getCurrentWeatherSummaries } from '../api/weatherApi.js';
import { MAP_FALLBACK_CENTER, MAP_LOCATIONS } from '../utils/mapLocations.js';
import WeatherMiniIcon from './WeatherMiniIcon.jsx';

export default function WeatherMap() {
  const [center, setCenter] = useState(MAP_FALLBACK_CENTER);
  const [places, setPlaces] = useState([]);
  const [status, setStatus] = useState('loading');
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => setCenter(MAP_FALLBACK_CENTER),
    );
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadMapWeather() {
      try {
        setStatus('loading');
        const summaries = await getCurrentWeatherSummaries(MAP_LOCATIONS);
        if (!ignore) {
          setPlaces(summaries);
          setStatus('ready');
        }
      } catch {
        if (!ignore) setStatus('error');
      }
    }

    loadMapWeather();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="map-panel">
      <header className="map-header">
        <h2>Mapa meteorologico</h2>
        <p>Panorama actual sobre una seleccion de ciudades.</p>
      </header>

      <div className="weather-map">
        <MapContainer
          center={[center.latitude, center.longitude]}
          zoom={5}
          minZoom={3}
          maxZoom={10}
          scrollWheelZoom
          attributionControl={false}
          className="leaflet-weather-map"
        >
          <MapCenter center={center} enabled={places.length === 0} />
          <MapBounds places={places} />
          <MapZoom onZoomChange={setZoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {places.map((place) => (
            <Marker
              key={place.name}
              position={[place.latitude, place.longitude]}
              icon={getWeatherMarkerIcon(place, zoom)}
            >
              <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                {place.name}: {place.weather.description}, {place.weather.temperature}&deg;C
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>

        {status === 'loading' && <div className="map-state">Dibujando el mapa del tiempo...</div>}
        {status === 'error' && (
          <div className="map-state">No se pudo cargar el mapa meteorologico.</div>
        )}
      </div>
    </section>
  );
}

function MapCenter({ center, enabled }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled) return;
    map.setView([center.latitude, center.longitude], map.getZoom(), { animate: true });
  }, [center, enabled, map]);

  return null;
}

function MapBounds({ places }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;

    const bounds = L.latLngBounds(places.map((place) => [place.latitude, place.longitude]));
    map.fitBounds(bounds, { animate: true, padding: [36, 36], maxZoom: 5 });
  }, [map, places]);

  return null;
}

function MapZoom({ onZoomChange }) {
  const map = useMapEvents({
    zoomend() {
      onZoomChange(map.getZoom());
    },
  });

  useEffect(() => {
    onZoomChange(map.getZoom());
  }, [map, onZoomChange]);

  return null;
}

function getWeatherMarkerIcon(place, zoom) {
  const size = getMarkerSize(zoom);
  const iconMarkup = renderToStaticMarkup(<WeatherMiniIcon type={place.weather.weatherType} />);
  const html = `
    <div class="map-weather-marker map-weather-marker--${size.name}">
      ${iconMarkup}
      <span class="map-weather-label">${place.name}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'map-weather-marker-shell',
    iconSize: [size.width, size.height],
    iconAnchor: [size.width / 2, size.height / 2],
  });
}

function getMarkerSize(zoom) {
  if (zoom <= 5) return { name: 'small', width: 54, height: 44 };
  if (zoom >= 7) return { name: 'large', width: 82, height: 66 };
  return { name: 'medium', width: 66, height: 54 };
}
