export default function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass rounded-2xl border border-[#1e2d45] overflow-hidden">
          {/* Category header skeleton */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e2d45]">
            <div className="skeleton w-8 h-8 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <div className="skeleton h-4 w-40 rounded" />
              <div className="skeleton h-3 w-64 rounded" />
            </div>
          </div>
          {/* Cards */}
          <div className="px-4 pb-4 pt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="rounded-xl border border-[#1e2d45] bg-[#111827] p-4 space-y-3">
                <div className="skeleton h-4 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="skeleton h-16 rounded-xl" />
                  <div className="skeleton h-16 rounded-xl" />
                </div>
                <div className="skeleton h-3 w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
