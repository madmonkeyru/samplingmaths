import { dataService } from './dataService';

export interface AppRoute {
  view: 'landing' | 'welcome' | 'framework' | 'hub';
  programId?: string;
  subjectId?: string;
  moduleId?: string;
  convocatoriaId?: string;
}

export function readRoute(hash: string): AppRoute {
  const [path, query] = hash.replace(/^#/, '').split('?');
  if (!path || path === '/') return { view: 'landing' };
  if (path === '/programas') return { view: 'welcome' };
  const parts = path.split('/').filter(Boolean);
  const program = dataService.getPrograms().find(p => p.id === parts[1]);
  if (parts[0] !== 'programas' || !program || parts.length > 3) return { view: 'welcome' };
  const params = new URLSearchParams(query);
  const modules = (program.subprograms || []).filter(m => typeof m !== 'string');
  const moduleId = modules.find(m => m.id === params.get('nivel'))?.id || modules[0]?.id;
  const convocatoriaId = params.get('convocatoria') === '2026-c1' ? '2026-c1' : '2026-c2';
  const subject = program.subjects.find(s => s.id === parts[2]);
  return { view: subject ? 'hub' : 'framework', programId: program.id,
    subjectId: subject?.id, moduleId, convocatoriaId };
}

export function routeHash(route: AppRoute): string {
  if (route.view === 'landing') return '#/';
  if (route.view === 'welcome') return '#/programas';
  const params = new URLSearchParams();
  if (route.moduleId) params.set('nivel', route.moduleId);
  params.set('convocatoria', route.convocatoriaId || '2026-c2');
  return `#/programas/${route.programId}${route.view === 'hub' ? `/${route.subjectId}` : ''}?${params}`;
}
