'use client'

import { Suspense, lazy, useEffect, useState } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render anything until the component is mounted on the client
  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-white text-sm">Loading 3D Scene...</span>
        </div>
      </div>
    )
  }

  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-lg">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-white text-sm">Loading 3D Scene...</span>
          </div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
}