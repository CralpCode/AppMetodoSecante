import React from 'react';
import { Calculator, Play } from 'lucide-react';
import { formulaLatex } from '../mathUtils';

interface PropsFormulario {
  metodo: 'estandar' | 'modificada';
  expresion: string;
  setExpresion: (s: string) => void;
  x0: string;
  setX0: (s: string) => void;
  x1: string;
  setX1: (s: string) => void;
  delta: string;
  setDelta: (s: string) => void;
  tolerancia: string;
  setTolerancia: (s: string) => void;
  numIteraciones: string;
  setNumIteraciones: (s: string) => void;
  numDecimales: string;
  setNumDecimales: (s: string) => void;
  setErrorBanner: (s: string | null) => void;
  onCalcular: (e: React.FormEvent) => void;
  renderTex: (tex: string) => string;
}

export default function FormularioParametros({
  metodo,
  expresion,
  setExpresion,
  x0,
  setX0,
  x1,
  setX1,
  delta,
  setDelta,
  tolerancia,
  setTolerancia,
  numIteraciones,
  setNumIteraciones,
  numDecimales,
  setNumDecimales,
  setErrorBanner,
  onCalcular,
  renderTex
}: PropsFormulario) {
  return (
    <form onSubmit={onCalcular} className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm h-fit">
      <h2 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-100 pb-2">
        <Calculator className="w-4 h-4 text-indigo-600" />
        <span>Parámetros de Entrada</span>
      </h2>
      
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
          Cantidad de decimales<span dangerouslySetInnerHTML={{ __html: renderTex('N') }} />:
        </label>
        <input
          type="number"
          min="0"
          max="50"
          step="1"
          value={numDecimales}
          onChange={(e) => {
            const val = e.target.value;
            setNumDecimales(val);
            if (val === '') {
              setErrorBanner(null);
              return;
            }
            const parsed = parseInt(val);
            if (isNaN(parsed) || parsed < 0 || parsed > 50 || val.includes('.')) {
              setErrorBanner('La cantidad de decimales a mostrar debe ser un número entero entre 0 y 50.');
            } else {
              setErrorBanner(null);
            }
          }}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
          Fórmula de <span dangerouslySetInnerHTML={{ __html: renderTex('f(x)') }} />:
        </label>
        <input
          type="text"
          value={expresion}
          onChange={(e) => setExpresion(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white"
          placeholder="Ej. x^3 - x - 2"
          required
        />
        {expresion.trim() && (
          <div className="mt-1.5 text-xs text-slate-500 flex flex-col gap-1">
            <span>Vista previa:</span>
            <div
              className="p-2 bg-slate-50 border border-slate-200/60 rounded-lg text-slate-800 overflow-x-auto text-center flex justify-center min-h-[36px] items-center"
              dangerouslySetInnerHTML={{ __html: renderTex(`f(x) = ${formulaLatex(expresion)}`) }}
            />
          </div>
        )}
      </div>

      {metodo === 'estandar' ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              Punto <span dangerouslySetInnerHTML={{ __html: renderTex('x_0') }} />:
            </label>
            <input
              type="text"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              Punto <span dangerouslySetInnerHTML={{ __html: renderTex('x_1') }} />:
            </label>
            <input
              type="text"
              value={x1}
              onChange={(e) => setX1(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className=" text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              Punto <span dangerouslySetInnerHTML={{ __html: renderTex('x_0') }} />:
            </label>
            <input
              type="text"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="space-y-1">
            <label className=" text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              Perturbación <span dangerouslySetInnerHTML={{ __html: renderTex('\\delta') }} />:
            </label>
            <input
              type="text"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
          Tolerancia <span dangerouslySetInnerHTML={{ __html: renderTex('Tol\\ (\\%)') }} />:
        </label>
        <input
          type="text"
          value={tolerancia}
          onChange={(e) => setTolerancia(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-indigo-500"
          required
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
          Iteraciones <span dangerouslySetInnerHTML={{ __html: renderTex('N') }} />:
        </label>
        <input
          type="text"
          value={numIteraciones}
          onChange={(e) => setNumIteraciones(e.target.value)}
          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:outline-none focus:border-indigo-500"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <Play className="w-3.5 h-3.5" />
        <span>Calcular</span>
      </button>
    </form>
  );
}
