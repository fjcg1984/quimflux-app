# QUIMFLUX KPIS

Evolución de QUIMFLUX hacia inteligencia operacional de planta.

## Principio

`Datos mínimos → Historia → KPI → Desviación → Diagnóstico → Recomendación → Acción → Resultado`

## Arquitectura

- Frontend estático compatible con GitHub Pages.
- Supabase independiente: `pmfaguxrtphbbodwseps`.
- Solo claves publicables en frontend.
- Registro operativo por lote y por etapa.
- KPI de cumplimiento, rendimiento, tiempos, paradas, esperas y productividad laboral.
- Preparado para integrar posteriormente inventario, mantenimiento, calidad, costos y Excel/CSV.

## Proceso inicial modelado

1. Transferencia de materia prima
2. Verificación y carga
3. Mezcla 1
4. Mezcla 2 / adición de aceite
5. Trabajo de mesa y producto terminado

La rama `quimflux-kpis` es el desarrollo nuevo. El repositorio histórico `-quimflux-dashboard-v5` no se modifica.
