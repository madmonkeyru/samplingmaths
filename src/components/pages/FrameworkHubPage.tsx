import { BookOpen, ArrowRight } from 'lucide-react';
import { ProgramInfo } from '../../types';
import { AppRoute } from '../../services/navigation';
import { Breadcrumbs } from '../common/Breadcrumbs';

export const hubPanel = 'ui-surface rounded-2xl p-5 sm:p-6 space-y-4';
export const hubButton = 'px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm cursor-pointer';

export function ContextControls({ program, route, onChange }: {
  program: ProgramInfo; route: AppRoute; onChange: (route: AppRoute) => void;
}) {
  const modules = (program.subprograms || []).filter(m => typeof m !== 'string');
  const selectClass = 'ui-select block mt-1 w-full rounded-lg bg-stone-100 dark:bg-slate-800 p-2.5 text-sm';
  return <div className="flex flex-wrap items-end gap-4 text-sm">
    {modules.length > 0 && <label className="font-bold">Nivel o parte
      <select className={selectClass} value={route.moduleId} onChange={e => onChange({ ...route, moduleId: e.target.value })}>
        {modules.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
    </label>}
    <label className="font-bold">Convocatoria de referencia
      <select className={selectClass} value={route.convocatoriaId} onChange={e => onChange({ ...route, convocatoriaId: e.target.value })}>
        <option value="2026-c1">01-2026</option><option value="2026-c2">02-2026</option>
      </select>
    </label>
    <span className="pb-3 text-sm">Nota mínima: <strong>{program.passingScore}</strong></span>
    <span className="pb-3 text-xs text-stone-500 dark:text-slate-400">Referencia curricular; sin inscripción al MEP.</span>
  </div>;
}

export function FrameworkHubPage({ program, route, onNavigate }: {
  program: ProgramInfo; route: AppRoute; onNavigate: (route: AppRoute) => void;
}) {
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
    <Breadcrumbs items={[{ label: 'Inicio', onClick: () => onNavigate({ view: 'landing' }) },
      { label: 'Programas', onClick: () => onNavigate({ view: 'welcome' }) }, { label: program.name }]} />
    <section className="page-intro rounded-3xl p-6 sm:p-8 space-y-5">
      <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Hub del programa</p>
      <h1 className="text-2xl sm:text-3xl font-semibold">{program.name}</h1>
      <p>{program.description}</p>
      <ContextControls program={program} route={route} onChange={onNavigate} />
      <p className="text-sm text-stone-600 dark:text-slate-400">{program.id === 'edad'
        ? 'Cada asignatura se evalúa en dos partes. Aprobar la Parte 1 es requisito para inscribir la Parte 2.'
        : program.id === 'iii_ciclo' ? 'Explora las seis asignaturas para cada nivel: 7°, 8° y 9° año.'
        : program.id === 'cico' ? 'Cinco pruebas por suficiencia para completar la primaria. Matemáticas se evalúa sin calculadora.'
        : 'Una prueba por asignatura. En Ciencias, elige Biología, Física o Química; en Idioma, elige tu opción.'}</p>
    </section>
    <section aria-label="Asignaturas del programa" className="space-y-4">
      <h2 className="text-xl font-semibold">Elige una asignatura</h2>
      <p className="text-sm text-stone-600 dark:text-slate-400">Matemáticas BXM tiene prácticas disponibles en 02-2026. Las demás rutas permiten explorar su estructura.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {program.subjects.map(subject => <button key={subject.id} className={`${hubPanel} subject-card text-left cursor-pointer ui-lift`}
          onClick={() => onNavigate({ ...route, view: 'hub', subjectId: subject.id })}>
          <span className="subject-icon"><BookOpen size={21} aria-hidden="true" /></span>
          <h3 className="text-lg font-semibold">{subject.name}</h3>
          <p className="text-sm text-stone-600 dark:text-slate-400">{subject.description}</p>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            {program.id === 'bxm' && subject.id === 'matematicas' && route.convocatoriaId === '2026-c2' ? 'Práctica disponible' : 'Vista previa · contenido en preparación'} <ArrowRight size={16} />
          </span>
        </button>)}
      </div>
    </section>
  </div>;
}
