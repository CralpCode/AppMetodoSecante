import React from 'react';
import { RefreshCw } from 'lucide-react';

interface PropsCabecera {
  onRestablecer: () => void;
}

export default function Cabecera({ onRestablecer }: PropsCabecera) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
      <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
        <img src={`${(import.meta as any).env.BASE_URL}favicon.png`} alt="Logo Método de la Secante" className="w-10 h-10 object-contain rounded-full" />
        <span>Método de la Secante</span>
        <span className="text-xs font-normal text-slate-400">/ Estándar y Modificada</span>
      </h1>
      <button
        onClick={onRestablecer}
        className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
        title="Restablecer"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </header>
  );
}
