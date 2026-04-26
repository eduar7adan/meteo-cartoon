function normalizeWeatherType(value) {
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

export default function WeatherAnimation({ type, compact = false }) {
  const weatherType = normalizeWeatherType(type);

  return (
    <section
      className={`weather-art weather-art--${weatherType}${compact ? ' weather-art--compact' : ''}`}
      aria-label={`Animacion del tiempo: ${weatherType}`}
    >
      <div className="weather-art__stage">
        {weatherType === 'sunny' && <SunnyIcon />}
        {weatherType === 'partly-cloudy' && <PartlyCloudyIcon />}
        {weatherType === 'cloudy' && <CloudyIcon />}
        {weatherType === 'rain' && <RainIcon />}
        {weatherType === 'storm' && <StormIcon />}
        {weatherType === 'snow' && <SnowIcon />}
        {weatherType === 'fog' && <FogIcon />}
      </div>
    </section>
  );
}

function CloudShape({ muted = false }) {
  return (
    <svg className="wa-cloud-svg" viewBox="0 0 260 160" aria-hidden="true">
      <path
        className={muted ? 'wa-cloud-path wa-cloud-path--muted' : 'wa-cloud-path'}
        d="M42 106 C26 106 14 94 14 78 C14 61 26 48 43 46 C47 29 62 17 81 17 C98 17 113 26 121 39 C128 31 139 26 153 26 C176 26 194 42 198 63 C218 65 233 79 233 97 C233 116 218 130 198 130 L56 130 C37 130 22 119 18 103 C25 105 33 106 42 106 Z"
      />
    </svg>
  );
}

function CloudShadow({ className = '' }) {
  return <div className={`wa-cloud-shadow ${className}`} />;
}

function SunRays({ compact = false }) {
  const totalRays = compact ? 10 : 18;

  return (
    <div className={compact ? 'wa-rays wa-rays--compact' : 'wa-rays'}>
      {Array.from({ length: totalRays }, (_, index) => {
        const size = index % 3 === 0 ? 'long' : index % 2 === 0 ? 'medium' : 'short';

        return (
          <span
            key={index}
            className={`wa-ray wa-ray--${size}`}
            style={{ '--ray-rot': `${(360 / totalRays) * index}deg` }}
          />
        );
      })}
    </div>
  );
}

function SunnyIcon() {
  return (
    <div className="wa-scene wa-sun-scene">
      <SunRays />
      <div className="wa-sun-orbit" />
      <div className="wa-sun-core">
        <span />
      </div>
    </div>
  );
}

function CloudyIcon() {
  return (
    <div className="wa-scene">
      <CloudShadow className="wa-shadow--back" />
      <CloudShadow className="wa-shadow--middle" />
      <CloudShadow className="wa-shadow--front" />
      <CloudShadow className="wa-shadow--wide" />
      <div className="wa-cloud-layer wa-cloud-layer--back">
        <CloudShape muted />
      </div>
      <div className="wa-cloud-layer wa-cloud-layer--middle">
        <CloudShape />
      </div>
      <div className="wa-cloud-layer">
        <CloudShape />
      </div>
    </div>
  );
}

function PartlyCloudyIcon() {
  return (
    <div className="wa-scene wa-partly-cloudy-scene">
      <div className="wa-peek-sun-group">
        <span className="wa-peek-ray wa-peek-ray--one" />
        <span className="wa-peek-ray wa-peek-ray--two" />
        <span className="wa-peek-ray wa-peek-ray--three" />
        <span className="wa-peek-ray wa-peek-ray--four" />
        <span className="wa-peek-ray wa-peek-ray--five" />
      </div>
      <div className="wa-small-sun">
        <span />
      </div>
      <CloudShadow className="wa-shadow--single" />
      <CloudShadow className="wa-shadow--single-soft" />
      <div className="wa-cloud-layer wa-cloud-layer--single">
        <CloudShape />
      </div>
    </div>
  );
}

function RainIcon() {
  return (
    <div className="wa-scene">
      <CloudShadow className="wa-shadow--front" />
      <div className="wa-cloud-layer wa-cloud-layer--rain">
        <CloudShape />
      </div>
      <div className="wa-drop wa-drop--big wa-d1" />
      <div className="wa-drop wa-drop--small wa-d2" />
      <div className="wa-drop wa-drop--medium wa-d3" />
      <div className="wa-drop wa-drop--big wa-d4" />
      <div className="wa-drop wa-drop--small wa-d5" />
    </div>
  );
}

function StormIcon() {
  return (
    <div className="wa-scene">
      <CloudShadow className="wa-shadow--front" />
      <div className="wa-cloud-layer wa-cloud-layer--storm">
        <CloudShape />
      </div>
      <div className="wa-bolt" />
      <div className="wa-electric wa-electric--one" />
      <div className="wa-electric wa-electric--two" />
    </div>
  );
}

function SnowIcon() {
  return (
    <div className="wa-scene">
      <CloudShadow className="wa-shadow--front" />
      <div className="wa-cloud-layer wa-cloud-layer--snow">
        <CloudShape />
      </div>
      <div className="wa-flake wa-f1"><span /></div>
      <div className="wa-flake wa-f2"><span /></div>
      <div className="wa-flake wa-f3"><span /></div>
      <div className="wa-flake wa-f4"><span /></div>
      <div className="wa-flake wa-f5"><span /></div>
    </div>
  );
}

function FogIcon() {
  return (
    <div className="wa-scene">
      <div className="wa-fog-circle" />
      <div className="wa-band wa-b1" />
      <div className="wa-band wa-b2" />
      <div className="wa-band wa-b3" />
      <div className="wa-band wa-b4" />
    </div>
  );
}
