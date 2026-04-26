import WeatherAnimation from './WeatherAnimation.jsx';

export default function WeatherCard({ weather }) {
  const formattedDate = new Intl.DateTimeFormat('es', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(weather.date));

  return (
    <article className="weather-card">
      <div className="card-kicker">Informe actual</div>
      <div className="weather-grid">
        <section className="weather-main">
          <h2>{weather.city}</h2>
          <p className="date">{formattedDate}</p>
          <p className="temperature">{weather.temperature}&deg;C</p>
          <p className="description">{weather.description}</p>
        </section>

        <WeatherAnimation type={weather.type} />
      </div>

      <dl className="weather-details">
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
  );
}
