import React from 'react';
import { Icon } from './Icon';

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  iconName: 'business' | 'summary' | 'sparkles' | 'image' | 'copy';
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, iconName, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1 ml-1">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute top-3.5 left-0 flex items-center pl-3">
             <Icon name={iconName} className="h-5 w-5 text-slate-400" />
        </div>
        <textarea
          id={id}
          className="block w-full rounded-lg border-slate-700 bg-slate-900/70 py-3 pl-10 pr-3 text-slate-100 placeholder-slate-400 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm"
          rows={4}
          {...props}
        />
      </div>
    </div>
  );
};