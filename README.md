# TonoSound — Landing

Landing page de **TonoSound** (alquiler de sonido, iluminación y pantallas LED para eventos), destino de las campañas de Meta Ads.

Sitio: https://tonosound.com.ar

## Estructura

Sitio estático, sin build: `index.html`, `styles.css`, `main.js`, `assets/`. Se publica con GitHub Pages desde la rama `main`.

## Configuración

Al principio de `main.js`:

```js
const CONFIG = {
  whatsapp: "5491100000000", // número en formato internacional, sin + ni espacios
  metaPixelId: "",           // ID del Pixel de Meta
  instagram: "",             // URL de Instagram (opcional)
};
```

Eventos de Pixel: `PageView`, `ViewContent` (clic en "Pedí tu cotización"), `Contact` (clic en WhatsApp), `Lead` (envío del formulario).

El formulario de cotización arma un mensaje y abre WhatsApp con los datos precargados.

## Dominio

`CNAME` apunta a `tonosound.com.ar`. En el DNS del dominio:

| Tipo  | Nombre | Valor                 |
|-------|--------|-----------------------|
| A     | @      | 185.199.108.153       |
| A     | @      | 185.199.109.153       |
| A     | @      | 185.199.110.153       |
| A     | @      | 185.199.111.153       |
| CNAME | www    | lungoremaxx.github.io |
