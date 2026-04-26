import { useEffect, useState } from 'react';
import { searchWeatherByCity } from './api/weatherApi.js';
import Layout from './components/Layout.jsx';
import Search from './components/Search.jsx';
import WeatherCard from './components/WeatherCard.jsx';

const LAST_CITY_KEY = 'weather-app-last-city';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [lastCity, setLastCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const savedCity = localStorage.getItem(LAST_CITY_KEY);

    if (savedCity) {
      setLastCity(savedCity);
      handleSearch(savedCity);
    }
  }, []);

  async function handleSearch(city) {
    const cleanCity = city.trim();

    if (!cleanCity) {
      setError('Escribe una ciudad para consultar el parte.');
      setWeather(null);
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const result = await searchWeatherByCity(cleanCity);
      setWeather(result);
      setLastCity(cleanCity);
      localStorage.setItem(LAST_CITY_KEY, cleanCity);
    } catch (err) {
      setWeather(null);
      setError(err.message || 'Ha ocurrido un error al consultar el tiempo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Layout>
      <Search onSearch={handleSearch} isLoading={isLoading} initialCity={lastCity} />

      {isLoading && (
        <section className="state-panel loading-panel" aria-live="polite">
          <span className="printing-dot" />
          Imprimiendo el parte meteorologico...
        </section>
      )}

      {error && (
        <section className="state-panel error-panel" role="alert">
          {error}
        </section>
      )}

      {!isLoading && !error && weather && <WeatherCard weather={weather} />}

      {!isLoading && !error && !weather && (
        <section className="intro-panel">
          <h2>El cielo, en portada</h2>
          <p>Busca una ciudad para ver su tiempo actual con una pequena ilustracion animada.</p>
        </section>
      )}
    </Layout>
  );
}
