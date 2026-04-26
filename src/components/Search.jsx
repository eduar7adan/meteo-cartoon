import { useEffect, useState } from 'react';
import { searchCitySuggestions } from '../api/weatherApi.js';

const DEFAULT_LOCATION = {
  latitude: 40.4168,
  longitude: -3.7038,
};

const UNWANTED_TERMS = [
  'airport',
  'aeropuerto',
  'aquapark',
  'park',
  'parque',
  'department',
  'departamento',
  'subdivision',
  'province',
  'provincia',
  'region',
  'county',
  'district',
];

export default function Search({ onSearch, isLoading, initialCity = '' }) {
  const [city, setCity] = useState(initialCity);
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    setCity(initialCity);
  }, [initialCity]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => setUserLocation(DEFAULT_LOCATION),
    );
  }, []);

  useEffect(() => {
    if (!isFocused || city.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    let ignore = false;
    const timeoutId = setTimeout(async () => {
      try {
        const results = await searchCitySuggestions(city);
        const usefulResults = results
          .filter((suggestion) => isUsefulSuggestion(suggestion))
          .filter((suggestion, index, suggestionsList) => {
            const key = getSuggestionKey(suggestion);
            return suggestionsList.findIndex((item) => getSuggestionKey(item) === key) === index;
          });
        const exactResults = usefulResults.filter(
          (suggestion) => normalizeText(suggestion.name) === normalizeText(city),
        );
        const sortedResults = (exactResults.length > 0 ? exactResults : usefulResults)
          .map((suggestion) => ({
            ...suggestion,
            distance: getDistance(userLocation, suggestion),
            matchPriority: getMatchPriority(city, suggestion.name),
          }))
          .sort((a, b) => a.matchPriority - b.matchPriority || a.distance - b.distance)
          .slice(0, 5);

        if (!ignore) setSuggestions(sortedResults);
      } catch {
        if (!ignore) setSuggestions([]);
      }
    }, 300);

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [city, isFocused, userLocation]);

  function handleSubmit(event) {
    event.preventDefault();
    setSuggestions([]);
    onSearch(city);
  }

  function handleSuggestionClick(suggestion) {
    setCity(suggestion.name);
    setIsFocused(false);
    setSuggestions([]);
    onSearch(suggestion);
  }

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <label htmlFor="city">Buscar ciudad</label>
      <div className="search-row">
        <div className="search-input-wrap">
          <input
            id="city"
            type="search"
            value={city}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setSuggestions([]), 120);
            }}
            onChange={(event) => setCity(event.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Madrid, Buenos Aires, Londres..."
            disabled={isLoading}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <button type="button" onMouseDown={() => handleSuggestionClick(suggestion)}>
                    <strong>{suggestion.name}</strong>
                    <span>
                      {[suggestion.admin1, suggestion.country].filter(Boolean).join(', ')}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Consultando...' : 'Buscar'}
        </button>
      </div>
    </form>
  );
}

function isUsefulSuggestion(suggestion) {
  const name = normalizeText(suggestion.name);
  return !UNWANTED_TERMS.some((term) => name.includes(term));
}

function getSuggestionKey(suggestion) {
  return [suggestion.name, suggestion.country, suggestion.admin1].map(normalizeText).join('|');
}

function getMatchPriority(query, name) {
  const normalizedQuery = normalizeText(query);
  const normalizedName = normalizeText(name);

  if (normalizedName === normalizedQuery) return 0;
  if (normalizedName.startsWith(`${normalizedQuery} `)) return 2;
  return 1;
}

function getDistance(from, to) {
  const earthRadius = 6371;
  const latDistance = toRadians(to.latitude - from.latitude);
  const lonDistance = toRadians(to.longitude - from.longitude);
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);

  const a =
    Math.sin(latDistance / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(lonDistance / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}
