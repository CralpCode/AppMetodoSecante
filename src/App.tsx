import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Calculator, Play, RefreshCw, GitCommit, Split } from 'lucide-react';
import {
  calcularSecante,
  calcularSecanteModificada,
  formulaLatex,
  IteracionSecante,
  IteracionSecanteModificada
} from './mathUtils';

type Metodo = 'estandar' | 'modificada';

export default function App() {
  const [metodo, setMetodo] = useState<Metodo>('estandar');
  const [expresion, setExpresion] = useState('x^3 - x - 2');
  const [x0, setX0] = useState('1.0');
  const [x1, setX1] = useState('2.0');
  const [delta, setDelta] = useState('0.01');
  const [tolerancia, setTolerancia] = useState('0.0001');
  const [numIteraciones, setNumIteraciones] = useState('10');
  const [numDecimales, setNumDecimales] = useState('6');

  const [iteracionesSecante, setIteracionesSecante] = useState<IteracionSecante[]>([]);
  const [iteracionesModificada, setIteracionesModificada] = useState<IteracionSecanteModificada[]>([]);

  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [warningBanner, setWarningBanner] = useState<string | null>(
    'La tolerancia máxima es de 17 decimales por el límite físico IEEE 754 (epsilon ~2.22e-16). Se permite mostrar hasta 50 decimales porque el navegador expande la representación binaria exacta a base 10 (generando ruido numérico desde el decimal 17), pero se limita a 50 para evitar errores de rango del navegador (`RangeError`). Las iteraciones finalizan si el error es menor que la tolerancia o si el denominador es casi cero (<1e-15) para prevenir indeterminaciones.'
  );
  const [metodoCalculado, setMetodoCalculado] = useState<Metodo | null>(null);

  const decimalesTolerancia = tolerancia.includes('.') ? tolerancia.split('.')[1].length : 0;
  const safeDecimales = (() => {
    const val = parseInt(numDecimales);
    return isNaN(val) ? 6 : Math.min(50, Math.max(0, val));
  })();

  const calcular = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorBanner(null);
    setMetodoCalculado(null);


    const valX0 = parseFloat(x0);
    const valTol = parseFloat(tolerancia);

    if (isNaN(valX0) || isNaN(valTol)) {
      setErrorBanner('Por favor ingresa números válidos.');
      return;
    }

    const valDecimales = parseInt(numDecimales);
    if (isNaN(valDecimales) || valDecimales < 0 || valDecimales > 50 || numDecimales.includes('.')) {
      setErrorBanner('La cantidad de decimales a mostrar debe ser un número entero entre 0 y 50.');
      return;
    }

    if (decimalesTolerancia > 17) {
      setErrorBanner(
        'La precisión de la tolerancia excede el límite de representación de punto flotante (IEEE 754) (máximo 17 decimales).'
      );
      return;
    }

    if (metodo === 'estandar') {
      const valX1 = parseFloat(x1);
      if (isNaN(valX1)) {
        setErrorBanner('Por favor ingresa un número válido para x1.');
        return;
      }
      if (valX0 === valX1) {
        setErrorBanner('Los puntos iniciales x0 y x1 deben ser diferentes.');
        return;
      }

      const res = calcularSecante(expresion, valX0, valX1, valTol, parseInt(numIteraciones));
      if (res.error) {
        setErrorBanner(res.error);
      } else {
        setIteracionesSecante(res.iteraciones);
        setMetodoCalculado('estandar');
      }
    } else {
      const valDelta = parseFloat(delta);
      if (isNaN(valDelta) || valDelta === 0) {
        setErrorBanner('Por favor ingresa una perturbación delta válida y diferente de cero.');
        return;
      }

      const res = calcularSecanteModificada(expresion, valX0, valDelta, valTol, parseInt(numIteraciones));
      if (res.error) {
        setErrorBanner(res.error);
      } else {
        setIteracionesModificada(res.iteraciones);
        setMetodoCalculado('modificada');
      }
    }
  };

  const restablecer = () => {
    setExpresion('x^3 - x - 2');
    setX0('1.0');
    setX1('2.0');
    setDelta('0.01');
    setTolerancia('0.0001');
    setIteracionesSecante([]);
    setIteracionesModificada([]);
    setNumIteraciones('10');
    setNumDecimales('6');
    setErrorBanner(null);
    setMetodoCalculado(null);
  };

  const renderTex = (tex: string) => {
    return katex.renderToString(tex, { throwOnError: false });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans">
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-xs">
        <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2.5">
          <img src={`${(import.meta as any).env.BASE_URL}favicon.png`} alt="Logo Método de la Secante" className="w-10 h-10 object-contain rounded-full" />
          <span>Método de la Secante</span>
          <span className="text-xs font-normal text-slate-400">/ Estándar y Modificada</span>
        </h1>
        <button
          onClick={restablecer}
          className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
          title="Restablecer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">

        {warningBanner && (
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl text-yellow-700 text-sm">
            {warningBanner}
          </div>
        )}

        {errorBanner && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm">
            {errorBanner}
          </div>
        )}


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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <form onSubmit={calcular} className="md:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm h-fit">
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
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-600" />
            <span>Fundamentos Matemáticos y Criterios de Parada</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">

            <div className="space-y-2">
              <h3 className="font-bold text-slate-700">1. Criterio de Parada (Tolerancia)</h3>
              <p>
                El algoritmo detiene sus iteraciones de forma anticipada cuando el error aproximado relativo porcentual (<span dangerouslySetInnerHTML={{ __html: renderTex(String.raw`E_a`) }} />) es menor que la tolerancia de parada especificada (<span dangerouslySetInnerHTML={{ __html: renderTex(String.raw`Tol`) }} />):
              </p>
              <div
                className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-center overflow-x-auto my-2"
                dangerouslySetInnerHTML={{ __html: renderTex(String.raw`E_a = \left| \frac{x_{k+1} - x_k}{x_{k+1}} \right| \times 100\% < Tol`) }}
              />
              <p>
                Si la aproximación actual (<span dangerouslySetInnerHTML={{ __html: renderTex(String.raw`x_{k+1}`) }} />) se acerca a cero, para evitar la división indeterminada se evalúa el error absoluto aproximado:
              </p>
              <div
                className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-center overflow-x-auto my-2"
                dangerouslySetInnerHTML={{ __html: renderTex(String.raw`E_a = |x_{k+1} - x_k| \times 100\% < Tol`) }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-slate-700">2. Perturbación en Secante Modificada</h3>
              <p>
                En lugar de utilizar dos puntos iniciales independientes (<span dangerouslySetInnerHTML={{ __html: renderTex(String.raw`x_0, x_1`) }} />), la variante modificada estima la pendiente evaluando el punto actual perturbado fraccionariamente por un delta (<span dangerouslySetInnerHTML={{ __html: renderTex(String.raw`\delta`) }} />):
              </p>
              <div
                className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-center overflow-x-auto my-2"
                dangerouslySetInnerHTML={{ __html: renderTex(String.raw`x_k^{pert} = x_k + \delta x_k`) }}
              />
              <p>
                Si el punto actual (<span dangerouslySetInnerHTML={{ __html: renderTex(String.raw`x_k`) }} />) es extremadamente cercano a cero (e.g., <span dangerouslySetInnerHTML={{ __html: renderTex(String.raw`|x_k| \le 10^{-12}`) }} />), se utiliza la perturbación directa para evitar que la perturbación se anule:
              </p>
              <div
                className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-center overflow-x-auto my-2"
                dangerouslySetInnerHTML={{ __html: renderTex(String.raw`x_k^{pert} = x_k + \delta`) }}
              />
              <p>
                La fórmula de iteración recurrente final es:
              </p>
              <div
                className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-center overflow-x-auto my-2"
                dangerouslySetInnerHTML={{ __html: renderTex(String.raw`x_{k+1} = x_k - \frac{\delta x_k f(x_k)}{f(x_k + \delta x_k) - f(x_k)}`) }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
