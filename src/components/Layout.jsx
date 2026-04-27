export default function Layout({ children }) {
  return (
    <div className="page-shell">
      <header className="newspaper-header">
        <p className="eyebrow">Edicion meteorologica diaria</p>
        <h1>La Gaceta del Tiempo</h1>
      </header>

      <main className="content">{children}</main>

      <p className="app-credit">APP desarrollada por Eduardo A.R.</p>
    </div>
  );
}
