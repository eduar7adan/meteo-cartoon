import { useEffect, useState } from 'react';
import { searchWeatherByCity, searchWeatherByPlace } from './api/weatherApi.js';
import CityDetail from './components/CityDetail.jsx';
import Favorites from './components/Favorites.jsx';
import Layout from './components/Layout.jsx';
import Search from './components/Search.jsx';
import WeatherCard from './components/WeatherCard.jsx';
import WeatherMap from './components/WeatherMap.jsx';
import { readFavorites, removeFavorite, saveFavorite } from './utils/favorites.js';

const LAST_CITY_KEY = 'weather-app-last-city';
const PAGE_TURN_DURATION = 1040;
const VIEW_ORDER = ['search', 'favorites', 'map', 'cityDetail'];

export default function App() {
  const [weather, setWeather] = useState(null);
  const [lastCity, setLastCity] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('search');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageTurnDirection, setPageTurnDirection] = useState('');

  useEffect(() => {
    setFavorites(readFavorites());
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
      setView('search');
      localStorage.setItem(LAST_CITY_KEY, cleanCity);
    } catch (err) {
      setWeather(null);
      setError(err.message || 'Ha ocurrido un error al consultar el tiempo.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFavoriteSelect(favorite) {
    try {
      setIsLoading(true);
      setError('');
      startPageTurn('forward');

      const result = await searchWeatherByPlace(favorite);
      setWeather(result);
      setView('cityDetail');
    } catch (err) {
      setWeather(null);
      setError(err.message || 'Ha ocurrido un error al consultar el tiempo.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSaveFavorite(favorite) {
    try {
      setIsLoading(true);
      setError('');
      startPageTurn('forward');
      setFavorites(saveFavorite(favorite));

      const result = await searchWeatherByPlace(favorite);
      setWeather(result);
      setView('cityDetail');
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error al consultar el tiempo.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleRemoveFavorite(favorite) {
    setFavorites(removeFavorite(favorite));
  }

  function startPageTurn(direction) {
    setPageTurnDirection(direction);
    setTimeout(() => setPageTurnDirection(''), PAGE_TURN_DURATION);
  }

  function handleViewChange(nextView) {
    if (nextView === view) return;

    const direction =
      VIEW_ORDER.indexOf(nextView) > VIEW_ORDER.indexOf(view) ? 'forward' : 'back';
    startPageTurn(direction);
    setView(nextView);
  }

  return (
    <Layout>
      <nav className="view-tabs">
        <button type="button" onClick={() => handleViewChange('search')} disabled={view === 'search'}>
          Buscar
        </button>
        <button type="button" onClick={() => handleViewChange('favorites')} disabled={view === 'favorites'}>
          Favoritos
        </button>
        <button type="button" onClick={() => handleViewChange('map')} disabled={view === 'map'}>
          Mapa
        </button>
      </nav>

      {view === 'search' && (
        <Search onSearch={handleSearch} isLoading={isLoading} initialCity={lastCity} />
      )}

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

      {!isLoading && !error && view === 'search' && weather && (
        <WeatherCard weather={weather} onSaveFavorite={handleSaveFavorite} />
      )}

      {!isLoading && !error && view === 'search' && !weather && (
        <section className="intro-panel">
          <h2>El cielo, en portada</h2>
          <p>Busca una ciudad para ver su tiempo actual con una pequena ilustracion animada.</p>
        </section>
      )}

      {!isLoading && !error && view === 'favorites' && (
        <Favorites favorites={favorites} onSelect={handleFavoriteSelect} onRemove={handleRemoveFavorite} />
      )}

      {!isLoading && !error && view === 'map' && <WeatherMap />}

      {!isLoading && !error && view === 'cityDetail' && weather && (
        <CityDetail
          weather={weather}
          onBackToFavorites={() => setView('favorites')}
          onSearchAnother={() => setView('search')}
        />
      )}

      {pageTurnDirection && (
        <div className={`page-turn page-turn--${pageTurnDirection}`} aria-hidden="true" />
      )}
    </Layout>
  );
}
