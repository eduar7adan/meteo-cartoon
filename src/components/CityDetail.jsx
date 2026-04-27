import WeatherAnimation from './WeatherAnimation.jsx';
import WeatherMiniIcon from './WeatherMiniIcon.jsx';

export default function CityDetail({ weather }) {
  const subtitle = [weather.favorite?.admin1, weather.favorite?.country].filter(Boolean).join(', ');
  const minTemperature = Number.isFinite(weather.minTemperature) ? weather.minTemperature : '--';
  const maxTemperature = Number.isFinite(weather.maxTemperature) ? weather.maxTemperature : '--';
  const rangePosition = getRangePosition(
    weather.temperature,
    weather.minTemperature,
    weather.maxTemperature,
  );

  console.log('DEBUG WEATHER - detail animation', {
    city: weather.favorite?.name || weather.city,
    weatherCode: weather.weatherCode,
    weatherType: weather.type,
    description: weather.description,
    type: weather.type,
  });

  return (
    <section className="city-detail">
      <article className="city-detail-card">
        <header className="city-detail-header">
          <h2>{weather.favorite?.name || weather.city}</h2>
          {subtitle && <p>{subtitle}</p>}
        </header>

        <div className="city-detail-main">
          <section className="city-detail-summary">
            <p className="temperature">{weather.temperature}&deg;C</p>
            <p className="description">{weather.description}</p>
          </section>

          <WeatherAnimation type={weather.type} />
        </div>

        <dl className="city-detail-metrics">
          <div>
            <dt>Humedad</dt>
            <dd>{weather.humidity}%</dd>
          </div>
          <div>
            <dt>Viento</dt>
            <dd>{weather.wind} km/h</dd>
          </div>
          <div className="temperature-range">
            <span>MIN {minTemperature}&deg;C</span>
            <i style={{ '--range-position': `${rangePosition}%` }} />
            <span>MAX {maxTemperature}&deg;C</span>
          </div>
        </dl>
      </article>
      {weather.forecast?.length > 0 && (
        <section className="forecast-section" aria-label="Prevision de los proximos 7 dias">
          <h3>Próximos 7 días</h3>
          <div className="forecast-grid">
            {weather.forecast.map((day) => (
              <article className="forecast-day" key={day.date} title={day.description}>
                <WeatherMiniIcon type={day.weatherType} />
                <strong>{day.weekdayInitial}</strong>
              </article>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}

function getRangePosition(current, min, max) {
  if (!Number.isFinite(current) || !Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    return 50;
  }

  return Math.min(100, Math.max(0, ((current - min) / (max - min)) * 100));
}
