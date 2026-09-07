import { supabase } from '../lib/supabase';
import type { KpiProduction, ProductionRun, StageEvent } from './schema';

export async function getProductionKpis(days = 30): Promise<KpiProduction[]> {
  const from = new Date();
  from.setDate(from.getDate() - days);
  const { data, error } = await supabase
    .from('qf_kpi_production')
    .select('*')
    .gte('run_date', from.toISOString().slice(0, 10))
    .order('run_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as KpiProduction[];
}

export async function createProductionRun(input: Omit<ProductionRun, 'id'>) {
  const { data, error } = await supabase.from('qf_production_runs').insert(input).select().single();
  if (error) throw error;
  return data as ProductionRun;
}

export async function createStageEvent(input: Omit<StageEvent, 'id'>) {
  const { data, error } = await supabase.from('qf_stage_events').insert(input).select().single();
  if (error) throw error;
  return data as StageEvent;
}
