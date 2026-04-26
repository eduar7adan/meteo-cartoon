export default function WeatherMiniIcon({ type = 'cloudy' }) {
  return (
    <span className={`forecast-icon forecast-icon--${type}`} aria-hidden="true">
      <span className="forecast-sun" />
      <span className="forecast-cloud" />
      <span className="forecast-mark" />
    </span>
  );
}
