const FAVORITES_KEY = 'weather-app-favorites';

export function readFavorites() {
  return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
}

export function saveFavorite(favorite) {
  const favorites = readFavorites();
  const exists = favorites.some(
    (item) => item.latitude === favorite.latitude && item.longitude === favorite.longitude,
  );

  if (exists) return favorites;

  const nextFavorites = [...favorites, favorite];
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
