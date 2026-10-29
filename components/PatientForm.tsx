'use client'

import { useState, useMemo } from 'react'
import { User, Weight, Calendar, ChevronRight, AlertCircle, RotateCcw, Loader2, Ruler } from 'lucide-react'
import { PatientForm as PatientFormType } from '@/lib/types'

interface Props {
  onSubmit: (form: PatientFormType) => void
  loading: boolean
  onReset: () => void
  hasResults: boolean
}

export default function PatientForm({ onSubmit, loading, onReset, hasResults }: Props) {
  const [form, setForm] = useState<PatientFormType>({ age: '', sex: '', weight: '', height: '' })
  const [errors, setErrors] = useState<Partial<Record<keyof PatientFormType, string>>>({})

  const validate = () => {
    const e: Partial<Record<keyof PatientFormType, string>> = {}
    const age = parseInt(form.age)
    const weight = parseFloat(form.weight)
    const height = parseFloat(form.height)

    if (!form.age || isNaN(age) || age < 0 || age > 120)
      e.age = 'Enter valid age (0–120 years)'
    if (!form.sex)
      e.sex = 'Select biological sex'
    if (!form.weight || isNaN(weight) || weight < 1 || weight > 300)
      e.weight = 'Enter valid weight (1–300 kg)'
    if (!form.height || isNaN(height) || height < 30 || height > 250)
      e.height = 'Enter valid height (30–250 cm)'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  const handleReset = () => {
    setForm({ age: '', sex: '', weight: '', height: '' })
    setErrors({})
    onReset()
  }

  const getAgeGroup = (age: string) => {
    const a = parseInt(age)
    if (isNaN(a)) return null
    if (a < 1) return { label: 'Neonate', color: 'text-purple-400' }
    if (a < 12) return { label: 'Pediatric', color: 'text-blue-400' }
    if (a < 18) return { label: 'Adolescent', color: 'text-cyan-400' }
    if (a < 65) return { label: 'Adult', color: 'text-green-400' }
    return { label: 'Elderly', color: 'text-amber-400' }
  }

  // Live BMI and IBW preview
  const bodyMetrics = useMemo(() => {
    const w = parseFloat(form.weight)
    const h = parseFloat(form.height)
    if (!w || !h || isNaN(w) || isNaN(h) || h < 100) return null

    const hm = h / 100
    const bmi = w / (hm * hm)

    const hIn = h / 2.54
    let ibw: number | null = null
    if (hIn > 60) {
      ibw = form.sex === 'male'
        ? 50 + 2.3 * (hIn - 60)
        : form.sex === 'female'
          ? 45.5 + 2.3 * (hIn - 60)
          : null
    }

    let bmiLabel = ''
    let bmiColor = ''
    if (bmi < 18.5) { bmiLabel = 'Underweight'; bmiColor = 'text-blue-400' }
    else if (bmi < 25) { bmiLabel = 'Normal'; bmiColor = 'text-green-400' }
    else if (bmi < 30) { bmiLabel = 'Overweight'; bmiColor = 'text-amber-400' }
    else if (bmi < 35) { bmiLabel = 'Obese I'; bmiColor = 'text-orange-400' }
    else if (bmi < 40) { bmiLabel = 'Obese II'; bmiColor = 'text-red-400' }
    else { bmiLabel = 'Obese III'; bmiColor = 'text-red-500' }

    const dosingNote = bmi >= 30 && ibw
      ? `ABW = ${Math.round(ibw + 0.4 * (w - ibw))} kg used for dosing`
      : ibw && ibw < w
        ? `IBW = ${Math.round(ibw)} kg used for dosing`
        : `Actual weight used for dosing`

    return { bmi: bmi.toFixed(1), bmiLabel, bmiColor, ibw: ibw ? Math.round(ibw) : null, dosingNote }
  }, [form.weight, form.height, form.sex])

  const ageGroup = getAgeGroup(form.age)

  return (
    <div className="glass rounded-2xl p-6 border border-[#1e2d45]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/20">
          <User className="w-4 h-4 text-sky-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">Patient Parameters</h2>
          <p className="text-xs text-[#475569]">Enter details for dose calculation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Age */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-[#94a3b8] mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Age (years)
            {ageGroup && (
              <span className={`ml-auto text-xs font-semibold ${ageGroup.color}`}>
                {ageGroup.label}
              </span>
            )}
          </label>
          <input
            type="number"
            min={0}
            max={120}
            value={form.age}
            onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
            placeholder="e.g. 45"
            className={`w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border text-white placeholder-[#475569] text-sm
              focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all
              ${errors.age ? 'border-red-500/50 bg-red-500/5' : 'border-[#1e2d45] hover:border-[#2a3f5f]'}`}
          />
          {errors.age && (
            <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />{errors.age}
            </p>
          )}
        </div>

        {/* Sex */}
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-[#94a3b8] mb-2">
            <User className="w-3.5 h-3.5" />
            Biological Sex
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['male', 'female'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm(f => ({ ...f, sex: s }))}
                className={`py-3 rounded-xl text-sm font-medium border transition-all
                  ${form.sex === s
                    ? s === 'male'
                      ? 'border-sky-500 bg-sky-500/10 text-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.15)]'
                      : 'border-pink-500 bg-pink-500/10 text-pink-400 shadow-[0_0_12px_rgba(236,72,153,0.15)]'
                    : 'border-[#1e2d45] bg-transparent text-[#94a3b8] hover:border-[#2a3f5f]'
                  }`}
              >
                {s === 'male' ? '♂ Male' : '♀ Female'}
              </button>
            ))}
          </div>
          {errors.sex && (
            <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5" />{errors.sex}
            </p>
          )}
        </div>

        {/* Weight + Height row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Weight */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-[#94a3b8] mb-2">
              <Weight className="w-3.5 h-3.5" />
              Weight (kg)
            </label>
            <input
              type="number"
              min={1}
              max={300}
              step={0.1}
              value={form.weight}
              onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
              placeholder="e.g. 70"
              className={`w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border text-white placeholder-[#475569] text-sm
                focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all
                ${errors.weight ? 'border-red-500/50 bg-red-500/5' : 'border-[#1e2d45] hover:border-[#2a3f5f]'}`}
            />
            {errors.weight && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5" />{errors.weight}
              </p>
            )}
          </div>

          {/* Height */}
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-[#94a3b8] mb-2">
              <Ruler className="w-3.5 h-3.5" />
              Height (cm)
            </label>
            <input
              type="number"
              min={30}
              max={250}
              step={0.5}
              value={form.height}
              onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
              placeholder="e.g. 170"
              className={`w-full px-4 py-3 rounded-xl bg-[#0a0f1e] border text-white placeholder-[#475569] text-sm
                focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all
                ${errors.height ? 'border-red-500/50 bg-red-500/5' : 'border-[#1e2d45] hover:border-[#2a3f5f]'}`}
            />
            {errors.height && (
              <p className="flex items-center gap-1 mt-1.5 text-xs text-red-400">
                <AlertCircle className="w-3.5 h-3.5" />{errors.height}
              </p>
            )}
          </div>
        </div>

        {/* Live BMI / IBW preview */}
        {bodyMetrics && (
          <div className="rounded-xl border border-[#1e2d45] bg-[#0a0f1e] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#475569] font-medium uppercase tracking-wider">Body Metrics</span>
              <span className={`text-[11px] font-semibold ${bodyMetrics.bmiColor}`}>{bodyMetrics.bmiLabel}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className={`text-base font-bold ${bodyMetrics.bmiColor}`}>{bodyMetrics.bmi}</div>
                <div className="text-[10px] text-[#475569]">BMI</div>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-white">{bodyMetrics.ibw ?? '—'}</div>
                <div className="text-[10px] text-[#475569]">IBW kg</div>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-white">{form.weight}</div>
                <div className="text-[10px] text-[#475569]">TBW kg</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 pt-1 border-t border-[#1e2d45]">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
              <span className="text-[10px] text-sky-400/80">{bodyMetrics.dosingNote}</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl
              bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-semibold
              hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                Calculate Dosages
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          {hasResults && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-3 rounded-xl border border-[#1e2d45] text-[#94a3b8]
                hover:border-[#2a3f5f] hover:text-white transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Disclaimer */}
      <div className="mt-5 pt-4 border-t border-[#1e2d45]">
        <p className="text-[10px] text-[#475569] leading-relaxed">
          ⚕️ <strong className="text-[#64748b]">Clinical Use Only.</strong> Dosages are guidelines for qualified
          anesthesiologists. Always verify with current formulary, consider patient comorbidities,
          concurrent medications, and clinical context.
        </p>
      </div>
    </div>
  )
}
