import type { KpiProduction } from './schema';

export function statusFrom(value: number | null, good: number, warning: number, inverse = false) {
  if (value === null || Number.isNaN(value)) return 'neutral';
  if (inverse) return value <= good ? 'good' : value <= warning ? 'warning' : 'critical';
  return value >= good ? 'good' : value >= warning ? 'warning' : 'critical';
}

export function summarizeProduction(rows: KpiProduction[]) {
  const valid = rows.filter(Boolean);
  const planned = valid.reduce((s, r) => s + (r.planned_kg ?? 0), 0);
  const produced = valid.reduce((s, r) => s + (r.produced_kg ?? 0), 0);
  const rejected = valid.reduce((s, r) => s + (r.rejected_kg ?? 0), 0);
  const waste = valid.reduce((s, r) => s + (r.waste_kg ?? 0), 0);
  const labor = valid.reduce((s, r) => s + (r.labor_hours ?? 0), 0);
  const downtime = valid.reduce((s, r) => s + (r.downtime_minutes ?? 0), 0);
  const waiting = valid.reduce((s, r) => s + (r.waiting_minutes ?? 0), 0);

  const compliance = planned > 0 ? (produced / planned) * 100 : null;
  const yieldPct = produced > 0 ? ((produced - rejected - waste) / produced) * 100 : null;
  const kgPerLaborHour = labor > 0 ? produced / labor : null;

  return {
    batches: valid.length,
    planned,
    produced,
    rejected,
    waste,
    compliance,
    yieldPct,
    laborHours: labor,
    kgPerLaborHour,
    downtime,
    waiting,
  };
}

export function recommendations(s: ReturnType<typeof summarizeProduction>) {
  const result: { priority: string; title: string; text: string }[] = [];
  if (s.compliance !== null && s.compliance < 90)
    result.push({ priority: 'high', title: 'Bajo cumplimiento', text: 'Revisar plan vs. producción y localizar la etapa que está limitando el flujo.' });
  if (s.yieldPct !== null && s.yieldPct < 97)
    result.push({ priority: 'high', title: 'Pérdida de rendimiento', text: 'Separar rechazo y merma por etapa y registrar causa antes de buscar mejoras.' });
  if (s.downtime > 30)
    result.push({ priority: 'high', title: 'Paradas relevantes', text: 'Analizar tiempo de parada por etapa y convertir las causas repetitivas en acciones de mantenimiento.' });
  if (s.waiting > 30)
    result.push({ priority: 'medium', title: 'Tiempo de espera', text: 'Revisar transferencia entre etapas, disponibilidad de materiales y reasignación de personal.' });
  if (s.kgPerLaborHour !== null && s.kgPerLaborHour > 0)
    result.push({ priority: 'info', title: 'Productividad laboral', text: `Productividad actual: ${s.kgPerLaborHour.toFixed(1)} kg/h-hombre. Usar como línea base para comparar turnos y etapas.` });
  return result;
}
