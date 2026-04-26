# Weather Gazette

Weather Gazette es una app React + Vite para consultar el tiempo actual de una ciudad usando Open-Meteo. No necesita backend, base de datos, login ni API key.

La interfaz usa una estetica de periodico antiguo en blanco y negro, con ilustraciones meteorologicas animadas en estilo cartoon/editorial.

## Funcionalidades

- Busqueda de ciudades con Open-Meteo Geocoding API.
- Autocompletado de ciudades con debounce.
- Orden de sugerencias por cercania al usuario usando geolocalizacion y formula Haversine.
- Fallback de ubicacion a Madrid si el usuario no concede permisos de ubicacion.
- Filtrado de sugerencias poco utiles, como aeropuertos, parques o entidades administrativas.
- Consulta del tiempo actual con Open-Meteo Forecast API.
- Visualizacion de ciudad, fecha, temperatura, humedad, viento y descripcion del tiempo.
- Estados de carga y error.
- Persistencia de la ultima ciudad buscada en `localStorage`.
- Favoritos persistidos en `localStorage`.
- Vista de favoritos con listado de ciudades guardadas.
- Vista de detalle para ciudades favoritas.
- Eliminacion de favoritos con modal visual integrado en la app.
- Diseno responsive para movil.
- Animaciones CSS para sol, pocas nubes, nublado, lluvia, tormenta, nieve y niebla.

## APIs utilizadas

La app usa dos endpoints publicos de Open-Meteo:

- Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast API: `https://api.open-meteo.com/v1/forecast`

Flujo principal:

1. Se busca una ciudad con la Geocoding API.
2. Se obtienen `latitude` y `longitude`.
3. Se consulta el tiempo actual con la Forecast API.

Para favoritos, la app guarda coordenadas y consulta el tiempo directamente por `latitude` y `longitude`.

## Requisitos

- Node.js
- npm

## Instalacion

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Despues abre la URL que muestre Vite, normalmente:

```txt
http://localhost:5173
```

## Crear build de produccion

```bash
npm run build
```

## Previsualizar el build

```bash
npm run preview
```

## Estructura del proyecto

```txt
src/
  api/
    weatherApi.js
  components/
    CityDetail.jsx
    Favorites.jsx
    Layout.jsx
    Search.jsx
    WeatherAnimation.jsx
    WeatherCard.jsx
  utils/
    favorites.js
    weatherCodes.js
  App.jsx
  index.css
  main.jsx
```

## Mapeo meteorologico

Los codigos de Open-Meteo se transforman en categorias visuales:

- `sunny`: cielo despejado.
- `partly-cloudy`: pocas nubes.
- `cloudy`: nublado.
- `rain`: lluvia o llovizna.
- `storm`: tormenta.
- `snow`: nieve.
- `fog`: niebla.

## LocalStorage

La app guarda informacion local en el navegador:

- `weather-app-last-city`: ultima ciudad buscada.
- `weather-app-favorites`: ciudades favoritas.

Cada favorito guarda:

```js
{
  name: 'Valencia',
  country: 'Espana',
  admin1: 'Valencia',
  latitude: 39.4699,
  longitude: -0.3763
}
```

Los duplicados se evitan por `latitude + longitude`.

## Preparar para GitHub

Antes de subir, asegúrate de que `node_modules` no se sube al repositorio. El archivo `.gitignore` ya lo excluye.

Si `node_modules` ya estuviera trackeado por Git, ejecuta:

```bash
git rm -r --cached node_modules
```

Luego prepara el commit:

```bash
git add .
git commit -m "Update weather app version"
```

Si el remoto ya esta configurado:

```bash
git push
```

Si necesitas configurar el remoto:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

Si el remoto ya existe pero quieres cambiarlo:

```bash
git remote set-url origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
```

## Notas

- No hay backend.
- No hay base de datos.
- No hay login.
- No hay API keys.
- No se usan librerias externas para las animaciones, favoritos, modal o geolocalizacion.
- `package-lock.json` debe subirse para mantener instalaciones reproducibles.
