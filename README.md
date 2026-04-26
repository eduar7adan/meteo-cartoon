# Weather Gazette

Weather Gazette es una app React + Vite para consultar el tiempo actual de una ciudad usando Open-Meteo. No necesita backend, base de datos, login ni API key.

La interfaz tiene una estetica de periodico antiguo en blanco y negro, con ilustraciones meteorologicas animadas en estilo cartoon/editorial.

## Funcionalidades

- Busqueda de ciudad con Open-Meteo Geocoding API.
- Consulta del tiempo actual con Open-Meteo Forecast API.
- Visualizacion de ciudad, fecha, temperatura, humedad, viento y descripcion del tiempo.
- Estado de carga mientras se consulta la API.
- Estado de error si la ciudad no existe o falla la consulta.
- Persistencia de la ultima ciudad buscada en `localStorage`.
- Diseno responsive para movil.
- Animaciones CSS para sol, pocas nubes, nublado, lluvia, tormenta, nieve y niebla.

## APIs utilizadas

La app usa dos endpoints publicos de Open-Meteo:

- Geocoding API: `https://geocoding-api.open-meteo.com/v1/search`
- Forecast API: `https://api.open-meteo.com/v1/forecast`

Primero se busca la ciudad para obtener sus coordenadas. Despues se usan `latitude` y `longitude` para consultar el tiempo actual.

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
    Layout.jsx
    Search.jsx
    WeatherAnimation.jsx
    WeatherCard.jsx
  utils/
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

## Preparar para GitHub

Si ya has creado un repositorio vacio en GitHub, puedes enlazarlo y subirlo con:

```bash
git remote add origin https://github.com/TU_USUARIO/weather-app.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```

Si el remoto ya existe, cambia la URL con:

```bash
git remote set-url origin https://github.com/TU_USUARIO/weather-app.git
```

## Notas

- No se incluye `node_modules` en GitHub.
- `package-lock.json` si se sube, para mantener instalaciones reproducibles.
- No hay variables de entorno ni claves privadas.
