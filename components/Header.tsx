'use client'

import { Activity, Stethoscope } from 'lucide-react'

export default function Header() {
  return (
    <header className="glass sticky top-0 z-50 border-b border-[#1e2d45]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0a0f1e] animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text leading-none">AnesthesiaDose</h1>
              <p className="text-xs text-[#475569] mt-0.5">Clinical Dosage Calculator</p>
            </div>
          </div>

          {/* Center badge */}
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#1e2d45] bg-[#111827]">
            <Stethoscope className="w-4 h-4 text-sky-400" />
            <span className="text-sm text-[#94a3b8]">For MD Anesthesiologists</span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[#94a3b8] hidden sm:inline">System Active</span>
          </div>
        </div>
      </div>
    </header>
  )
}
