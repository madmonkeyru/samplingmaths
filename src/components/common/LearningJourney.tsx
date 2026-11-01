import { Compass, BookOpen, ChartNoAxesCombined } from 'lucide-react';

export function LearningJourney() {
  const steps = [
    { icon: Compass, title: 'Encuentra tu programa', text: 'Elige tu ruta y el nivel que quieres preparar.' },
    { icon: BookOpen, title: 'Practica a tu ritmo', text: 'Refuerza un tema o completa una simulación.' },
    { icon: ChartNoAxesCombined, title: 'Aprende de cada intento', text: 'Revisa las soluciones y observa tu avance.' },
  ];
  return <section aria-label="Cómo empezar" className="pt-4 space-y-6">
    <h2 className="text-sm font-semibold text-stone-500 dark:text-slate-400">Un paso más cerca de tu meta</h2>
    <ol className="grid sm:grid-cols-3 gap-7 sm:gap-9">
      {steps.map(({ icon: Icon, title, text }, index) => <li key={title} className="flex items-start gap-3">
        <Icon size={22} className="text-stone-400 dark:text-slate-500 shrink-0 mt-1" aria-hidden="true" />
        <div className="space-y-1.5">
          <p className="text-[11px] text-stone-400 dark:text-slate-500 font-medium">0{index + 1}</p>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-sm text-stone-600 dark:text-slate-400 leading-relaxed">{text}</p>
        </div>
      </li>)}
    </ol>
  </section>;
}
