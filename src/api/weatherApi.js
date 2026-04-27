import { getWeatherDescriptionFromCode, getWeatherTypeFromCode } from '../utils/weatherCodes.js';
import { normalizeWeatherType } from '../utils/weatherTypes.js';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchWeatherByCity(city) {
  const place = await findCity(city);
  return searchWeatherByPlace(place);
}

export async function searchWeatherByPlace(place) {
  const data = await getWeather(place.latitude, place.longitude);
  const summary = formatCurrentWeatherSummary(data);

  return {
    city: formatCityName(place),
    favorite: {
      name: place.name,
      country: place.country,
      admin1: place.admin1,
      latitude: place.latitude,
      longitude: place.longitude,
    },
    date: summary.date,
    temperature: summary.temperature,
    humidity: summary.humidity,
    wind: summary.windSpeed,
    minTemperature: summary.minTemp,
    maxTemperature: summary.maxTemp,
    description: summary.description,
    type: summary.weatherType,
    forecast: formatForecast(data.daily),
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

export async function getCurrentWeatherSummary(place) {
  const data = await getWeather(place.latitude, place.longitude);
  const summary = formatCurrentWeatherSummary(data);

  console.log('DEBUG WEATHER - api summary', {
    city: place.name,
    coordinates: {
      latitude: place.latitude,
      longitude: place.longitude,
    },
    weatherCode: summary.weatherCode,
    weatherType: summary.weatherType,
    description: summary.description,
    temperature: summary.temperature,
  });

  return summary;
}

export async function getCurrentWeatherSummaries(places) {
  const summaries = await Promise.allSettled(
    places.map(async (place) => {
      const data = await getWeather(place.latitude, place.longitude);
      return {
        ...place,
        weather: formatCurrentWeatherSummary(data),
      };
    }),
  );

  return summaries
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value);
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

async function getWeather(latitude, longitude) {
  const url = new URL(FORECAST_URL);
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m');
  url.searchParams.set('daily', 'weather_code,temperature_2m_min,temperature_2m_max');
  url.searchParams.set('forecast_days', '8');
  url.searchParams.set('timezone', 'auto');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('No se pudo consultar el tiempo.');
  }

  const data = await response.json();

  if (!data.current) {
    throw new Error('La respuesta del tiempo no contiene datos actuales.');
  }

  return data;
}

function formatCityName(place) {
  return [place.name, place.admin1, place.country].filter(Boolean).join(', ');
}

function formatCurrentWeatherSummary(data) {
  const weather = data.current;
  const weatherCode = weather.weather_code;

  return {
    date: weather.time,
    weatherCode,
    weatherType: normalizeWeatherType(getWeatherTypeFromCode(weatherCode)),
    description: getWeatherDescriptionFromCode(weatherCode),
    temperature: Math.round(weather.temperature_2m),
    humidity: weather.relative_humidity_2m,
    windSpeed: Math.round(weather.wind_speed_10m),
    minTemp: roundTemperature(data.daily?.temperature_2m_min?.[0]),
    maxTemp: roundTemperature(data.daily?.temperature_2m_max?.[0]),
  };
}

function formatForecast(daily) {
  if (!daily?.time || !daily?.weather_code) return [];

  return daily.time.slice(1, 8).map((date, index) => {
    const weatherCode = daily.weather_code[index + 1];

    return {
      date,
      weatherCode,
      weekdayInitial: getWeekdayInitial(date),
      weatherType: getWeatherTypeFromCode(weatherCode),
      description: getWeatherDescriptionFromCode(weatherCode),
    };
  });
}

function getWeekdayInitial(date) {
  const initials = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  return initials[new Date(`${date}T12:00:00`).getDay()];
}

function roundTemperature(value) {
  return Number.isFinite(value) ? Math.round(value) : null;
}
