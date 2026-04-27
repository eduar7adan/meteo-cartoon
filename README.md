# La Gaceta del Tiempo

Aplicacion meteorologica en React con estetica editorial en blanco y negro. Permite consultar el tiempo actual, guardar ciudades favoritas, revisar una vista de detalle con prevision de 7 dias y explorar un mapa meteorologico interactivo con mini animaciones.

## Funcionalidades principales

- Busqueda de ciudades con autocompletado usando Open-Meteo Geocoding API.
- Consulta del tiempo actual mediante Open-Meteo, sin backend y sin API key.
- Vista de detalle de ciudad con temperatura, humedad, viento, minima, maxima y prevision de 7 dias.
- Ciudades favoritas persistidas en localStorage.
- Mapa meteorologico interactivo con Leaflet y marcadores animados.
- Animaciones meteorologicas en blanco y negro para sol, nubes, lluvia, tormenta, nieve y niebla.
- Transiciones visuales tipo pagina de periodico entre vistas.
- Diseno responsive para movil y escritorio.

## Tecnologias usadas

- React
- Vite
- Leaflet
- React Leaflet
- Open-Meteo Forecast API
- Open-Meteo Geocoding API
- CSS personalizado
- localStorage

## Como ejecutar localmente

```bash
npm install
npm run dev
```

Despues abre la URL local que indique Vite, normalmente:

```bash
http://localhost:5173/
```

## Proximos pasos

- Mejorar la seleccion dinamica de ubicaciones del mapa segun pais o region.
- Anadir capas meteorologicas adicionales al mapa.
- Permitir ordenar o agrupar favoritos.
- Revisar accesibilidad y navegacion por teclado.
- Preparar una version desplegable en produccion.
