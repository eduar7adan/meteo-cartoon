import { useEffect, useState } from 'react';

export default function Search({ onSearch, isLoading, initialCity = '' }) {
  const [city, setCity] = useState(initialCity);

  useEffect(() => {
    setCity(initialCity);
  }, [initialCity]);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(city);
  }

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <label htmlFor="city">Buscar ciudad</label>
      <div className="search-row">
        <input
          id="city"
          type="search"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Madrid, Buenos Aires, Londres..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Consultando...' : 'Buscar'}
        </button>
      </div>
    </form>
  );
}
