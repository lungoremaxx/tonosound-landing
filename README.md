# TonoSound — Landing

Landing page de **TonoSound** (alquiler de sonido, iluminación y pantallas LED para eventos), destino de las campañas de Meta Ads.

Sitio: https://tonosound.com.ar

## Estructura

Sitio estático, sin build: `index.html`, `styles.css`, `main.js`, `assets/`.

## Deploy (Cloudflare)

Se publica como Worker con archivos estáticos (`wrangler.jsonc`, proyecto `tonosound`):

```bash
npx wrangler deploy
```

`.assetsignore` excluye del deploy los archivos que no son del sitio.

## Configuración

Al principio de `main.js`:

```js
const CONFIG = {
  whatsapp: "5493518750771", // número en formato internacional, sin + ni espacios
  metaPixelId: "",           // ID del Pixel de Meta
  instagram: "",             // URL de Instagram (opcional)
};
```

Eventos de Pixel: `PageView`, `ViewContent` (clic en "Pedí tu cotización"), `Contact` (clic en WhatsApp), `Lead` (envío del formulario).

El formulario de cotización arma un mensaje y abre WhatsApp con los datos precargados.

## Dominio

El dominio `tonosound.com.ar` se gestiona en Cloudflare y se asigna al Worker `tonosound` como Custom Domain.
