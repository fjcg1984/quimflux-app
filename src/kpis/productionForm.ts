import { createProductionRun, createStageEvent, getStages } from './repository';

export async function renderProductionForm(root: HTMLElement, onSaved: () => void) {
  root.innerHTML = `<div class="qf-page-head"><div><span class="qf-eyebrow">OPERACIÓN</span><h2>Registro de producción</h2><p>Captura solo los datos necesarios para construir el historial operativo.</p></div></div>
  <form id="qfProductionForm" class="qf-form">
    <div class="qf-section"><h3>1. Lote</h3><div class="qf-grid"><label>Fecha<input name="run_date" type="date" required value="${new Date().toISOString().slice(0,10)}"></label><label>Código de lote<input name="batch_code" required placeholder="Ej. L-2026-001"></label><label>Producto ID <small>(UUID, opcional)</small><input name="product_id" placeholder="Se puede completar después"></label><label>Turno<select name="shift"><option>Mañana</option><option>Tarde</option><option>Noche</option></select></label><label>Plan (kg)<input name="planned_kg" type="number" min="0" step="0.01"></label><label>Producido (kg)<input name="produced_kg" type="number" min="0" step="0.01"></label><label>Rechazo (kg)<input name="rejected_kg" type="number" min="0" step="0.01" value="0"></label><label>Merma (kg)<input name="waste_kg" type="number" min="0" step="0.01" value="0"></label><label>Operadores totales<input name="operators_total" type="number" min="0" step="1"></label></div></div>
    <div class="qf-section"><h3>2. Etapas</h3><p class="qf-help">Registra inicio/fin y personas por etapa. Los tiempos de espera y parada alimentan el análisis de flujo.</p><div id="qfStages"><div class="qf-help">Cargando etapas...</div></div></div>
    <label>Observaciones<textarea name="notes" placeholder="Incidencias, esperas o causas relevantes..."></textarea></label>
    <div id="qfFormError" class="qf-error"></div><button class="qf-primary" type="submit">GUARDAR LOTE Y CALCULAR KPI</button>
  </form>`;

  const stagesRoot = root.querySelector('#qfStages')!;
  let stages: Array<{id:string;code:string;name:string;sequence_no:number}> = [];
  try {
    stages = await getStages() as typeof stages;
    stagesRoot.innerHTML = stages.map((stage,i)=>`<div class="qf-stage"><strong>${i+1}. ${stage.name}</strong><div class="qf-grid"><label>Inicio<input data-stage="${stage.id}" data-field="start" type="datetime-local"></label><label>Fin<input data-stage="${stage.id}" data-field="end" type="datetime-local"></label><label>Personas<input data-stage="${stage.id}" data-field="operators" type="number" min="0" step="1"></label><label>Parada (min)<input data-stage="${stage.id}" data-field="downtime" type="number" min="0" value="0"></label><label>Espera (min)<input data-stage="${stage.id}" data-field="waiting" type="number" min="0" value="0"></label></div></div>`).join('');
  } catch (ex) {
    stagesRoot.innerHTML = `<div class="qf-error">No se pudieron cargar las etapas: ${ex instanceof Error ? ex.message : 'error de conexión'}</div>`;
  }

  root.querySelector('#qfProductionForm')!.addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const err = root.querySelector('#qfFormError')!;
    err.textContent = 'Guardando...';
    try {
      const productRaw = String(data.get('product_id') || '').trim();
      const run = await createProductionRun({
        run_date: String(data.get('run_date')),
        product_id: productRaw || null,
        batch_code: String(data.get('batch_code') || '').trim() || null,
        planned_kg: Number(data.get('planned_kg')) || null,
        produced_kg: Number(data.get('produced_kg')) || null,
        rejected_kg: Number(data.get('rejected_kg')) || 0,
        waste_kg: Number(data.get('waste_kg')) || 0,
        operators_total: Number(data.get('operators_total')) || null,
        shift: String(data.get('shift')),
        status: 'completed',
        notes: String(data.get('notes') || '').trim() || null
      });

      for (const stage of stages) {
        const get = (field:string) => root.querySelector(`[data-stage="${stage.id}"][data-field="${field}"]`) as HTMLInputElement;
        const start = get('start').value;
        if (!start) continue;
        await createStageEvent({
          production_run_id: run.id,
          stage_id: stage.id,
          started_at: new Date(start).toISOString(),
          ended_at: get('end').value ? new Date(get('end').value).toISOString() : null,
          operators_count: Number(get('operators').value) || null,
          input_kg: null,
          output_kg: null,
          downtime_minutes: Number(get('downtime').value) || 0,
          waiting_minutes: Number(get('waiting').value) || 0,
          notes: null
        });
      }
      err.textContent = 'Lote guardado correctamente y KPI actualizado.';
      onSaved();
    } catch (ex) {
      err.textContent = ex instanceof Error ? ex.message : 'No se pudo guardar el lote.';
    }
  });
}
