import React from 'react';
import { Monitor, Tablet, Smartphone, Sparkles } from 'lucide-react';

export default function DeviceSimulatorBar({ deviceMode, setDeviceMode }) {
  return (
    <div className="fixed bottom-4 right-4 z-40 bg-[#1D1E1C]/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 font-['Nunito'] text-xs">
      <div className="flex items-center gap-1.5 text-[#FDEA14] font-bold">
        <Sparkles className="w-4 h-4 animate-spin" />
        <span className="hidden sm:inline">Simulador UX Responsive:</span>
      </div>

      <div className="flex bg-[#585856]/40 p-1 rounded-xl gap-1">
        <button
          onClick={() => setDeviceMode('desktop')}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-all ${
            deviceMode === 'desktop'
              ? 'bg-[#166193] text-white shadow-sm font-bold'
              : 'text-gray-300 hover:text-white'
          }`}
          title="Vista Desktop Grid"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Desktop</span>
        </button>

        <button
          onClick={() => setDeviceMode('tablet')}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-all ${
            deviceMode === 'tablet'
              ? 'bg-[#166193] text-white shadow-sm font-bold'
              : 'text-gray-300 hover:text-white'
          }`}
          title="Vista Tablet"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Tablet</span>
        </button>

        <button
          onClick={() => setDeviceMode('mobile')}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-all ${
            deviceMode === 'mobile'
              ? 'bg-[#37ACDE] text-white shadow-sm font-bold ring-2 ring-[#FDEA14]'
              : 'text-gray-300 hover:text-white'
          }`}
          title="Vista Acordeón Mobile"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#FDEA14]" />
          <span>Mobile Acordeón</span>
        </button>
      </div>
    </div>
  );
}
