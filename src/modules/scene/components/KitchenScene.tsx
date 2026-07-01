/*
Base generata da: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 public/scene.glb --output src/modules/scene/components/KitchenScene.tsx --types
*/

'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { useGLTF, useTexture } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { useKitchenStore } from '@/modules/store'
import { finishById, topFinishById } from '@/modules/configurator/data'
import type { KitchenModule, ModuleType } from '@/types/configurator'

/** Matcap per il metallo del lavello */
const SINK_METAL_MATCAP = '/matcaps/sink-metal.png'

/** Matcap per il corpo cabinet (base/drawer/cooktop/oven) */
const BODY_METAL_MATCAP = '/matcaps/base_metal.jpg'

type GLTFResult = GLTF & {
  nodes: {
    base: THREE.Mesh
    base_1: THREE.Mesh
    drawer: THREE.Mesh
    drawer_1: THREE.Mesh
    mod_sink_off: THREE.Mesh
    sink_on: THREE.Mesh
    sink_on_1: THREE.Mesh
    sink_on_2: THREE.Mesh
    sink_on_3: THREE.Mesh
    fridge: THREE.Mesh
    fridge_1: THREE.Mesh
    fridge_3: THREE.Mesh
    fridge_4: THREE.Mesh
    fridge_5: THREE.Mesh
    fridge_6: THREE.Mesh
    grill: THREE.Mesh
    grill_1: THREE.Mesh
    grill_2: THREE.Mesh
    grill_3: THREE.Mesh
    grill_4: THREE.Mesh
    grill_5: THREE.Mesh
    grill_6: THREE.Mesh
    grill_7: THREE.Mesh
    grill_8: THREE.Mesh
    grill_9: THREE.Mesh
  }
  materials: {
    [name: string]: THREE.MeshStandardMaterial
  }
}

type NodeKey = keyof GLTFResult['nodes']

const TOP_MATERIAL_PREFIX = 'mat_top_'

export interface TopMaterialOption {
  id: string
  colorHex: string
}

function topMaterialOptions(materials: GLTFResult['materials']): TopMaterialOption[] {
  return Object.keys(materials)
    .filter((name) => name.startsWith(TOP_MATERIAL_PREFIX))
    .map((name) => ({
      id: name.slice(TOP_MATERIAL_PREFIX.length),
      colorHex: `#${(materials[name] as THREE.MeshStandardMaterial).color.getHexString()}`,
    }))
}

export function useTopMaterialOptions(): TopMaterialOption[] {
  const { materials } = useGLTF('/scene.glb') as unknown as GLTFResult
  return useMemo(() => topMaterialOptions(materials), [materials])
}

const ROW_Y = 0
const ROW_Z = 0

/**
 * Mesh del corpo del modulo, escluso il piano di lavoro.
 * cooktop/oven sono placeholder che riusano il cabinet "base".
 */
const BODY_KEYS_BY_TYPE: Record<ModuleType, NodeKey[]> = {
  base:    ['base', 'base_1'],
  drawer:  ['drawer', 'drawer_1'],
  cooktop: ['base', 'base_1'],
  oven:    ['base', 'base_1'],
  fridge:  ['fridge', 'fridge_1', 'fridge_3', 'fridge_4', 'fridge_5', 'fridge_6'],
  grill:   ['grill', 'grill_1', 'grill_2', 'grill_3', 'grill_4', 'grill_5', 'grill_6', 'grill_7', 'grill_8', 'grill_9'],
}

/** Tipi che montano mod_sink_off come piano liscio */
const HAS_SMOOTH_TOP = new Set<ModuleType>(['base', 'drawer', 'cooktop', 'oven'])

/** fridge/grill hanno materiali compositi propri del .blend */
const BODY_USES_OWN_MATERIAL = new Set<ModuleType>(['fridge', 'grill'])

/** Mesh del piano di lavoro integrato nel modello — riceve topColor invece del materiale nativo */
const TOP_KEY_BY_TYPE: Partial<Record<ModuleType, NodeKey>> = {
  fridge: 'fridge_6',
}

const SINK_CAPABLE_TYPES = new Set<ModuleType>(['base', 'drawer', 'cooktop', 'oven'])

function showsSink(module: KitchenModule): boolean {
  return SINK_CAPABLE_TYPES.has(module.type) && module.hasSink
}

/** Offset del gruppo sink_on rispetto all'origine del modulo base, ricavato dal .blend */
const SINK_ON_OFFSET: [number, number, number] = [-0.025, 0.727, 0.126]

interface ModuleBBox {
  width: number
  depth: number
  height: number
  offsetX: number
  offsetZ: number
}

function moduleBBox(geometries: THREE.BufferGeometry[]): ModuleBBox {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity
  for (const geo of geometries) {
    if (!geo.boundingBox) geo.computeBoundingBox()
    const box = geo.boundingBox!
    minX = Math.min(minX, box.min.x)
    maxX = Math.max(maxX, box.max.x)
    minY = Math.min(minY, box.min.y)
    maxY = Math.max(maxY, box.max.y)
    minZ = Math.min(minZ, box.min.z)
    maxZ = Math.max(maxZ, box.max.z)
  }
  return { width: maxX - minX, depth: maxZ - minZ, height: maxY - minY, offsetX: -minX, offsetZ: ROW_Z - minZ }
}

function SinkOn({
  nodes, materials, topColor,
}: {
  nodes: GLTFResult['nodes']
  materials: GLTFResult['materials']
  topColor: string
}) {
  const metalMatcap = useTexture(SINK_METAL_MATCAP)
  const bodyMatcap = useTexture(BODY_METAL_MATCAP)
  return (
    <group position={SINK_ON_OFFSET}>
      {/* vasca */}
      <mesh geometry={nodes.sink_on.geometry} material={materials.sink} />
      {/* pannello top forato — stesso materiale del piano liscio */}
      <mesh geometry={nodes.sink_on_1.geometry}>
        <meshMatcapMaterial matcap={bodyMatcap} color={topColor} />
      </mesh>
      {/* rubinetteria */}
      <mesh geometry={nodes.sink_on_2.geometry} material={materials['Outdoor_Kitchen_02_Material #137']} />
      <mesh geometry={nodes.sink_on_3.geometry}>
        <meshMatcapMaterial matcap={metalMatcap} />
      </mesh>
    </group>
  )
}

function ModuleInstance({
  module, nodes, materials, x, offsetX, offsetZ, frontColor, topColor,
}: {
  module: KitchenModule
  nodes: GLTFResult['nodes']
  materials: GLTFResult['materials']
  x: number
  offsetX: number
  offsetZ: number
  frontColor: string
  topColor: string
}) {
  const bodyKeys = BODY_KEYS_BY_TYPE[module.type].filter((key) => nodes[key] != null)
  const useOwnMaterial = BODY_USES_OWN_MATERIAL.has(module.type)
  const bodyMatcap = useTexture(BODY_METAL_MATCAP)
  const hasSmoothTop = HAS_SMOOTH_TOP.has(module.type) && nodes.mod_sink_off != null

  return (
    <group position={[x, ROW_Y, 0]}>
      <group position={[offsetX, 0, offsetZ]}>
        {/* corpo: ante e struttura */}
        {bodyKeys.map((key) => {
          const isTopMesh = TOP_KEY_BY_TYPE[module.type] === key
          return (
            <mesh key={key} geometry={nodes[key].geometry} material={useOwnMaterial && !isTopMesh ? nodes[key].material : undefined}>
              {(!useOwnMaterial || isTopMesh) && (
                <meshMatcapMaterial matcap={bodyMatcap} color={isTopMesh ? topColor : frontColor} />
              )}
            </mesh>
          )
        })}
        {/* piano liscio (mod_sink_off) — visibile solo quando !hasSink */}
        {hasSmoothTop && !module.hasSink && (
          <mesh geometry={nodes.mod_sink_off.geometry}>
            <meshMatcapMaterial matcap={bodyMatcap} color={topColor} />
          </mesh>
        )}
        {/* piano forato con lavello (sink_on) — visibile solo quando hasSink */}
        {showsSink(module) && (
          <SinkOn nodes={nodes} materials={materials} topColor={topColor} />
        )}
      </group>
    </group>
  )
}

export function KitchenScene() {
  const modules = useKitchenStore((s) => s.modules)
  const selectedId = useKitchenStore((s) => s.selectedId)
  const globalFinish = useKitchenStore((s) => s.globalFinish)
  const globalTopFinish = useKitchenStore((s) => s.globalTopFinish)
  const { nodes, materials } = useGLTF('/scene.glb') as unknown as GLTFResult

  const frontColor = useMemo(() => finishById(globalFinish).panel, [globalFinish])
  const topColor = useMemo(() => topFinishById(globalTopFinish).color, [globalTopFinish])

  const bboxByType = useMemo(() => {
    const result = {} as Record<ModuleType, ModuleBBox>
    for (const type of Object.keys(BODY_KEYS_BY_TYPE) as ModuleType[]) {
      const allKeys = HAS_SMOOTH_TOP.has(type as ModuleType)
        ? [...BODY_KEYS_BY_TYPE[type], 'mod_sink_off' as NodeKey]
        : BODY_KEYS_BY_TYPE[type]
      const geometries = allKeys
        .filter((key) => nodes[key] != null)
        .map((key) => nodes[key].geometry)
      result[type] = moduleBBox(geometries)
    }
    return result
  }, [nodes])

  const totalWidth = modules.reduce((sum, mod) => sum + bboxByType[mod.type].width, 0)

  // calcola posizioni una volta sola così il piano indicatore conosce x e width del modulo selezionato
  const positions = useMemo(() => {
    let cursor = -totalWidth / 2
    return modules.map((mod) => {
      const { width, depth, height, offsetX, offsetZ } = bboxByType[mod.type]
      const x = cursor
      cursor += width
      return { id: mod.id, x, width, depth, height, offsetX, offsetZ }
    })
  }, [modules, bboxByType, totalWidth])

  const selPos = positions.find((p) => p.id === selectedId)

  return (
    <group>
      {/* wireframe bbox del modulo selezionato */}
      {selPos && (
        <lineSegments position={[selPos.x + selPos.width / 2, selPos.height / 2, selPos.depth / 2]}>
          <edgesGeometry args={[new THREE.BoxGeometry(selPos.width, selPos.height, selPos.depth)]} />
          <lineBasicMaterial color="#76ff00" />
        </lineSegments>
      )}

      {positions.map(({ id, x, offsetX, offsetZ }) => {
        const mod = modules.find((m) => m.id === id)!
        return (
          <ModuleInstance
            key={id}
            module={mod}
            nodes={nodes}
            materials={materials}
            x={x}
            offsetX={offsetX}
            offsetZ={offsetZ}
            frontColor={frontColor}
            topColor={topColor}
          />
        )
      })}
    </group>
  )
}

if (typeof window !== 'undefined') {
  useGLTF.preload('/scene.glb')
  useTexture.preload(SINK_METAL_MATCAP)
  useTexture.preload(BODY_METAL_MATCAP)
}
