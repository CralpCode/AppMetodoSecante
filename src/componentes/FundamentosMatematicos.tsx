import React from 'react';
import { Calculator } from 'lucide-react';

interface PropsFundamentos {
  renderTex: (tex: string) => string;
}

export default function FundamentosMatematicos({ renderTex }: PropsFundamentos) {
  return (
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
  );
}
