'use client'

import { PatientInfo } from '@/lib/types'
import { User, Hash, Shield, CalendarDays, Weight } from 'lucide-react'

interface Props {
  patient: PatientInfo
  totalDrugs: number
}

const AGE_GROUP_COLORS: Record<string, string> = {
  'Neonate': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  'Pediatric': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'Adolescent': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  'Adult': 'text-green-400 bg-green-400/10 border-green-400/20',
  'Elderly': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
}

export default function PatientSummary({ patient, totalDrugs }: Props) {
  const colorClass = AGE_GROUP_COLORS[patient.age_group] || AGE_GROUP_COLORS['Adult']

  return (
    <div className="glass rounded-2xl p-5 border border-[#1e2d45] animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
          Active Patient Profile
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0a0f1e] rounded-xl p-3 border border-[#1e2d45]">
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-[#475569]" />
            <span className="text-[10px] text-[#475569] uppercase tracking-wider">Age</span>
          </div>
          <div className="text-xl font-bold text-white">{patient.age}</div>
          <div className="text-xs text-[#475569]">years</div>
        </div>

        <div className="bg-[#0a0f1e] rounded-xl p-3 border border-[#1e2d45]">
          <div className="flex items-center gap-1.5 mb-1">
            <User className="w-3.5 h-3.5 text-[#475569]" />
            <span className="text-[10px] text-[#475569] uppercase tracking-wider">Sex</span>
          </div>
          <div className="text-xl font-bold text-white capitalize">{patient.sex}</div>
          <div className="text-xs text-[#475569]">{patient.sex === 'male' ? '♂ Male' : '♀ Female'}</div>
        </div>

        <div className="bg-[#0a0f1e] rounded-xl p-3 border border-[#1e2d45]">
          <div className="flex items-center gap-1.5 mb-1">
            <Weight className="w-3.5 h-3.5 text-[#475569]" />
            <span className="text-[10px] text-[#475569] uppercase tracking-wider">Weight</span>
          </div>
          <div className="text-xl font-bold text-white">{patient.weight}</div>
          <div className="text-xs text-[#475569]">kg</div>
        </div>

        <div className="bg-[#0a0f1e] rounded-xl p-3 border border-[#1e2d45]">
          <div className="flex items-center gap-1.5 mb-1">
            <Hash className="w-3.5 h-3.5 text-[#475569]" />
            <span className="text-[10px] text-[#475569] uppercase tracking-wider">Drugs</span>
          </div>
          <div className="text-xl font-bold text-white">{totalDrugs}</div>
          <div className="text-xs text-[#475569]">applicable</div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
          <Shield className="w-3 h-3" />
          {patient.age_group} Protocol Active
        </span>
        <span className="text-xs text-[#475569]">
          Doses adjusted for {patient.age_group.toLowerCase()} patient
        </span>
      </div>
    </div>
  )
}
