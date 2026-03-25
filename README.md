# Renata Jewelry — GitHub Pages (estático)

## Descuento global ON / OFF

En `.env.example` tienes estas variables:

- `NEXT_PUBLIC_GLOBAL_DISCOUNT_MODE=ON`
- `NEXT_PUBLIC_GLOBAL_DISCOUNT_RATE=0.20`
- `NEXT_PUBLIC_GLOBAL_DISCOUNT_LABEL=follow+like+comenta=20%`

Si quieres apagar toda la promo, cambia `NEXT_PUBLIC_GLOBAL_DISCOUNT_MODE=OFF`.


## Imágenes de productos

Guarda las fotos en `public/products/`.

Ejemplos válidos:
- `public/products/1.jpg`
- `public/products/2.jpg`
- `public/products/3.jpg`

El nombre debe coincidir con el campo `image` de `public/data/inventory.json`.
