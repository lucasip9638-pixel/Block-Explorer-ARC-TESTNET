"use client"

export function ArcBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Decorative elements - Blue theme */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/6 rounded-full blur-3xl" />
      
      {/* Gradient overlays for depth - Blue theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/4 to-blue-600/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-background/40" />
    </div>
  )
}

