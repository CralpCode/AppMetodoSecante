import React from 'react';
import { Download, Laptop, Smartphone } from 'lucide-react';

export default function SeccionDescargas() {
  const base = (import.meta as any).env.BASE_URL || './';
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
      <h2 className="font-semibold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
        <Download className="w-4 h-4 text-indigo-600" />
        <span>Descargas de Aplicaciones</span>
      </h2>
      <p className="text-xs text-slate-600">
        Versiones sin necesidad de conexión a internet para Windows y Android.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-slate-150 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-300 hover:shadow-xs transition-all bg-slate-50/30">
          <div>
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-indigo-600" />
              <span>Método Secante (Portátil)</span>
              <span className="text-[10px] font-normal px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">Portable</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Ejecutable directo para Windows. No requiere instalación. Ideal para llevar en una memoria USB.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">(.exe)</span>
            <a
              href={`${base}MetodoSecante 1.0.0.exe`}
              download="MetodoSecante 1.0.0.exe"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </a>
          </div>
        </div>

        <div className="border border-slate-150 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-300 hover:shadow-xs transition-all bg-slate-50/30">
          <div>
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-indigo-600" />
              <span>Instalador Windows</span>
              <span className="text-[10px] font-normal px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">Instalador</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Instala la aplicación en tu sistema operativo Windows de forma permanente.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">(.exe)</span>
            <a
              href={`${base}MetodoSecante Setup 1.0.0.exe`}
              download="MetodoSecante Setup 1.0.0.exe"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </a>
          </div>
        </div>

        <div className="border border-slate-150 rounded-xl p-4 flex flex-col justify-between hover:border-indigo-300 hover:shadow-xs transition-all bg-slate-50/30">
          <div>
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Método Secante (Android)</span>
              <span className="text-[10px] font-normal px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">APK</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Aplicación móvil para dispositivos Android.
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400">(.apk)</span>
            <a
              href={`${base}MetodoSecante.apk`}
              download="MetodoSecante.apk"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
