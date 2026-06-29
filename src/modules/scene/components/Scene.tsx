'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { KitchenModules } from './KitchenModules'

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 3.5], fov: 45 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      shadows
      style={{ width: '100%', height: '100%' }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[3, 6, 4]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <Environment preset="apartment" />
        <KitchenModules />
        <OrbitControls
          enablePan={false}
          minDistance={1.5}
          maxDistance={6}
          maxPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Canvas>
  )
}
