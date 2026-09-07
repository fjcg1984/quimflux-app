export type ProductionRun = {
  id: string;
  run_date: string;
  product_id: string | null;
  batch_code: string | null;
  planned_kg: number | null;
  produced_kg: number | null;
  rejected_kg: number;
  waste_kg: number;
  operators_total: number | null;
  shift: string | null;
  status: string;
  notes: string | null;
};

export type StageEvent = {
  id: string;
  production_run_id: string;
  stage_id: string;
  started_at: string;
  ended_at: string | null;
  operators_count: number | null;
  input_kg: number | null;
  output_kg: number | null;
  downtime_minutes: number;
  waiting_minutes: number;
  notes: string | null;
};

export type KpiProduction = {
  production_run_id: string;
  run_date: string;
  planned_kg: number | null;
  produced_kg: number | null;
  rejected_kg: number;
  waste_kg: number;
  compliance_pct: number | null;
  yield_pct: number | null;
  elapsed_minutes: number;
  downtime_minutes: number;
  waiting_minutes: number;
  labor_hours: number;
  kg_per_labor_hour: number | null;
};
