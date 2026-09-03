# QUIMFLUX APP

Plataforma de gestión integral de planta QUIMFLUX.

## Arquitectura inicial

- Frontend estático compatible con GitHub Pages.
- Supabase independiente para autenticación y datos.
- Sin dependencia ni sincronización con Excel.
- Módulos: Dashboard, Inventario, Producción, Costos, Mantenimiento, Contabilidad y KPI/Reportes.
- Consumo eléctrico deliberadamente fuera del módulo Costos en esta etapa.

## Supabase

Proyecto: `lpflmcwwkazdifxqgvbz`

Solo se utiliza una clave publicable en el frontend. Nunca colocar claves `service_role` o secretas en el repositorio.

## Estado

MVP visual inicial: login, navegación lateral, dashboard ejecutivo y vistas base de módulos.