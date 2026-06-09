# 19 de Junio - Ratona 🔐
**Una caja fuerte de recuerdos para Shere**

Experiencia interactiva de cumpleaños — 10 capítulos, estilo cápsula del tiempo.

## Stack
- React 18 + Vite 5
- Tailwind CSS 3
- Framer Motion 11
- Fuentes: Playfair Display · Lora · Courier Prime

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`

## Deploy en Vercel

```bash
# Opción 1: Vercel CLI
npm i -g vercel
vercel

# Opción 2: Connect repo en vercel.com
# Build command: npm run build
# Output dir: dist
```

## Personalización

### Agregar fotos reales
Coloca tus imágenes en `public/photos/` y actualiza `src/chapters/Chapter8Photos.jsx`:
```js
// Reemplaza el emoji placeholder con:
<img src="/photos/foto1.jpg" className="w-full h-full object-cover" />
```

### Editar contenido
Todo el contenido está en `src/data/content.json`:
- Canciones, referencias Marvel, rasgos admirados
- Texto de todos los capítulos

### Cambiar colores
Variables en `src/index.css`:
```css
--gold: #c9a84c;
--gold-light: #e8c97a;
--warm-white: #f5f0e8;
```

## Estructura

```
src/
├── App.jsx                  # Orquesta todo
├── main.jsx
├── index.css                # Estilos globales + film grain
├── data/
│   └── content.json         # Contenido centralizado
├── components/
│   ├── Cover.jsx            # Pantalla inicial
│   ├── ChapterHeader.jsx    # Header reutilizable
│   └── NavProgress.jsx      # Navegación lateral
├── chapters/
│   ├── Chapter1Route.jsx    # La Ruta (bus con luces)
│   ├── Chapter2Ruler.jsx    # La Regla (escritura animada)
│   ├── Chapter3Park.jsx     # El Parque (noche + luciérnagas)
│   ├── Chapter4Marvel.jsx   # Multiverso (tarjetas interactivas)
│   ├── Chapter5Songs.jsx    # Canciones (tocadiscos)
│   ├── Chapter6Loki.jsx     # Personajes
│   ├── Chapter7Admiration.jsx # Admiración (lista elegante)
│   ├── Chapter8Photos.jsx   # Fotos (modo Stories)
│   ├── Chapter9Vault.jsx    # Caja fuerte (3D interactiva)
│   └── Chapter10Final.jsx   # Mensaje final
└── hooks/
    └── useChapterProgress.js
```
