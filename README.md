# Renata Jewelry — GitHub Pages (estático)

Esta versión publica tu tienda en **GitHub Pages** (sin Vercel).

## Publicar
1) GitHub → Settings → Pages → Source: **GitHub Actions**
2) Actions → ejecuta **Deploy to GitHub Pages (Next export)**

## Inventario
- Edita `data/inventory.xlsx`
- Ejecuta `npm run inventory:build`
- Se genera `public/data/inventory.json`

## Portada
La imagen principal es `public/hero.jpg`


✅ Incluye package-lock.json para que GitHub Actions funcione sin errores.
