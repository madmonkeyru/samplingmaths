import React from 'react';
import { ProgramInfo } from '../../types';
import { dataService } from '../../services/dataService';
import { ProgramCard } from '../common/ProgramCard';
import { ConvocatoriaBadge } from '../common/ConvocatoriaBadge';
import {
  ArrowRight,
  ShieldCheck,
  Calculator,
  Award,
  Layers,
  Info,
} from 'lucide-react';

interface WelcomePageProps {
  onSelectProgram: (programId: string) => void;
  onEnterMvpMath: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onSelectProgram,
  onEnterMvpMath,
}) => {
  const programs: ProgramInfo[] = dataService.getPrograms();
  const currentConvocatoria = '2026-c2';

  return (
    <div className="welcome-page max-w-7xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 py-6 sm:py-10 space-y-8 text-stone-900 dark:text-slate-100 transition-colors">
      {/* 1. Header Hero / Welcome Portal Banner */}
      <div className="page-intro rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <ConvocatoriaBadge convocatoriaId={currentConvocatoria} />
          </div>

          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight leading-tight">
            MEP Educación Abierta — Simulador & Práctica
          </h1>
          <p className="text-sm sm:text-base text-stone-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Hay distintas rutas para seguir estudiando. Explora tu programa y encuentra el siguiente paso en tu preparación.
          </p>
        </div>


      </div>

      {/* 2. Prominent Quick-Entry Card for MVP (Matemáticas — BXM) */}
      <div className="ui-featured rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600 dark:text-slate-400">
              Bachillerato por Madurez Suficiente
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-stone-900 dark:text-slate-100 tracking-tight">
            Matemáticas BXM (Convocatoria 02-2026)
          </h2>

          <p className="text-xs sm:text-sm text-stone-700 dark:text-slate-300 font-medium leading-relaxed">
           Prácticas, simulaciones, explicaciones y fórmulas.
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5 items-stretch sm:items-center md:items-stretch">
          <button
            onClick={onEnterMvpMath}
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-sm cursor-pointer min-h-[48px]"
          >
            <span>Entrar al Hub de Matemáticas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Program Tracks Overview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-stone-800 dark:text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Programas de Educación Abierta
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {programs.map((prog) => (
            <ProgramCard
              key={prog.id}
              program={prog}
              isMvp={prog.id === 'bxm'}
              onSelect={onSelectProgram}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-stone-600 dark:text-slate-400">Plataforma independiente de preparación. No realiza inscripciones ni verifica expedientes del MEP.</p>

      {/* 4. Compact Informational Banner: Examination Rules & Regulations */}
      <div className="ui-surface rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-stone-200 dark:border-slate-800 pb-3">
          <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-xs font-semibold text-stone-800 dark:text-slate-200">
            Estructura y reglas de referencia curricular
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium text-stone-700 dark:text-slate-300">
          <div className="flex items-start gap-3 bg-stone-50 dark:bg-slate-800/60 p-3.5 rounded-xl ">
            <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-slate-100">Notas de Aprobación</h4>
              <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-1 leading-snug">
                BXM y EDAD requieren nota mínima de <strong className="text-indigo-600 dark:text-indigo-400">70</strong>.
                I y II Ciclo y III Ciclo requieren nota mínima de <strong className="text-indigo-600 dark:text-indigo-400">65</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-stone-50 dark:bg-slate-800/60 p-3.5 rounded-xl ">
            <Calculator className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-slate-100">Directriz de Calculadoras</h4>
              <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-1 leading-snug">
                Calculadora científica estándar permitida en III Ciclo, EDAD y BXM (sin cálculo simbólico).
                Estrictamente prohibida en I y II Ciclo (CICO).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-stone-50 dark:bg-slate-800/60 p-3.5 rounded-xl ">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-stone-900 dark:text-slate-100">Disponibilidad de Contenido</h4>
              <p className="text-[11px] text-stone-600 dark:text-slate-400 mt-1 leading-snug">
                La práctica funcional está disponible en Matemáticas BXM, convocatoria 02-2026.
                Las demás rutas muestran su estructura mientras se prepara el contenido.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
