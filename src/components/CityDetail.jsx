import WeatherAnimation from './WeatherAnimation.jsx';

export default function CityDetail({ weather }) {
  const subtitle = [weather.favorite?.admin1, weather.favorite?.country].filter(Boolean).join(', ');

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
        </dl>
      </article>
    </section>
  );
}
