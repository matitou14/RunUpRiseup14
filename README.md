# Matias Training 2026

App de entrenamiento personal — CADS + Grantham — Backyard Ultra & 10K Sub-40.

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Recharts / Lucide React

## Deploy en Vercel

1. Subir el proyecto a un repo en GitHub
2. Importar en vercel.com → "Import Project"
3. Framework: Next.js (se detecta automático)
4. Deploy

## Editar el plan

Para actualizar sesiones, bloques o nutricion:
- `lib/training-data.ts` → Bloques, microciclos, zonas FC
- `lib/nutrition-data.ts` → Nutricion por tipo de dia

Despues de editar, hacer commit → Vercel redeploy automático.
