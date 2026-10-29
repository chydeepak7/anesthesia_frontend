'use client'

import { useState, useRef } from 'react'
import Header from '@/components/Header'
import PatientForm from '@/components/PatientForm'
import CategorySection from '@/components/CategorySection'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import EmptyState from '@/components/EmptyState'
import { calculateDosage } from '@/lib/api'
import { DosageResult, PatientForm as PatientFormType } from '@/lib/types'
import {
  AlertCircle, Search, Filter, ChevronDown,
  Shield, Activity, BookOpen, Layers
} from 'lucide-react'

type FilterMode = 'all' | string

export default function HomePage() {
  const [result, setResult] = useState<DosageResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<FilterMode>('all')
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (form: PatientFormType) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setSearchQuery('')
    setActiveCategory('all')

    try {
      const data = await calculateDosage(form)
      setResult(data)
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { errors?: Record<string, string[]> } }; message?: string }
      if (axiosErr.response?.data?.errors) {
        const msgs = Object.values(axiosErr.response.data.errors).flat()
        setError(msgs.join(' '))
      } else {
        setError('Failed to connect to server. Please ensure the backend is running on port 8000.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setSearchQuery('')
    setActiveCategory('all')
  }

  // Filter logic
  const filteredCategories = result?.categories.map(cat => ({
    ...cat,
    drugs: cat.drugs.filter(d => {
      const q = searchQuery.toLowerCase()
      if (!q) return true
      return (
        d.name.toLowerCase().includes(q) ||
        d.generic_name.toLowerCase().includes(q) ||
        d.drug_class.toLowerCase().includes(q) ||
        d.indications.toLowerCase().includes(q)
      )
    }),
  })).filter(cat =>
    cat.drugs.length > 0 &&
    (activeCategory === 'all' || cat.category_name === activeCategory)
  ) ?? []

  const totalFiltered = filteredCategories.reduce((acc, c) => acc + c.drugs.length, 0)

  return (
    <div className="min-h-screen bg-[#0a0f1e]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero section - only when no results */}
        {!result && !loading && (
          <div className="text-center mb-10 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/20 bg-sky-500/5 text-sky-400 text-xs font-medium mb-5">
              <Activity className="w-3.5 h-3.5" />
              Precision Anesthesia Dosing
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Calculate <span className="gradient-text">Drug Dosages</span>
              <br />for Your Patient
            </h1>
            <p className="text-[#64748b] text-sm max-w-xl mx-auto leading-relaxed">
              Age-, weight-, and sex-adjusted dosages for all major anesthetic agents.
              Designed for MD Anesthesiologists — covering induction agents, opioids,
              NMBs, vasopressors, and more.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                { icon: <Shield className="w-3.5 h-3.5" />, text: '30+ drugs' },
                { icon: <Layers className="w-3.5 h-3.5" />, text: '10 categories' },
                { icon: <Activity className="w-3.5 h-3.5" />, text: 'IBW / ABW dosing' },
                { icon: <BookOpen className="w-3.5 h-3.5" />, text: 'Clinical notes' },
              ].map((f, i) => (
                <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs text-[#64748b] border border-[#1e2d45] bg-[#111827]">
                  <span className="text-sky-400/60">{f.icon}</span>
                  {f.text}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6">
          {/* Left panel - form */}
          <div className="lg:sticky lg:top-24 lg:h-fit space-y-4">
            <PatientForm
              onSubmit={handleSubmit}
              loading={loading}
              onReset={handleReset}
              hasResults={!!result}
            />

            {/* Patient summary inline on desktop when results shown */}
            {result && (
              <div className="glass rounded-2xl p-4 border border-[#1e2d45] animate-fade-in">
                <div className="text-xs text-[#475569] mb-3 uppercase tracking-wider font-medium flex items-center gap-1.5">
                  <Activity className="w-3 h-3" />
                  Current Profile
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Age', value: `${result.patient.age}y` },
                    { label: 'Sex', value: result.patient.sex === 'male' ? '♂ M' : '♀ F' },
                    { label: 'Weight', value: `${result.patient.weight}kg` },
                    { label: 'Height', value: `${result.patient.height}cm` },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-[#0a0f1e] rounded-lg p-2 text-center border border-[#1e2d45]">
                      <div className="text-[10px] text-[#475569]">{label}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{value}</div>
                    </div>
                  ))}
                </div>
                {/* Body metrics row */}
                <div className="mt-2 grid grid-cols-3 gap-2">
                  <div className="bg-[#0a0f1e] rounded-lg p-2 text-center border border-[#1e2d45]">
                    <div className="text-[10px] text-[#475569]">BMI</div>
                    <div className="text-sm font-bold text-white mt-0.5">{result.patient.bmi}</div>
                  </div>
                  <div className="bg-[#0a0f1e] rounded-lg p-2 text-center border border-[#1e2d45]">
                    <div className="text-[10px] text-[#475569]">IBW</div>
                    <div className="text-sm font-bold text-white mt-0.5">{result.patient.ibw ?? '—'} kg</div>
                  </div>
                  <div className="bg-[#0a0f1e] rounded-lg p-2 text-center border border-[#1e2d45]">
                    <div className="text-[10px] text-[#475569]">LBW</div>
                    <div className="text-sm font-bold text-white mt-0.5">{result.patient.lbw ?? '—'} kg</div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-xs text-sky-400">{result.patient.age_group} Protocol</span>
                  <span className="text-xs text-[#475569]"> · {result.total_drugs} drugs shown</span>
                </div>
              </div>
            )}
          </div>

          {/* Right panel - results */}
          <div ref={resultsRef} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/5 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-400">Connection Error</p>
                  <p className="text-xs text-red-400/70 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && <LoadingSkeleton />}

            {/* Results */}
            {result && !loading && (
              <>
                {/* Search & filter bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search drugs, classes, indications..."
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111827] border border-[#1e2d45]
                        text-sm text-white placeholder-[#475569]
                        focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                    />
                  </div>

                  {/* Category filter */}
                  <div className="relative">
                    <select
                      value={activeCategory}
                      onChange={e => setActiveCategory(e.target.value)}
                      className="appearance-none pl-9 pr-8 py-2.5 rounded-xl bg-[#111827] border border-[#1e2d45]
                        text-sm text-white focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                    >
                      <option value="all">All Categories</option>
                      {result.categories.map(c => (
                        <option key={c.category_id} value={c.category_name}>
                          {c.category_icon} {c.category_name}
                        </option>
                      ))}
                    </select>
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569] pointer-events-none" />
                  </div>
                </div>

                {/* Results count */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#475569]">
                    Showing <span className="text-sky-400 font-semibold">{totalFiltered}</span> drug{totalFiltered !== 1 ? 's' : ''}
                    {searchQuery && <span> matching &quot;<span className="text-white">{searchQuery}</span>&quot;</span>}
                  </div>
                  {(searchQuery || activeCategory !== 'all') && (
                    <button
                      onClick={() => { setSearchQuery(''); setActiveCategory('all') }}
                      className="text-xs text-[#475569] hover:text-white transition-colors"
                    >
                      Clear filters
                    </button>
                  )}
                </div>

                {/* Drug categories */}
                {filteredCategories.length > 0 ? (
                  <div className="space-y-4">
                    {filteredCategories.map((cat, i) => (
                      <CategorySection
                        key={cat.category_id}
                        category={cat}
                        defaultOpen={i < 3}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    message="No drugs found"
                    hint={searchQuery
                      ? `No drugs match "${searchQuery}". Try a different search term.`
                      : 'No applicable drugs for these patient parameters.'
                    }
                  />
                )}

                {/* Footer disclaimer */}
                <div className="mt-8 p-4 rounded-xl border border-[#1e2d45] bg-[#111827]">
                  <p className="text-[11px] text-[#475569] leading-relaxed text-center">
                    <strong className="text-[#64748b]">⚕️ Clinical Disclaimer:</strong> Dosage recommendations are for
                    guidance only. Always verify with current formulary references, consider patient-specific factors
                    (comorbidities, organ function, drug interactions), and apply clinical judgment.
                    This tool does not replace clinical training and decision-making.
                  </p>
                </div>
              </>
            )}

            {/* Welcome state */}
            {!result && !loading && !error && (
              <div className="hidden lg:flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-sky-500/10 to-indigo-500/10
                  border border-sky-500/10 flex items-center justify-center mb-6 animate-pulse-ring">
                  <Activity className="w-10 h-10 text-sky-400/40" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Ready to Calculate</h3>
                <p className="text-sm text-[#475569] max-w-sm">
                  Enter patient age, sex, weight and height in the form to see
                  all applicable anesthetic drugs with IBW-adjusted calculated dosages.
                </p>
                <div className="mt-6 text-xs text-[#2a3f5f]">← Enter patient details to begin</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
