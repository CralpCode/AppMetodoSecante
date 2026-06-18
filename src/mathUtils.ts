import { evaluate, parse } from 'mathjs';

export interface IteracionSecante {
  k: number;
  x0: number;
  x1: number;
  f_x0: number;
  f_x1: number;
  xSiguiente: number;
  error: number | null;
}

export interface IteracionSecanteModificada {
  k: number;
  x: number;
  f_x: number;
  x_pert: number; // x + delta * x
  f_x_pert: number; // f(x + delta * x)
  xSiguiente: number;
  error: number | null;
}

/**
 * Convierte una expresión matemática en su formato LaTeX para representación visual.
 */
export const formulaLatex = (expr: string): string => {
  try {
    return parse(expr).toTex();
  } catch {
    return expr;
  }
};

/**
 * Calcula raíces usando el Método de la Secante Estándar.
 */
export function calcularSecante(
  expresion: string,
  x0Val: number,
  x1Val: number,
  tol: number,
  maxIter: number = 10
): { iteraciones: IteracionSecante[]; error: string | null } {
  const funcionX = (x: number): number => {
    return evaluate(expresion, { x });
  };

  const iteraciones: IteracionSecante[] = [];
  let currX0 = x0Val;
  let currX1 = x1Val;

  try {
    for (let k = 1; k <= maxIter; k++) {
      const f_x0 = funcionX(currX0);
      const f_x1 = funcionX(currX1);

      const den = f_x1 - f_x0;
      if (Math.abs(den) < 1e-15) {
        return {
          iteraciones,
          error: `División por cero en la iteración ${k} (las alturas f(x0) y f(x1) coinciden).`
        };
      }

      const xSiguiente = currX1 - (f_x1 * (currX1 - currX0)) / den;
      let error: number | null = null;
      if (Math.abs(xSiguiente) > 1e-12) {
        error = Math.abs((xSiguiente - currX1) / xSiguiente) * 100;
      } else {
        error = Math.abs(xSiguiente - currX1) * 100;
      }

      iteraciones.push({
        k,
        x0: currX0,
        x1: currX1,
        f_x0,
        f_x1,
        xSiguiente,
        error
      });

      if (error !== null && error < tol) {
        break;
      }

      currX0 = currX1;
      currX1 = xSiguiente;
    }
    return { iteraciones, error: null };
  } catch (err: any) {
    return { iteraciones, error: `Error en el cálculo: ${err.message}` };
  }
}

/**
 * Calcula raíces usando el Método de la Secante Modificada.
 */
export function calcularSecanteModificada(
  expresion: string,
  x0Val: number,
  delta: number,
  tol: number,
  maxIter: number = 10
): { iteraciones: IteracionSecanteModificada[]; error: string | null } {
  const funcionX = (x: number): number => {
    return evaluate(expresion, { x });
  };

  const iteraciones: IteracionSecanteModificada[] = [];
  let currX = x0Val;

  try {
    for (let k = 1; k <= maxIter; k++) {
      const f_x = funcionX(currX);
      
      // Si currX es muy cercano a 0, usamos delta directo para evitar una perturbación de 0
      const pert = Math.abs(currX) > 1e-12 ? delta * currX : delta;
      const xPert = currX + pert;
      const f_xPert = funcionX(xPert);

      const den = f_xPert - f_x;
      if (Math.abs(den) < 1e-15) {
        return {
          iteraciones,
          error: `División por cero en la iteración ${k} (f(x + δx) - f(x) es cero).`
        };
      }

      const xSiguiente = currX - (pert * f_x) / den;
      let error: number | null = null;
      if (Math.abs(xSiguiente) > 1e-12) {
        error = Math.abs((xSiguiente - currX) / xSiguiente) * 100;
      } else {
        error = Math.abs(xSiguiente - currX) * 100;
      }

      iteraciones.push({
        k,
        x: currX,
        f_x,
        x_pert: xPert,
        f_x_pert: f_xPert,
        xSiguiente,
        error
      });

      if (error !== null && error < tol) {
        break;
      }

      currX = xSiguiente;
    }
    return { iteraciones, error: null };
  } catch (err: any) {
    return { iteraciones, error: `Error en el cálculo: ${err.message}` };
  }
}
