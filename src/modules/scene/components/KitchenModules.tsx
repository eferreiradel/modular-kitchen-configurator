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
    mod_sink: THREE.Mesh
    mod_grill: THREE.Mesh
  }
  materials: {}
}

/** Posizione fissa (y, z) della fila di moduli, presa dal layout del .blend */
const ROW_Y = 0.00201454758644104
const ROW_Z = -0.28728562593460083

/** Offset Y del lavello rispetto al top del modulo base, ricavato dalle posizioni assolute nel .blend */
const SINK_Y_OFFSET = 0.7029218673706055 - ROW_Y

function moduleMesh(nodes: GLTFResult['nodes'], type: KitchenModule['type']) {
  // cooktop/oven/fridge non hanno ancora una mesh dedicata: usano il base come placeholder
  if (type === 'drawer') return nodes.mod_drawer
  if (type === 'grill') return nodes.mod_grill
  return nodes.mod_base
}

const GOLDEN_ANGLE = 137.508

/** Colore stabile per id ma ben distinto da modulo a modulo (golden-angle hue stepping) */
function colorForId(id: string) {
  const n = parseInt(id.replace(/\D/g, ''), 10) || 0
  const hue = (n * GOLDEN_ANGLE) % 360
  return new THREE.Color().setHSL(hue / 360, 0.55, 0.6)
}

function ModuleUnit({ module, nodes, x, offsetX }: { module: KitchenModule; nodes: GLTFResult['nodes']; x: number; offsetX: number }) {
  const mesh = moduleMesh(nodes, module.type)
  const color = useMemo(() => colorForId(module.id), [module.id])

  return (
    <group position={[x, ROW_Y, ROW_Z]}>
      <mesh geometry={mesh.geometry} position={[offsetX, 0, 0]}>
        <meshStandardMaterial color={color} />
        {module.hasSink && (
          <mesh geometry={nodes.mod_sink.geometry} material={nodes.mod_sink.material} position={[0, SINK_Y_OFFSET, 0]} />
        )}
      </mesh>
    </group>
  )
}

interface BoundingBoxX {
  width: number
  /** quanto traslare la mesh perché il bordo sinistro della sua bbox coincida con x=0 locale */
  offsetX: number
}

function boundingBoxX(geometry: THREE.BufferGeometry): BoundingBoxX {
  if (!geometry.boundingBox) geometry.computeBoundingBox()
  const box = geometry.boundingBox!
  return { width: box.max.x - box.min.x, offsetX: -box.min.x }
}

export function KitchenModules() {
  const modules = useKitchenStore((s) => s.modules)
  const { nodes } = useGLTF('/scene.glb') as unknown as GLTFResult

  // bbox per tipo, ricavata dalla mesh corrispondente — non assume geometrie centrate
  // (i tipi senza mesh dedicata oggi usano mod_base come placeholder)
  const bboxByType = useMemo<Record<ModuleType, BoundingBoxX>>(() => {
    const base = boundingBoxX(nodes.mod_base.geometry)
    const drawer = boundingBoxX(nodes.mod_drawer.geometry)
    const grill = boundingBoxX(nodes.mod_grill.geometry)
    return {
      base,
      drawer,
      cooktop: base,
      oven: base,
      fridge: base,
      grill,
    }
  }, [nodes])

  // i moduli successivi compaiono adiacenti a quello precedente, riga centrata sull'origine
  const totalWidth = modules.reduce((sum, mod) => sum + bboxByType[mod.type].width, 0)
  let cursor = -totalWidth / 2

  return (
    <group>
      {modules.map((mod) => {
        const { width, offsetX } = bboxByType[mod.type]
        const x = cursor
        cursor += width
        return <ModuleUnit key={mod.id} module={mod} nodes={nodes} x={x} offsetX={offsetX} />
      })}
    </group>
  )
}

useGLTF.preload('/scene.glb')
