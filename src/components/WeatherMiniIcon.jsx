import { normalizeWeatherType } from '../utils/weatherTypes.js';

export default function WeatherMiniIcon({ type = 'cloudy' }) {
  const weatherType = normalizeWeatherType(type);
  const showSun = weatherType === 'sunny' || weatherType === 'partly-cloudy';
  const showCloud = ['partly-cloudy', 'cloudy', 'rain', 'storm', 'snow'].includes(weatherType);
  const showMark = ['rain', 'storm', 'snow', 'fog'].includes(weatherType);

  return (
    <span className={`forecast-icon forecast-icon--${weatherType}`} aria-hidden="true">
      {showSun && <span className="forecast-sun" />}
      {showCloud && <span className="forecast-cloud" />}
      {showMark && <span className="forecast-mark" />}
    </span>
  );
}
