import { useEffect, useState } from 'react';
import { getCurrentWeatherType } from '../api/weatherApi.js';
import WeatherMiniIcon from './WeatherMiniIcon.jsx';

export default function Favorites({ favorites, onSelect, onRemove }) {
  const [favoriteToRemove, setFavoriteToRemove] = useState(null);
  const [weatherTypes, setWeatherTypes] = useState({});

  useEffect(() => {
    let ignore = false;

    async function loadWeatherTypes() {
      const entries = await Promise.all(
        favorites.map(async (favorite) => {
          const key = getFavoriteKey(favorite);

          try {
            return [key, await getCurrentWeatherType(favorite)];
          } catch {
            return [key, 'cloudy'];
          }
        }),
      );

      if (!ignore) setWeatherTypes(Object.fromEntries(entries));
    }

    loadWeatherTypes();

    return () => {
      ignore = true;
    };
  }, [favorites]);

  function handleRemoveClick(event, favorite) {
    event.stopPropagation();
    setFavoriteToRemove(favorite);
  }

  function handleConfirmRemove() {
    onRemove(favoriteToRemove);
    setFavoriteToRemove(null);
  }

  if (favorites.length === 0) {
    return (
      <section className="intro-panel">
        <h2>Sin favoritos</h2>
        <p>Guarda una ciudad desde su informe para verla aqui.</p>
      </section>
    );
  }

  return (
    <section className="favorites-panel">
      <h2>Ciudades favoritas</h2>
      <ul className="favorites-list">
        {favorites.map((favorite) => (
          <li key={`${favorite.latitude}-${favorite.longitude}`}>
            <button type="button" className="favorite-main" onClick={() => onSelect(favorite)}>
              <span>
                <strong>{favorite.name}</strong>
                <span>{[favorite.admin1, favorite.country].filter(Boolean).join(', ')}</span>
              </span>
              <span className="favorite-weather">
                {weatherTypes[getFavoriteKey(favorite)] ? (
                  <WeatherMiniIcon type={weatherTypes[getFavoriteKey(favorite)]} />
                ) : (
                  <span className="favorite-weather-placeholder" />
                )}
              </span>
            </button>
            <button
              type="button"
              className="remove-favorite"
              aria-label="Eliminar favorito"
              onClick={(event) => handleRemoveClick(event, favorite)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 8h8m-7 3v7m3-7v7m3-7v7M6 8l1 13h10l1-13M10 5h4l1 3H9l1-3Z" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {favoriteToRemove && (
        <div className="modal-overlay" onClick={() => setFavoriteToRemove(null)}>
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <h3>¿Eliminar esta ciudad de favoritos?</h3>
            <p>{favoriteToRemove.name}</p>
            <div className="modal-actions">
              <button type="button" onClick={() => setFavoriteToRemove(null)}>
                Cancelar
              </button>
              <button type="button" onClick={handleConfirmRemove}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function getFavoriteKey(favorite) {
  return `${favorite.latitude}-${favorite.longitude}`;
}
