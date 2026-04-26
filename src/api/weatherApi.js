import { getWeatherDescription, getWeatherType } from '../utils/weatherCodes.js';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchWeatherByCity(city) {
  const place = await findCity(city);
  return searchWeatherByPlace(place);
}

export async function searchWeatherByPlace(place) {
  const weather = await getCurrentWeather(place.latitude, place.longitude);
  return {
    city: formatCityName(place),
    favorite: {
      name: place.name,
      country: place.country,
      admin1: place.admin1,
      latitude: place.latitude,
      longitude: place.longitude,
    },
    date: weather.time,
    temperature: Math.round(weather.temperature_2m),
    humidity: weather.relative_humidity_2m,
    wind: Math.round(weather.wind_speed_10m),
    description: getWeatherDescription(weather.weather_code),
    type: getWeatherType(weather.weather_code),
  };
}

export async function searchCitySuggestions(query) {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set('name', query.trim());
  url.searchParams.set('count', '10');
  url.searchParams.set('language', 'es');
  url.searchParams.set('format', 'json');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('No se pudieron buscar sugerencias.');
  }

  const data = await response.json();

  return (data.results || []).map((place) => ({
    id: place.id,
    name: place.name,
    country: place.country,
    admin1: place.admin1,
    latitude: place.latitude,
    longitude: place.longitude,
  }));
}

async function findCity(city) {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set('name', city.trim());
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'es');
  url.searchParams.set('format', 'json');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('No se pudo buscar la ciudad.');
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error('No encontramos esa ciudad. Prueba con otro nombre.');
  }

  return data.results[0];
}

async function getCurrentWeather(latitude, longitude) {
  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m');
  url.searchParams.set('timezone', 'auto');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('No se pudo consultar el tiempo.');
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error('La respuesta del tiempo no contiene datos actuales.');
  }

  return data.current;
}

function formatCityName(place) {
  return [place.name, place.admin1, place.country].filter(Boolean).join(', ');
}
