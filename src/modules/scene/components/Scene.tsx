'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { GLTF } from 'three-stdlib'
import { useKitchenStore } from '@/modules/store'
import { KitchenModuleUnit } from './KitchenModuleUnit'

type GLTFResult = GLTF & {
  nodes: { mod_base_: THREE.Mesh; mod_drawer: THREE.Mesh }
  materials: {}
}

function ModulesGroup() {
  const { modules, selectedId } = useKitchenStore()
  const { nodes } = useGLTF('/scene.glb') as GLTFResult

  // Calcola larghezza reale della mesh dalla bounding box
  const geo = nodes.mod_base_.geometry
  if (!geo.boundingBox) geo.computeBoundingBox()
  const box = geo.boundingBox!
  const moduleWidth = box.max.x - box.min.x

  const totalWidth = modules.length * moduleWidth
  const offsetX = -totalWidth / 2 + moduleWidth / 2

  return (
    <group position={[offsetX, 0, 0]}>
      {modules.map((mod, i) => (
        <KitchenModuleUnit
          key={mod.id}
          module={mod}
          index={i}
          moduleWidth={moduleWidth}
          selected={mod.id === selectedId}
        />
      ))}
    </group>
  )
}

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
        <ModulesGroup />
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
