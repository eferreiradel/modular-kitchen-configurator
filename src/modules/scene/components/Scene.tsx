'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { KitchenScene } from './KitchenScene'

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 3.5], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1} />
        <directionalLight position={[3, 6, 4]} intensity={1.8} />
        <Environment preset="city" environmentIntensity={0.8} />
        <KitchenScene />
        <OrbitControls
          target={[0, 0.45, 0]}
          enablePan={false}
          minDistance={1.5}
          maxDistance={6}
          maxPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Canvas>
  )
}
