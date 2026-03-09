# Celi Vibes - Deploy listo para hosting Node

Tienda publica + panel admin con persistencia en servidor, login de administrador por cookie segura, pedidos centralizados y subida de imagenes a Cloudinary firmada desde backend.

## Que guarda el servidor

- Productos
- Contenido publico
- Pedidos
- Credenciales del admin con hash
- Sesion de administrador

Todo eso queda persistido en `data/store.json`.

`localStorage` se usa solo para:

- carrito del cliente
- filtros de la tienda
- borrador del checkout
- suscriptores del newsletter en ese navegador

## Requisitos

- Node.js 18 o superior
- Cuenta Cloudinary activa
- Hosting con proceso Node
- Disco/volumen persistente si quieres conservar datos entre reinicios o redeploys

## Configuracion

1. Crear `.env` desde `.env.example`

```bash
copy .env.example .env
```

2. Completar al menos:

```env
PORT=3000
NODE_ENV=production

ADMIN_USERNAME=admin
ADMIN_PASSWORD=cambia-esta-clave

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=celi-vibes/productos
```

3. Iniciar:

```bash
npm start
```

## Scripts

- `npm run dev`: servidor con watch
- `npm start`: servidor normal
- `npm run check`: validacion de sintaxis

## Endpoints clave

- `GET /api/health`
- `GET /api/store/bootstrap`
- `POST /api/store/orders`
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/bootstrap`
- `PUT /api/admin/store`
- `GET /api/admin/export`
- `POST /api/admin/import`
- `POST /api/admin/reset`
- `POST /api/admin/credentials`
- `GET /api/uploads/product-image/signature`

## Flujo admin

- El primer login usa `ADMIN_USERNAME` y `ADMIN_PASSWORD` del `.env` solo si `data/store.json` todavia no existe.
- Despues, las credenciales reales quedan persistidas en `data/store.json`.
- Si cambias usuario o clave desde el panel, la sesion anterior se renueva automaticamente.

## Hosting

Sirve en hosting Node tradicional. No es para hosting estatico puro porque necesita backend para:

- login admin
- persistencia de productos, contenido y pedidos
- firma de uploads a Cloudinary

Si tu proveedor usa filesystem efimero, monta un volumen persistente para `data/store.json`.

## Fly.io

Quedo preparado para Fly.io con:

- `Dockerfile`
- `fly.toml`
- volumen persistente en `/data`

Pasos:

1. Cambiar `app = "celi-vibes-change-me"` en `fly.toml` por un nombre unico.
2. Crear el volumen una sola vez:

```bash
fly volumes create celi_vibes_data --region gru --size 3
```

3. Cargar secretos:

```bash
fly secrets set \
  ADMIN_USERNAME=admin \
  ADMIN_PASSWORD=tu-clave-segura \
  CLOUDINARY_CLOUD_NAME=... \
  CLOUDINARY_API_KEY=... \
  CLOUDINARY_API_SECRET=... \
  CLOUDINARY_FOLDER=celi-vibes/productos
```

4. Desplegar:

```bash
fly deploy
```

5. Verificar:

```bash
fly status
fly logs
```

## Checklist antes de publicar

1. Definir `ADMIN_USERNAME` y una clave fuerte en `.env`.
2. Configurar variables de Cloudinary.
3. Levantar el proyecto y comprobar `GET /api/health`.
4. Entrar a `/admin`, cambiar la clave por una final si hace falta.
5. Crear o editar un producto desde el panel.
6. Probar una compra real desde la tienda.
7. Confirmar que el pedido aparece en admin.
8. Exportar un respaldo desde el panel.

## Nota

Si las credenciales actuales de Cloudinary ya fueron compartidas fuera de un entorno privado, rotalas antes de publicar.
