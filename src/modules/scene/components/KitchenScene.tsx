/*
Base generata da: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/scene.glb --output src/modules/scene/components/KitchenScene.tsx --types
*/

'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useKitchenStore } from '@/modules/store'
import type { KitchenModule, ModuleType } from '@/types/configurator'

type GLTFResult = GLTF & {
  nodes: {
    mod_base: THREE.Mesh
    mod_drawer: THREE.Mesh
    sink: THREE.Mesh
    sink_1: THREE.Mesh
    sink_2: THREE.Mesh
    sink_3: THREE.Mesh
    mod_grill: THREE.Mesh
    mod_sink_off: THREE.Mesh
    mod_sink_on: THREE.Mesh
  }
  materials: {
    SinkMetal: THREE.MeshStandardMaterial
    FaucetMetal: THREE.MeshStandardMaterial
    FaucetRubber: THREE.MeshStandardMaterial
    FaucetMesh: THREE.MeshStandardMaterial
  }
}

/** Materiale condiviso del pannello superiore (top standard o con cutout lavello) — stesso per entrambi, distinto dall'hardware del lavello */
const PANEL_COLOR = '#e4e2d8'

/** Posizione fissa (y, z) della fila di moduli, presa dal layout del .blend */
const ROW_Y = 0.00201454758644104
const ROW_Z = -0.28728562593460083

/**
 * Unica mappa di controllo: tipo modulo → mesh "corpo" da usare.
 * cooktop/oven/fridge non hanno ancora una mesh dedicata: usano mod_base come placeholder.
 */
const BODY_KEY_BY_TYPE: Record<ModuleType, 'mod_base' | 'mod_drawer' | 'mod_grill'> = {
  base: 'mod_base',
  drawer: 'mod_drawer',
  cooktop: 'mod_base',
  oven: 'mod_base',
  fridge: 'mod_base',
  grill: 'mod_grill',
}

const GOLDEN_ANGLE = 137.508

/** Colore stabile per id ma ben distinto da modulo a modulo (golden-angle hue stepping) */
function colorForId(id: string) {
  const n = parseInt(id.replace(/\D/g, ''), 10) || 0
  const hue = (n * GOLDEN_ANGLE) % 360
  return new THREE.Color().setHSL(hue / 360, 0.55, 0.6)
}

interface ModuleBBox {
  width: number
  offsetX: number
  offsetZ: number
}

function moduleBBox(geometry: THREE.BufferGeometry): ModuleBBox {
  if (!geometry.boundingBox) geometry.computeBoundingBox()
  const box = geometry.boundingBox!
  const centerZ = (box.min.z + box.max.z) / 2
  return { width: box.max.x - box.min.x, offsetX: -box.min.x, offsetZ: ROW_Z - centerZ }
}

/** Hardware del lavello: rubinetto + vasca metallica — materiali propri, non quelli del pannello */
function SinkHardware({ nodes, materials }: { nodes: GLTFResult['nodes']; materials: GLTFResult['materials'] }) {
  return (
    <group>
      <mesh geometry={nodes.sink_1.geometry} material={materials.FaucetRubber} />
      <mesh geometry={nodes.sink_3.geometry} material={materials.SinkMetal} />
    </group>
  )
}

function ModuleInstance({
  module, nodes, materials, x, offsetX, offsetZ,
}: {
  module: KitchenModule
  nodes: GLTFResult['nodes']
  materials: GLTFResult['materials']
  x: number
  offsetX: number
  offsetZ: number
}) {
  const body = nodes[BODY_KEY_BY_TYPE[module.type]]
  const color = useMemo(() => colorForId(module.id), [module.id])

  // il corpo mod_base è privo di top: serve sempre una delle due superfici (sink on/off)
  const showCap = body === nodes.mod_base
  const panel = module.hasSink ? nodes.mod_sink_on : nodes.mod_sink_off

  return (
    <group position={[x, ROW_Y, 0]}>
      <mesh geometry={body.geometry} position={[offsetX, 0, offsetZ]}>
        <meshStandardMaterial color={color} />
        {showCap && (
          <>
            <mesh geometry={panel.geometry}>
              <meshStandardMaterial color={PANEL_COLOR} />
            </mesh>
            {module.hasSink && <SinkHardware nodes={nodes} materials={materials} />}
          </>
        )}
      </mesh>
    </group>
  )
}

export function KitchenScene() {
  const modules = useKitchenStore((s) => s.modules)
  const { nodes, materials } = useGLTF('/scene.glb') as unknown as GLTFResult

  // bbox per tipo, derivata da BODY_KEY_BY_TYPE — niente liste manuali da tenere sincronizzate
  const bboxByType = useMemo(() => {
    const cache = new Map<string, ModuleBBox>()
    const result = {} as Record<ModuleType, ModuleBBox>
    for (const type of Object.keys(BODY_KEY_BY_TYPE) as ModuleType[]) {
      const bodyKey = BODY_KEY_BY_TYPE[type]
      if (!cache.has(bodyKey)) cache.set(bodyKey, moduleBBox(nodes[bodyKey].geometry))
      result[type] = cache.get(bodyKey)!
    }
    return result
  }, [nodes])

  // i moduli successivi compaiono adiacenti a quello precedente, riga centrata sull'origine
  const totalWidth = modules.reduce((sum, mod) => sum + bboxByType[mod.type].width, 0)
  let cursor = -totalWidth / 2

  return (
    <group>
      {modules.map((mod) => {
        const { width, offsetX, offsetZ } = bboxByType[mod.type]
        const x = cursor
        cursor += width
        return (
          <ModuleInstance
            key={mod.id}
            module={mod}
            nodes={nodes}
            materials={materials}
            x={x}
            offsetX={offsetX}
            offsetZ={offsetZ}
          />
        )
      })}
    </group>
  )
}

useGLTF.preload('/scene.glb')
