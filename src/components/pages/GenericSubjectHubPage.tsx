import { useState } from 'react';
import { BookOpen, Compass, ChartNoAxesCombined, Clock3 } from 'lucide-react';
import { ProgramInfo } from '../../types';
import { AppRoute } from '../../services/navigation';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { ContextControls, hubPanel, hubButton } from './FrameworkHubPage';

export function GenericSubjectHubPage({ program, route, onNavigate }: {
  program: ProgramInfo; route: AppRoute; onNavigate: (route: AppRoute) => void;
}) {
  const [tab, setTab] = useState('Práctica y simulación');
  const subject = program.subjects.find(s => s.id === route.subjectId)!;
  const module = program.subprograms?.find(m => typeof m !== 'string' && m.id === route.moduleId);
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
    <Breadcrumbs items={[{ label: 'Inicio', onClick: () => onNavigate({ view: 'landing' }) },
      { label: 'Programas', onClick: () => onNavigate({ view: 'welcome' }) },
      { label: program.name, onClick: () => onNavigate({ ...route, view: 'framework', subjectId: undefined }) },
      { label: subject.name }]} />
    <section className="page-intro rounded-3xl p-6 sm:p-8 space-y-5">
      <p className="text-xs font-bold uppercase text-indigo-600 dark:text-indigo-400">Vista previa del hub de asignatura</p>
      <h1 className="text-3xl font-semibold">{subject.name} · {program.name}</h1>
      {module && typeof module !== 'string' && <p className="font-bold">{module.name}</p>}
      <ContextControls program={program} route={route} onChange={onNavigate} />
      {subject.id === 'matematicas' && <p className="font-bold text-sm">{program.calculatorAllowed ? 'Calculadora permitida' : 'Calculadora prohibida'}</p>}
      <p className="text-sm text-stone-600 dark:text-slate-400">{subject.description}</p>
    </section>
    <div role="tablist" aria-label="Secciones de la asignatura" className="flex flex-wrap gap-2">
      {['Práctica y simulación', 'Recursos', 'Progreso'].map((label, index) => <button key={label} role="tab" aria-selected={tab === label}
        aria-controls="subject-panel" id={`subject-tab-${index}`} onClick={() => setTab(label)}
        className={tab === label ? hubButton : 'px-4 py-3 rounded-xl hover:bg-stone-200/60 dark:hover:bg-slate-800 font-medium text-sm cursor-pointer transition'}>{label}</button>)}
    </div>
    <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-8 items-start">
    <section id="subject-panel" role="tabpanel" aria-labelledby={`subject-tab-${['Práctica y simulación', 'Recursos', 'Progreso'].indexOf(tab)}`} className={`${hubPanel} sm:p-9 space-y-5`}>
      <div className="ui-empty-art inline-flex rounded-2xl p-5" aria-hidden="true">
        {tab === 'Progreso' ? <ChartNoAxesCombined size={36} strokeWidth={1.4} /> : <BookOpen size={36} strokeWidth={1.4} />}
      </div>
      <p className="text-xs font-medium text-stone-500 dark:text-slate-400 flex items-center gap-2"><Clock3 size={14} aria-hidden="true" /> {tab === 'Progreso' ? 'Cada intento será un nuevo paso' : 'Estamos preparando este espacio'}</p>
      <h2 className="text-xl font-semibold">{tab === 'Práctica y simulación' ? 'Banco de preguntas en preparación' : tab === 'Recursos' ? 'Recursos en preparación' : 'Aún no hay intentos en esta asignatura'}</h2>
      <p className="text-sm text-stone-600 dark:text-slate-400 leading-relaxed max-w-xl">{tab === 'Práctica y simulación' ? 'Las prácticas y simulaciones se habilitarán cuando se publique el contenido de esta ruta. Mientras tanto, puedes explorar las asignaturas o practicar con Matemáticas BXM.'
        : tab === 'Recursos' ? 'Aquí encontrarás el temario y los materiales de apoyo específicos de esta asignatura y nivel.'
        : 'El rendimiento y el historial se mostrarán aquí cuando haya prácticas disponibles.'}</p>
      {tab === 'Práctica y simulación' && <div className="flex flex-wrap gap-3">
        <button disabled className="px-4 py-3 rounded-xl bg-stone-200 dark:bg-slate-800 text-stone-500">Iniciar práctica · Próximamente</button>
        <button disabled className="px-4 py-3 rounded-xl bg-stone-200 dark:bg-slate-800 text-stone-500">Iniciar simulación · Próximamente</button>
      </div>}
    </section>
    <aside aria-label="Tu ruta de estudio" className="px-2 py-4 space-y-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold"><Compass size={18} className="text-indigo-500" aria-hidden="true" /> Tu ruta de estudio</h2>
      <ol className="space-y-5 text-sm">
        {[['Programa', program.name], ...(module && typeof module !== 'string' ? [['Nivel o parte', module.name]] : []), ['Asignatura', subject.name], ['Convocatoria', route.convocatoriaId === '2026-c1' ? '01-2026' : '02-2026']].map(([label, value], index) =>
          <li key={label} className="flex gap-3 items-start"><span className="text-xs text-stone-400 dark:text-slate-500 pt-1">0{index + 1}</span><div><p className="text-xs text-stone-500 dark:text-slate-400 mb-1">{label}</p><p className="font-medium">{value}</p></div></li>)}
      </ol>
      <p className="text-xs text-stone-500 dark:text-slate-400 leading-relaxed">Puedes cambiar de programa o nivel en cualquier momento desde los controles superiores.</p>
    </aside>
    </div>
    <div className="flex flex-wrap gap-3">
      <button className="ui-muted-button px-4 py-3 rounded-xl font-medium text-sm cursor-pointer" onClick={() => onNavigate({ ...route, view: 'framework', subjectId: undefined })}>Ver asignaturas del programa</button>
      <button className={hubButton} onClick={() => onNavigate({ view: 'hub', programId: 'bxm', subjectId: 'matematicas', convocatoriaId: '2026-c2' })}>Practicar Matemáticas BXM</button>
    </div>
  </div>;
}
