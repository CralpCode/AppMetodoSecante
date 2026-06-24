import React from 'react';
import { Split, GitCommit } from 'lucide-react';

interface PropsSelectorMetodo {
  metodo: 'estandar' | 'modificada';
  setMetodo: (metodo: 'estandar' | 'modificada') => void;
  setErrorBanner: (error: string | null) => void;
}

export default function SelectorMetodo({ metodo, setMetodo, setErrorBanner }: PropsSelectorMetodo) {
  return (
    <div className="flex bg-slate-200/60 p-1 rounded-xl w-fit">
      <button
        onClick={() => {
          setMetodo('estandar');
          setErrorBanner(null);
        }}
        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${metodo === 'estandar'
          ? 'bg-white text-indigo-600 shadow-xs'
          : 'text-slate-600 hover:text-slate-800'
          }`}
      >
        <Split className="w-3.5 h-3.5" />
        <span>Secante Estándar</span>
      </button>
      <button
        onClick={() => {
          setMetodo('modificada');
          setErrorBanner(null);
        }}
        className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 cursor-pointer ${metodo === 'modificada'
          ? 'bg-white text-indigo-600 shadow-xs'
          : 'text-slate-600 hover:text-slate-800'
          }`}
      >
        <GitCommit className="w-3.5 h-3.5" />
        <span>Secante Modificada</span>
      </button>
    </div>
  );
}
