import React from 'react';
import type { Group } from '../../types';
import { TextRenderer } from '../common/TextRenderer';
import { VisualRenderer } from './VisualRenderer';

interface GroupVisualProps {
  group?: Group | null;
  className?: string;
}

export const GroupVisual: React.FC<GroupVisualProps> = ({ group, className = '' }) => {
  if (!group) return null;

  return (
    <div className={`group-visual-card p-4 my-4 bg-slate-50 border border-slate-300 rounded-lg shadow-sm ${className}`}>
      {group.title && (
        <h3 className="text-base font-bold text-slate-800 mb-2 border-b border-slate-200 pb-1">
          {group.title}
        </h3>
      )}
      {group.context_text && (
        <div className="text-sm text-slate-700 leading-relaxed mb-3">
          <TextRenderer content={group.context_text} />
        </div>
      )}
      {group.visual_spec && (
        <div className="flex justify-center mt-2">
          <VisualRenderer spec={group.visual_spec} alt={group.visual_spec.alt} />
        </div>
      )}
    </div>
  );
};
