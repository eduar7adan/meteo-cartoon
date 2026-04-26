export default function Layout({ children }) {
  return (
    <div className="page-shell">
      <header className="newspaper-header">
        <p className="eyebrow">Edicion meteorologica diaria</p>
        <h1>Weather Gazette</h1>
        <div className="header-line">
          <span>Sin API key</span>
          <span>Open-Meteo</span>
          <span>Blanco y negro</span>
        </div>
      </header>

      <main className="content">{children}</main>

      <footer className="footer-note">
        Datos servidos por Open-Meteo. Ilustraciones hechas con CSS.
      </footer>
    </div>
  );
}
