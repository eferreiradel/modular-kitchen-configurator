'use client'

import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import * as THREE from 'three'
import type { KitchenModule } from '@/types/configurator'

export const MODULE_WIDTH = 0.6

type GLTFResult = GLTF & {
  nodes: {
    mod_base_: THREE.Mesh
    mod_drawer: THREE.Mesh
  }
  materials: {}
}

const DEBUG_COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c']

interface Props {
  module: KitchenModule
  index: number
  moduleWidth: number
  selected?: boolean
}

export function KitchenModuleUnit({ module, index, moduleWidth }: Props) {
  const { nodes } = useGLTF('/scene.glb') as GLTFResult
  const color = DEBUG_COLORS[index % DEBUG_COLORS.length]

  return (
    <group position={[index * moduleWidth, 0, 0]} dispose={null}>
      <mesh
        geometry={nodes.mod_base_.geometry}
        position={[0, 1, 0]}
        visible={module.type === 'base'}
      >
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh
        geometry={nodes.mod_drawer.geometry}
        position={[0, 1, 0]}
        visible={module.type === 'drawer'}
      >
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

useGLTF.preload('/scene.glb')
