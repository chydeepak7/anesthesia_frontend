'use client'

import { useState } from 'react'
import { DrugCategory } from '@/lib/types'
import DrugCard from './DrugCard'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  category: DrugCategory
  defaultOpen?: boolean
}

export default function CategorySection({ category, defaultOpen = true }: Props) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="glass rounded-2xl border border-[#1e2d45] overflow-hidden animate-fade-in">
      {/* Category Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#1a2234]/50 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{category.category_icon}</span>
          <div className="text-left">
            <h2 className="text-sm font-bold text-white">{category.category_name}</h2>
            {category.category_description && (
              <p className="text-xs text-[#475569] mt-0.5">{category.category_description}</p>
            )}
          </div>
          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold
            bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {category.drugs.length} drug{category.drugs.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#475569]">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Drugs grid */}
      {open && (
        <div className="px-4 pb-4 pt-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 border-t border-[#1e2d45]">
          {category.drugs.map((drug, i) => (
            <DrugCard key={drug.id} drug={drug} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
