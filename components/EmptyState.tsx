import { Activity, ArrowLeft } from 'lucide-react'

interface Props {
  message?: string
  hint?: string
  onBack?: () => void
}

export default function EmptyState({
  message = 'No results found',
  hint = 'Try adjusting the patient parameters',
  onBack,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-[#111827] border border-[#1e2d45] flex items-center justify-center mb-5">
        <Activity className="w-9 h-9 text-[#2a3f5f]" />
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{message}</h3>
      <p className="text-sm text-[#475569] max-w-xs">{hint}</p>
      {onBack && (
        <button
          onClick={onBack}
          className="mt-5 flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to form
        </button>
      )}
    </div>
  )
}
