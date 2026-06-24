import React from 'react';
import { IteracionSecante, IteracionSecanteModificada } from '../mathUtils';

interface PropsTabla {
  metodoCalculado: 'estandar' | 'modificada' | null;
  iteracionesSecante: IteracionSecante[];
  iteracionesModificada: IteracionSecanteModificada[];
  safeDecimales: number;
  decimalesTolerancia: number;
  renderTex: (tex: string) => string;
}

export default function TablaResultados({
  metodoCalculado,
  iteracionesSecante,
  iteracionesModificada,
  safeDecimales,
  decimalesTolerancia,
  renderTex
}: PropsTabla) {
  return (
    <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm overflow-hidden flex flex-col justify-between">
      <div>
        <h2 className="font-semibold text-slate-800 text-sm mb-3 border-b border-slate-100 pb-2 flex justify-between items-center">
          <span>Resultados del Cálculo</span>
          {metodoCalculado && (
            <span className="text-xs font-normal text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              {metodoCalculado === 'estandar' ? 'Secante Estándar' : 'Secante Modificada'}
            </span>
          )}
        </h2>

        {!metodoCalculado ? (
          <div className="text-center py-12 text-slate-400 text-xs italic">
            Ingresa los parámetros y presiona Calcular para ver los resultados (límite: 10 iteraciones).
          </div>
        ) : metodoCalculado === 'estandar' ? (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3 text-center">k</th>
                  <th className="py-2.5 px-3" dangerouslySetInnerHTML={{ __html: renderTex('x_{k-1}') }} />
                  <th className="py-2.5 px-3" dangerouslySetInnerHTML={{ __html: renderTex('x_k') }} />
                  <th className="py-2.5 px-3" dangerouslySetInnerHTML={{ __html: renderTex('f(x_{k-1})') }} />
                  <th className="py-2.5 px-3" dangerouslySetInnerHTML={{ __html: renderTex('f(x_k)') }} />
                  <th className="py-2.5 px-3 text-indigo-600 font-bold" dangerouslySetInnerHTML={{ __html: renderTex('x_{k+1}') }} />
                  <th className="py-2.5 px-3 text-right" dangerouslySetInnerHTML={{ __html: renderTex('E_a\\ (\\%)') }} />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {iteracionesSecante.map((row) => (
                  <tr key={row.k} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-400">{row.k}</td>
                    <td className="py-2.5 px-3">{row.x0.toFixed(safeDecimales)}</td>
                    <td className="py-2.5 px-3">{row.x1.toFixed(safeDecimales)}</td>
                    <td className="py-2.5 px-3 text-slate-500">{row.f_x0.toFixed(safeDecimales)}</td>
                    <td className="py-2.5 px-3 text-slate-500">{row.f_x1.toFixed(safeDecimales)}</td>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">{row.xSiguiente.toFixed(safeDecimales)}</td>
                    <td className="py-2.5 px-3 text-right">
                      {row.error !== null ? `${row.error.toFixed(Math.min(20, Math.max(0, decimalesTolerancia)))}%` : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                  <th className="py-2.5 px-3 text-center">k</th>
                  <th className="py-2.5 px-3" dangerouslySetInnerHTML={{ __html: renderTex('x_k') }} />
                  <th className="py-2.5 px-3" dangerouslySetInnerHTML={{ __html: renderTex('f(x_k)') }} />
                  <th className="py-2.5 px-3" dangerouslySetInnerHTML={{ __html: renderTex('x_k + \\delta x_k') }} />
                  <th className="py-2.5 px-3" dangerouslySetInnerHTML={{ __html: renderTex('f(x_k + \\delta x_k)') }} />
                  <th className="py-2.5 px-3 text-indigo-600 font-bold" dangerouslySetInnerHTML={{ __html: renderTex('x_{k+1}') }} />
                  <th className="py-2.5 px-3 text-right" dangerouslySetInnerHTML={{ __html: renderTex('E_a\\ (\\%)') }} />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-slate-700">
                {iteracionesModificada.map((row) => (
                  <tr key={row.k} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-center font-bold text-slate-400">{row.k}</td>
                    <td className="py-2.5 px-3">{row.x.toFixed(safeDecimales)}</td>
                    <td className="py-2.5 px-3 text-slate-500">{row.f_x.toFixed(safeDecimales)}</td>
                    <td className="py-2.5 px-3">{row.x_pert.toFixed(safeDecimales)}</td>
                    <td className="py-2.5 px-3 text-slate-500">{row.f_x_pert.toFixed(safeDecimales)}</td>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">{row.xSiguiente.toFixed(safeDecimales)}</td>
                    <td className="py-2.5 px-3 text-right">
                      {row.error !== null ? `${row.error.toFixed(Math.min(20, Math.max(0, decimalesTolerancia)))}%` : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {metodoCalculado && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          La raíz estimada al final de las iteraciones calculadas es:{' '}
          <strong className="text-indigo-600 font-mono text-sm select-all">
            {metodoCalculado === 'estandar'
              ? iteracionesSecante[iteracionesSecante.length - 1]?.xSiguiente.toFixed(safeDecimales)
              : iteracionesModificada[iteracionesModificada.length - 1]?.xSiguiente.toFixed(safeDecimales)}
          </strong>
        </div>
      )}
    </div>
  );
}
