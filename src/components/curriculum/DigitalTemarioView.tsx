import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronRight, Lock, Play, BookCheck } from 'lucide-react';
import { TextRenderer } from '../common/TextRenderer';
import { PaywallModal } from '../common/PaywallModal';
import { accessService } from '../../services/accessService';
import { AccessBadge } from '../common/AccessBadge';
import type { PracticeConfig } from '../../types';

interface TemarioLesson {
  id: string;
  evidenceCode: string;
  title: string;
  area: 'geometry' | 'functions' | 'statistics';
  areaLabel: string;
  points: number;
  preview: boolean; // available on free tier as a preview
  objective: string;
  theory: string;
  formulaLatex?: string;
  workedExample: {
    statement: string;
    steps: string[];
    resultLatex: string;
  };
  quizConfig: {
    itemIds: number[];
    title: string;
  };
}

const TEMARIO_LESSONS: TemarioLesson[] = [
  // Geometría
  {
    id: 'geo-circunferencia',
    evidenceCode: 'A1.2',
    title: 'Ecuación de la Circunferencia',
    area: 'geometry',
    areaLabel: 'Geometría',
    points: 3,
    preview: true,
    objective: 'Determinar y aplicar la ecuación canónica $(x-h)^2 + (y-k)^2 = r^2$ dados el centro $(h,k)$ y el radio $r$.',
    theory: 'Una circunferencia es el lugar geométrico de todos los puntos en el plano cartesiano que equidistan a una distancia fija $r$ de un punto central $C(h,k)$. Al aplicar el teorema de Pitágoras entre el centro y cualquier punto $(x,y)$, se deduce su ecuación canónica.',
    formulaLatex: String.raw`(x - h)^2 + (y - k)^2 = r^2`,
    workedExample: {
      statement: 'Determina la ecuación de la circunferencia con centro en $C(-3, 2)$ y radio $r = 4$.',
      steps: [
        'Identificar las coordenadas del centro: $h = -3$, $k = 2$.',
        'Identificar el radio: $r = 4$, por lo que $r^2 = 4^2 = 16$.',
        'Sustituir los valores en la forma canónica: $(x - (-3))^2 + (y - 2)^2 = 16$.',
        'Simplificar los signos de resta con negativo: $(x + 3)^2 + (y - 2)^2 = 16$.',
      ],
      resultLatex: String.raw`(x + 3)^2 + (y - 2)^2 = 16`,
    },
    quizConfig: {
      itemIds: [1],
      title: 'Comprobación: Ecuación de la Circunferencia',
    },
  },
  {
    id: 'geo-posicion-relativa',
    evidenceCode: 'A2.1',
    title: 'Rectas Secantes, Tangentes y Exteriores',
    area: 'geometry',
    areaLabel: 'Geometría',
    points: 4,
    preview: false,
    objective: 'Determinar la posición relativa de una recta respecto a una circunferencia usando distancia o discriminante algebraico.',
    theory: 'La relación posicional entre una recta $y = mx + b$ y una circunferencia depende de la cantidad de puntos de intersección: dos puntos (secante, $\\Delta > 0$), un punto de tangencia (tangente, $\\Delta = 0$), o ningún punto común (exterior, $\\Delta < 0$).',
    formulaLatex: String.raw`\Delta = b^2 - 4ac \quad \begin{cases} > 0 & \text{Secante (2 puntos)} \\ = 0 & \text{Tangente (1 punto)} \\ < 0 & \text{Exterior (0 puntos)} \end{cases}`,
    workedExample: {
      statement: 'Clasifica la recta $y = 2$ con respecto a la circunferencia $(x-1)^2 + y^2 = 4$.',
      steps: [
        'Sustituir $y = 2$ en la ecuación: $(x-1)^2 + 2^2 = 4$.',
        'Desarrollar y simplificar: $(x-1)^2 + 4 = 4 \\implies (x-1)^2 = 0$.',
        'Dado que $(x-1)^2 = 0$, la única solución real es $x = 1$.',
        'Al tener exactamente un punto de intersección $(1, 2)$, la recta es Tangente.',
      ],
      resultLatex: String.raw`\text{Recta Tangente en } (1, 2)`,
    },
    quizConfig: {
      itemIds: [3],
      title: 'Comprobación: Posición Relativa de Rectas',
    },
  },

  // Relaciones y Álgebra
  {
    id: 'alg-funcion-inversa',
    evidenceCode: 'A4.1',
    title: 'Función Inversa y Criterio Algebraico',
    area: 'functions',
    areaLabel: 'Relaciones y Álgebra',
    points: 4,
    preview: true,
    objective: 'Hallar analíticamente el criterio de la función inversa $f^{-1}(x)$ para funciones lineales y afines biyectivas.',
    theory: 'Para que una función posea función inversa $f^{-1}$, debe ser biyectiva (inyectiva y sobreyectiva). La gráfica de $f^{-1}$ es el reflejo simétrico de la gráfica de $f$ respecto a la recta identidad $y = x$.',
    formulaLatex: String.raw`f(x) = y \iff f^{-1}(y) = x`,
    workedExample: {
      statement: 'Sea la función lineal $f(x) = 3x - 5$. Halla el criterio de su función inversa $f^{-1}(x)$.',
      steps: [
        'Escribir la función igualada a $y$: $y = 3x - 5$.',
        'Despejar la variable independiente $x$: $y + 5 = 3x \\implies x = \\frac{y + 5}{3}$.',
        'Intercambiar las variables para expresar la regla en términos de $x$: $f^{-1}(x) = \\frac{x + 5}{3}$.',
      ],
      resultLatex: String.raw`f^{-1}(x) = \frac{x + 5}{3}`,
    },
    quizConfig: {
      itemIds: [24],
      title: 'Comprobación: Criterio de Función Inversa',
    },
  },
  {
    id: 'alg-exponencial-logaritmica',
    evidenceCode: 'A5.2',
    title: 'Ecuaciones Exponenciales y Logarítmicas',
    area: 'functions',
    areaLabel: 'Relaciones y Álgebra',
    points: 4,
    preview: false,
    objective: 'Resolver ecuaciones exponenciales y logarítmicas utilizando propiedades de bases idénticas y cambio de base.',
    theory: 'Las funciones exponencial $a^x$ y logarítmica $\\log_a(x)$ son inversas mutuas para $a > 0, a \\neq 1$. Para resolver $a^{f(x)} = a^{g(x)}$, por inyectividad se igualan los exponentes $f(x) = g(x)$.',
    formulaLatex: String.raw`a^y = x \iff y = \log_a(x) \quad (a > 0, a \neq 1)`,
    workedExample: {
      statement: 'Resuelve la ecuación exponencial $2^{3x - 1} = 32$.',
      steps: [
        'Expresar el lado derecho con base 2: $32 = 2^5$.',
        'Reescribir la igualdad: $2^{3x - 1} = 2^5$.',
        'Por inyectividad de bases iguales: $3x - 1 = 5$.',
        'Despejar $x$: $3x = 6 \\implies x = 2$.',
      ],
      resultLatex: String.raw`x = 2`,
    },
    quizConfig: {
      itemIds: [35],
      title: 'Comprobación: Ecuaciones Exponenciales',
    },
  },

  // Estadística y Probabilidad
  {
    id: 'est-medidas-posicion',
    evidenceCode: 'A8.1',
    title: 'Medidas de Posición y Diagramas de Cajas',
    area: 'statistics',
    areaLabel: 'Estadística y Probabilidad',
    points: 3,
    preview: false,
    objective: 'Interpretar resúmenes de cinco números: Mínimo, Cuartil 1 ($Q_1$), Mediana ($M_e$), Cuartil 3 ($Q_3$) y Máximo.',
    theory: 'El diagrama de cajas (Box Plot) sintetiza la distribución y simetría de datos. Cada cuartil agrupa el 25% de las observaciones. El recorrido intercuartílico es $RIC = Q_3 - Q_1$.',
    formulaLatex: String.raw`RIC = Q_3 - Q_1, \quad \text{Rango} = \text{Máx} - \text{Mín}`,
    workedExample: {
      statement: 'Un conjunto de notas presenta $Q_1 = 65$, $M_e = 78$, $Q_3 = 88$. ¿Qué porcentaje de estudiantes obtuvo una nota entre 65 y 88?',
      steps: [
        'Identificar que el intervalo $[Q_1, Q_3]$ comprende desde el percentil 25 hasta el percentil 75.',
        'Calcular la diferencia porcentual: $75% - 25% = 50%$.',
        'El recorrido intercuartílico siempre agrupa exactamente el 50% central de la distribución.',
      ],
      resultLatex: String.raw`50\% \text{ de los estudiantes}`,
    },
    quizConfig: {
      itemIds: [49],
      title: 'Comprobación: Diagrama de Cajas y Cuartiles',
    },
  },
];

export const DigitalTemarioView: React.FC<{
  onStartQuiz: (config: PracticeConfig) => void;
}> = ({ onStartQuiz }) => {
  const [selectedArea, setSelectedArea] = useState<'all' | 'geometry' | 'functions' | 'statistics'>('all');
  const [expandedLessonId, setExpandedLessonId] = useState<string>(TEMARIO_LESSONS[0].id);
  const [, setTier] = useState(accessService.getTier());
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallLessonTitle, setPaywallLessonTitle] = useState('');

  useEffect(() => {
    return accessService.subscribe(newTier => setTier(newTier));
  }, []);

  const filteredLessons = selectedArea === 'all'
    ? TEMARIO_LESSONS
    : TEMARIO_LESSONS.filter(l => l.area === selectedArea);

  const handleOpenQuiz = (lesson: TemarioLesson) => {
    if (!accessService.canAccessLesson(lesson.preview)) {
      setPaywallLessonTitle(`Lección: ${lesson.title}`);
      setPaywallOpen(true);
      return;
    }

    onStartQuiz({
      mode: 'area',
      title: lesson.quizConfig.title,
      itemIds: lesson.quizConfig.itemIds,
      itemCount: lesson.quizConfig.itemIds.length,
      enableTimer: false,
      timerDurationMinutes: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <BookOpen className="size-3.5" />
              <span>Temario Digital Interactivo · BXM Matemáticas</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Lecciones Teóricas con Ejemplos y Comprobaciones
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
              Lee explicaciones paso a paso de los conceptos evaluados por el MEP y valida tu comprensión con micro-quizzes.
            </p>
          </div>

          {/* Area Filter Buttons */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'geometry', label: 'Geometría' },
              { id: 'functions', label: 'Álgebra' },
              { id: 'statistics', label: 'Estadística' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedArea(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedArea === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lessons Accordion Stack */}
      <div className="space-y-4">
        {filteredLessons.map(lesson => {
          const isExpanded = expandedLessonId === lesson.id;
          const isLocked = !accessService.canAccessLesson(lesson.preview);

          return (
            <article
              key={lesson.id}
              className={`rounded-2xl border transition-all overflow-hidden bg-white dark:bg-stone-900 ${
                isExpanded
                  ? 'border-indigo-300 dark:border-indigo-800 shadow-md ring-1 ring-indigo-500/10'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
              }`}
            >
              {/* Accordion trigger header */}
              <button
                type="button"
                onClick={() => setExpandedLessonId(isExpanded ? '' : lesson.id)}
                aria-expanded={isExpanded}
                className="w-full flex items-center justify-between p-5 text-left transition hover:bg-stone-50/60 dark:hover:bg-stone-800/40"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                      lesson.preview
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    <BookOpen size={18} aria-hidden="true" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                        {lesson.title}
                      </h3>
                      {lesson.preview ? (
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
                          Acceso Libre
                        </span>
                      ) : (
                        <AccessBadge capability="full_authored_lesson_pack" />
                      )}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      {lesson.areaLabel} · {lesson.points} puntos en prueba oficial MEP
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-stone-400">
                  {isLocked && <Lock className="size-4 text-amber-500" />}
                  {isExpanded ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
                </div>
              </button>

              {/* Lesson detailed content */}
              {isExpanded && (
                <div className="border-t border-stone-100 dark:border-stone-800/80 p-5 sm:p-6 bg-stone-50/40 dark:bg-stone-950/20 space-y-5">
                  {/* Objective */}
                  <div className="rounded-xl border border-stone-200/80 bg-white dark:bg-stone-900 p-4 shadow-2xs space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Qué aprenderás
                    </span>
                    <p className="text-sm text-stone-800 dark:text-stone-200 font-medium">
                      {lesson.objective}
                    </p>
                  </div>

                  {/* Theoretical Concept */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <BookCheck className="size-4 text-indigo-600 dark:text-indigo-400" />
                      <span>Explicación Teórica</span>
                    </h4>
                    <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {lesson.theory}
                    </p>
                    {lesson.formulaLatex && (
                      <div className="p-3.5 my-2 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex justify-center shadow-2xs">
                        <TextRenderer content={`$$${lesson.formulaLatex}$$`} />
                      </div>
                    )}
                  </div>

                  {/* Worked Example */}
                  <div className="space-y-3 rounded-2xl border border-stone-200 bg-white dark:bg-stone-900 p-5 shadow-2xs">
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                      <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Ejemplo Paso a Paso</span>
                    </h4>
                    <div className="text-sm text-stone-800 dark:text-stone-200 italic bg-stone-50 dark:bg-stone-800/50 p-3 rounded-xl border border-stone-200/60 dark:border-stone-700/60">
                      <TextRenderer content={lesson.workedExample.statement} />
                    </div>
                    <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
                      {lesson.workedExample.steps.map((st, i) => (
                        <li key={i}>
                          <TextRenderer content={st} />
                        </li>
                      ))}
                    </ol>
                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      <span>Resultado final:</span>
                      <TextRenderer content={`$${lesson.workedExample.resultLatex}$`} />
                    </div>
                  </div>

                  {/* Action Bar / Checkpoint Micro-Quiz */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xs text-stone-500 dark:text-stone-400">
                      Valida tu entendimiento con preguntas oficiales de esta evidencia.
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenQuiz(lesson)}
                      className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-xs ${
                        isLocked
                          ? 'bg-amber-600 hover:bg-amber-500 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="size-3.5" />
                          <span>Desbloquear Quiz con Plan Pro</span>
                        </>
                      ) : (
                        <>
                          <Play className="size-3.5 fill-current" />
                          <span>Iniciar Micro-Quiz de Comprobación</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        featureTitle={paywallLessonTitle || 'Temario Digital Pro'}
        featureDescription="Accede a lecciones avanzadas, explicaciones teóricas ampliadas y quizzes de comprobación ilimitados."
      />
    </div>
  );
};
