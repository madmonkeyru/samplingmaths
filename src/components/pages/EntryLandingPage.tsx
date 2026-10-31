import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Layers,
  GraduationCap,
  ShieldCheck,
  FileText,
  Clock,
} from 'lucide-react';

interface EntryLandingPageProps {
  onExplorePrograms: () => void;
  onEnterBxmHub: () => void;
}

export const EntryLandingPage: React.FC<EntryLandingPageProps> = ({
  onExplorePrograms,
  onEnterBxmHub,
}) => {
  return (
    <div className="min-h-[calc(100vh-65px)] bg-[#fdfbf7] dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col justify-between">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 w-full space-y-10">
        {/* Simple Top Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-slate-800 border border-stone-300 dark:border-slate-700 text-xs font-bold text-stone-700 dark:text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Plataforma MEP-EA-01 • Versión Prototipo MVP</span>
        </div>

        {/* Core Value Statement (Simple, direct, no narrative/testimonials) */}
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
            Preparación y Práctica para los Exámenes de Educación Abierta del MEP
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl leading-relaxed">
            Plataforma modular con simulaciones oficiales y banco de reactivos alineados a los
            programas de I & II Ciclo (CICO), III Ciclo, Bachillerato por Madurez (BXM) y EDAD.
          </p>
        </div>

        {/* Action Pathway Cards for User Flow Validation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pathway 1: Enter Math BXM MVP directly */}
          <div className="bg-[#fefcf8] dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-500 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  MVP Activo
                </span>
                <span className="text-xs font-extrabold text-stone-500 dark:text-stone-400">
                  10° y 11° Año
                </span>
              </div>
              <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">
                Matemáticas BXM
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                Accede directamente al simulador oficial de 60 ítems, práctica modular por área y
                especificaciones curriculares completas.
              </p>
            </div>
            <button
              onClick={onEnterBxmHub}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs min-h-[44px]"
            >
              <span>Ingresar al Hub BXM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pathway 2: Explore all programs via Welcome Page */}
          <div className="bg-[#fefcf8] dark:bg-slate-900 border-2 border-stone-800 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-slate-700">
                  Portal Curricular
                </span>
                <span className="text-xs font-extrabold text-stone-500 dark:text-stone-400">
                  4 Programas MEP
                </span>
              </div>
              <h2 className="text-lg font-black text-stone-900 dark:text-stone-100">
                Explorar Programas MEP
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
                Consulta los 4 planes de estudio (CICO, III Ciclo, EDAD, BXM), reglas de calculadora,
                notas mínimas y convocatorias vigentes.
              </p>
            </div>
            <button
              onClick={onExplorePrograms}
              className="w-full py-3 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs min-h-[44px]"
            >
              <span>Ver Planes y Programas</span>
              <GraduationCap className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-slate-800/40 border border-stone-200 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-stone-800 dark:text-stone-200">Alineación Oficial</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                Reactivos basados en convocatorias oficiales del MEP.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-slate-800/40 border border-stone-200 dark:border-slate-800">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-stone-800 dark:text-stone-200">Simulación Cronometrada</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                Prueba completa de 150 minutos con revisión detallada.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 dark:bg-slate-800/40 border border-stone-200 dark:border-slate-800">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-black text-stone-800 dark:text-stone-200">Práctica Modular</h4>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                Ejercitación focalizada por área de conocimiento y tema.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-4 px-6 text-center text-xs text-stone-500 dark:text-stone-400">
        MEP-EA-01 Prototipo de Educación Abierta • Sistema Independiente de Práctica
      </footer>
    </div>
  );
};
