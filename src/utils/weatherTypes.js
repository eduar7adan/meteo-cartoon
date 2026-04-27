export function normalizeWeatherType(value) {
  const type = String(value || '').toLowerCase();

  if (type === 'sunny' || type === 'clear') return 'sunny';
  if (type === 'partly-cloudy' || type === 'partly_cloudy') return 'partly-cloudy';
  if (type === 'cloudy' || type === 'cloud') return 'cloudy';
  if (type === 'rain' || type === 'drizzle') return 'rain';
  if (type === 'storm' || type === 'thunder') return 'storm';
  if (type === 'snow') return 'snow';
  if (type === 'fog' || type === 'mist') return 'fog';

  return 'cloudy';
}
