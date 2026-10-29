'use client'

import { useState } from 'react'
import { Drug } from '@/lib/types'
import {
  ChevronDown, ChevronUp, AlertTriangle, Info,
  Clock, Zap, Activity, BookOpen, ShieldAlert
} from 'lucide-react'

interface Props {
  drug: Drug
  index: number
}

const ROUTE_COLORS: Record<string, string> = {
  'IV': 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  'IM': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'SC': 'text-green-400 bg-green-400/10 border-green-400/20',
  'IN': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'EP': 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  'IT': 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  'SL': 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  'PO': 'text-teal-400 bg-teal-400/10 border-teal-400/20',
}

export default function DrugCard({ drug, index }: Props) {
  const [expanded, setExpanded] = useState(false)
  const routeColor = ROUTE_COLORS[drug.route] || ROUTE_COLORS['IV']
  const { calculated_dose } = drug

  const hasWarning = drug.warnings && drug.warnings.includes('⚠️')

  return (
    <div
      className="rounded-xl border border-[#1e2d45] bg-[#111827] card-hover animate-fade-in overflow-hidden"
      style={{ animationDelay: `${index * 0.04}s`, opacity: 0 }}
    >
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white truncate">{drug.name}</h3>
              {drug.generic_name && drug.generic_name !== drug.name && (
                <span className="text-xs text-[#475569]">({drug.generic_name})</span>
              )}
              {hasWarning && (
                <span className="text-amber-400" title="Contains warnings">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {drug.drug_class && (
                <span className="text-[10px] text-[#475569]">{drug.drug_class}</span>
              )}
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${routeColor}`}>
                {drug.route_display || drug.route}
              </span>
              <span className="text-[10px] text-[#475569] bg-[#0a0f1e] px-2 py-0.5 rounded-md border border-[#1e2d45]">
                {calculated_dose.age_group}
              </span>
            </div>
          </div>
        </div>

        {/* Dose display */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-[#0a0f1e] rounded-xl p-3 border border-[#1e2d45]">
            <div className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Per kg dose</div>
            <div className="text-base font-bold text-white">
              {calculated_dose.dose_min_per_kg}
              {calculated_dose.dose_min_per_kg !== calculated_dose.dose_max_per_kg &&
                ` – ${calculated_dose.dose_max_per_kg}`}
            </div>
            <div className="text-[10px] text-[#475569] mt-0.5">{drug.dose_unit}</div>
          </div>

          <div className="bg-gradient-to-br from-sky-500/5 to-indigo-500/5 rounded-xl p-3 border border-sky-500/10">
            <div className="text-[10px] text-sky-400/70 uppercase tracking-wider mb-1">Calculated dose</div>
            <div className="text-base font-bold text-sky-300">
              {calculated_dose.calculated_min_mg}
              {calculated_dose.calculated_min_mg !== calculated_dose.calculated_max_mg &&
                ` – ${calculated_dose.calculated_max_mg}`}
            </div>
            <div className="text-[10px] text-sky-400/60 mt-0.5">mg total</div>
          </div>
        </div>

        {/* Dose basis badge */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border
            ${calculated_dose.dose_basis === 'adjusted'
              ? 'text-orange-400 bg-orange-400/10 border-orange-400/20'
              : calculated_dose.dose_basis === 'ibw'
                ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                : 'text-slate-400 bg-slate-400/10 border-slate-400/20'
            }`}>
            ⚖️ {calculated_dose.dose_basis_label}
          </span>
          <span className="text-[10px] text-[#475569]">
            @ {calculated_dose.dosing_weight_kg} kg
          </span>
        </div>

        {/* Quick info row */}
        <div className="mt-3 flex items-center gap-3 text-xs text-[#475569]">
          {drug.onset_time && (
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400/60" />
              <span>Onset: {drug.onset_time}</span>
            </div>
          )}
          {drug.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400/60" />
              <span>Duration: {drug.duration}</span>
            </div>
          )}
        </div>
      </div>

      {/* Warning bar */}
      {drug.warnings && (
        <div className="px-4 py-2 bg-amber-500/5 border-t border-amber-500/10">
          <p className="text-[11px] text-amber-400/80 leading-relaxed">{drug.warnings}</p>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between
          bg-[#0a0f1e]/40 border-t border-[#1e2d45] hover:bg-[#0a0f1e]/60
          text-xs text-[#475569] hover:text-[#94a3b8] transition-all"
      >
        <span className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          {expanded ? 'Hide' : 'Show'} clinical details
        </span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-4 pb-4 pt-3 space-y-3 border-t border-[#1e2d45] bg-[#0a0f1e]/30">
          {drug.mechanism && (
            <DetailSection
              icon={<Activity className="w-3.5 h-3.5 text-sky-400" />}
              label="Mechanism"
              text={drug.mechanism}
              color="sky"
            />
          )}
          {drug.indications && (
            <DetailSection
              icon={<Info className="w-3.5 h-3.5 text-green-400" />}
              label="Indications"
              text={drug.indications}
              color="green"
            />
          )}
          {drug.contraindications && (
            <DetailSection
              icon={<ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
              label="Contraindications"
              text={drug.contraindications}
              color="red"
            />
          )}
          {drug.side_effects && (
            <DetailSection
              icon={<AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
              label="Side Effects"
              text={drug.side_effects}
              color="amber"
            />
          )}
          {drug.notes && (
            <DetailSection
              icon={<BookOpen className="w-3.5 h-3.5 text-indigo-400" />}
              label="Clinical Notes"
              text={drug.notes}
              color="indigo"
            />
          )}
        </div>
      )}
    </div>
  )
}

function DetailSection({
  icon, label, text, color
}: {
  icon: React.ReactNode
  label: string
  text: string
  color: string
}) {
  const borderColors: Record<string, string> = {
    sky: 'border-sky-500/20',
    green: 'border-green-500/20',
    red: 'border-red-500/20',
    amber: 'border-amber-500/20',
    indigo: 'border-indigo-500/20',
  }

  return (
    <div className={`pl-3 border-l-2 ${borderColors[color] || 'border-sky-500/20'}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xs text-[#94a3b8] leading-relaxed">{text}</p>
    </div>
  )
}
