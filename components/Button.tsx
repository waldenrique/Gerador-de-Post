import React from 'react';
import { Icon } from './Icon';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, isLoading = false, disabled, ...props }) => {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className="flex w-full justify-center items-center gap-2 rounded-lg border border-transparent bg-cyan-600 px-4 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200"
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner />
          Gerando...
        </>
      ) : (
        <>
          <Icon name="sparkles" className="h-5 w-5"/>
          {children}
        </>
      )}
    </button>
  );
};