import React from 'react';
import { LearningJourney } from '../common/LearningJourney';
import {
  ArrowRight,
  GraduationCap,
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
    <div className="entry-page min-h-[calc(100vh-65px)] text-stone-900 dark:text-stone-100 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-20 w-full space-y-10">
        {/* Simple Top Badge */}
        {/* Core Value Statement (Simple, direct, no narrative/testimonials) */}
        <div className="space-y-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 dark:text-indigo-300">Tu próximo paso empieza aquí</p>
          <h1 className="text-3xl sm:text-5xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
            Preparación y Práctica para los Exámenes de Educación Abierta del MEP
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 max-w-2xl leading-relaxed">
            Encuentra tu programa, refuerza lo que sabes y prepárate a tu ritmo. Cada práctica cuenta.
          </p>
        </div>

        {/* Action Pathway Cards for User Flow Validation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Pathway 1: Enter Math BXM MVP directly */}
          <div className="ui-surface entry-featured rounded-2xl p-6 flex flex-col justify-between gap-6 ui-lift">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 ">
                  Activo
                </span>
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  10° y 11° Año
                </span>
              </div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Matemáticas BXM
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Accede directamente al simulador de práctica de 60 ítems, práctica modular por área y
                especificaciones curriculares completas.
              </p>
            </div>
            <button
              onClick={onEnterBxmHub}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs min-h-[44px]"
            >
              <span>Ingresar al Hub BXM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Pathway 2: Explore all programs via Welcome Page */}
          <div className="ui-surface rounded-2xl p-6 flex flex-col justify-between gap-6 ui-lift">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold px-2.5 py-1 rounded bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 ">
                  Portal
                </span>
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
                  4 Programas MEP
                </span>
              </div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                Explorar Programas MEP
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Consulta los 4 planes de estudio (CICO, III Ciclo, EDAD, BXM), reglas de calculadora,
                notas mínimas y convocatorias de referencia.
              </p>
            </div>
            <button
              onClick={onExplorePrograms}
              className="w-full py-3 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs min-h-[44px]"
            >
              <span>Ver Planes y Programas</span>
              <GraduationCap className="w-4 h-4" />
            </button>
          </div>
        </div>
        <LearningJourney />
      </div>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 py-4 px-6 text-center text-xs text-stone-500 dark:text-stone-400">
        MEP-EA-01 Prototipo de Educación Abierta • Sistema Independiente de Práctica
      </footer>
    </div>
  );
};
