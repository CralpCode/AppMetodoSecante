import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { calcularSecante, calcularSecanteModificada, IteracionSecante, IteracionSecanteModificada } from './mathUtils';
import Cabecera from './componentes/Cabecera';
import SelectorMetodo from './componentes/SelectorMetodo';
import FormularioParametros from './componentes/FormularioParametros';
import TablaResultados from './componentes/TablaResultados';
import FundamentosMatematicos from './componentes/FundamentosMatematicos';
import SeccionDescargas from './componentes/SeccionDescargas';

export default function App() {
  const [metodo, setMetodo] = useState<'estandar' | 'modificada'>('estandar');
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
  const [metodoCalculado, setMetodoCalculado] = useState<'estandar' | 'modificada' | null>(null);

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
      <Cabecera onRestablecer={restablecer} />

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

        <SelectorMetodo
          metodo={metodo}
          setMetodo={setMetodo}
          setErrorBanner={setErrorBanner}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormularioParametros
            metodo={metodo}
            expresion={expresion}
            setExpresion={setExpresion}
            x0={x0}
            setX0={setX0}
            x1={x1}
            setX1={setX1}
            delta={delta}
            setDelta={setDelta}
            tolerancia={tolerancia}
            setTolerancia={setTolerancia}
            numIteraciones={numIteraciones}
            setNumIteraciones={setNumIteraciones}
            numDecimales={numDecimales}
            setNumDecimales={setNumDecimales}
            setErrorBanner={setErrorBanner}
            onCalcular={calcular}
            renderTex={renderTex}
          />

          <TablaResultados
            metodoCalculado={metodoCalculado}
            iteracionesSecante={iteracionesSecante}
            iteracionesModificada={iteracionesModificada}
            safeDecimales={safeDecimales}
            decimalesTolerancia={decimalesTolerancia}
            renderTex={renderTex}
          />
        </div>

        <FundamentosMatematicos renderTex={renderTex} />

        <SeccionDescargas />
      </main>
    </div>
  );
}
