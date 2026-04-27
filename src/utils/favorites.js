const FAVORITES_KEY = 'weather-app-favorites';

export function readFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]').map(normalizeFavorite);
}

export function saveFavorite(favorite) {
  const favorites = readFavorites();
  const cleanFavorite = normalizeFavorite(favorite);
  const exists = favorites.some(
    (item) => item.latitude === cleanFavorite.latitude && item.longitude === cleanFavorite.longitude,
  );

  if (exists) return favorites;

  const nextFavorites = [...favorites, cleanFavorite];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
  return nextFavorites;
}

export function removeFavorite(favorite) {
  const nextFavorites = readFavorites().filter(
    (item) => item.latitude !== favorite.latitude || item.longitude !== favorite.longitude,
  );

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
  return nextFavorites;
}

function normalizeFavorite(favorite) {
  return {
    name: favorite.name,
    country: favorite.country,
    admin1: favorite.admin1,
    latitude: favorite.latitude,
    longitude: favorite.longitude,
  };
}
