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
    mod_drawer_1: THREE.Mesh
    mod_drawer_2: THREE.Mesh
    sink: THREE.Mesh
    sink_1: THREE.Mesh
    mod_grill: THREE.Mesh
    mod_sink_off: THREE.Mesh
    mod_sink_on: THREE.Mesh
  }
  materials: {
    SinkMetal: THREE.MeshStandardMaterial
    FaucetRubber: THREE.MeshStandardMaterial
    [name: string]: THREE.MeshStandardMaterial
  }
}

type NodeKey = keyof GLTFResult['nodes']

/**
 * Ogni materiale del .blend con questo prefisso diventa una variante selezionabile
 * per il top nel configuratore (es. mat_top_base, mat_top_Premium, ...).
 * Per far sopravvivere all'export i materiali non ancora assegnati a geometria visibile,
 * assegnali a un nodo dummy fuori dal frustum (es. "material_placeholder") — non viene mai renderizzato qui.
 */
const TOP_MATERIAL_PREFIX = 'mat_top_'

/** Estrae le varianti disponibili (id dopo il prefisso) dai materiali caricati dal .blend */
export function topMaterialVariants(materials: GLTFResult['materials']): string[] {
  return Object.keys(materials)
    .filter((name) => name.startsWith(TOP_MATERIAL_PREFIX))
    .map((name) => name.slice(TOP_MATERIAL_PREFIX.length))
}

/** Hook riusabile fuori dal Canvas (es. nel dock) per leggere le varianti disponibili */
export function useTopMaterialVariants(): string[] {
  const { materials } = useGLTF('/scene.glb') as unknown as GLTFResult
  return useMemo(() => topMaterialVariants(materials), [materials])
}

/** Posizione fissa (y, z) della fila di moduli, presa dal layout del .blend */
const ROW_Y = 0.00201454758644104
const ROW_Z = -0.28728562593460083

/**
 * Unica mappa di controllo: tipo modulo → mesh "corpo" (frontale/struttura) da usare.
 * cooktop/oven/fridge non hanno ancora una mesh dedicata: usano mod_base come placeholder.
 */
const BODY_KEY_BY_TYPE: Record<ModuleType, NodeKey> = {
  base: 'mod_base',
  drawer: 'mod_drawer_2',
  cooktop: 'mod_base',
  oven: 'mod_base',
  fridge: 'mod_base',
  grill: 'mod_grill',
}

/**
 * Mesh "pannello" statica per tipo (top che non cambia in base a hasSink).
 * base/cooktop/oven/fridge non sono qui: il loro pannello dipende da hasSink (vedi panelKeyFor).
 * grill non ha un pannello separato: la mesh è già completa.
 */
const STATIC_PANEL_KEY_BY_TYPE: Partial<Record<ModuleType, NodeKey>> = {
  drawer: 'mod_drawer_1',
}

/** Tipi che hanno un cabinet "base" sotto: il pannello switcha tra sink on/off */
const SINK_SWAPPABLE_TYPES = new Set<ModuleType>(['base', 'cooktop', 'oven', 'fridge'])

function panelKeyFor(module: KitchenModule): NodeKey | null {
  if (SINK_SWAPPABLE_TYPES.has(module.type)) return module.hasSink ? 'mod_sink_on' : 'mod_sink_off'
  return STATIC_PANEL_KEY_BY_TYPE[module.type] ?? null
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

/** Bbox combinata di più geometrie (corpo + pannello), per non assumere che siano spazialmente identiche */
function moduleBBox(geometries: THREE.BufferGeometry[]): ModuleBBox {
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
  for (const geo of geometries) {
    if (!geo.boundingBox) geo.computeBoundingBox()
    const box = geo.boundingBox!
    minX = Math.min(minX, box.min.x)
    maxX = Math.max(maxX, box.max.x)
    minZ = Math.min(minZ, box.min.z)
    maxZ = Math.max(maxZ, box.max.z)
  }
  const centerZ = (minZ + maxZ) / 2
  return { width: maxX - minX, offsetX: -minX, offsetZ: ROW_Z - centerZ }
}

/** Hardware del lavello: rubinetto + vasca — materiali propri, non quelli del pannello */
function SinkHardware({ nodes, materials }: { nodes: GLTFResult['nodes']; materials: GLTFResult['materials'] }) {
  return (
    <group>
      <mesh geometry={nodes.sink.geometry} material={materials.FaucetRubber} />
      <mesh geometry={nodes.sink_1.geometry} material={materials.SinkMetal} />
    </group>
  )
}

function ModuleInstance({
  module, nodes, materials, topMaterialId, x, offsetX, offsetZ,
}: {
  module: KitchenModule
  nodes: GLTFResult['nodes']
  materials: GLTFResult['materials']
  topMaterialId: string
  x: number
  offsetX: number
  offsetZ: number
}) {
  const body = nodes[BODY_KEY_BY_TYPE[module.type]]
  const panelKey = panelKeyFor(module)
  const color = useMemo(() => colorForId(module.id), [module.id])
  const topMaterial = materials[TOP_MATERIAL_PREFIX + topMaterialId] ?? materials[TOP_MATERIAL_PREFIX + 'base']

  return (
    <group position={[x, ROW_Y, 0]}>
      <mesh geometry={body.geometry} position={[offsetX, 0, offsetZ]}>
        <meshStandardMaterial color={color} />
        {panelKey && (
          <mesh geometry={nodes[panelKey].geometry} material={topMaterial} />
        )}
        {panelKey === 'mod_sink_on' && <SinkHardware nodes={nodes} materials={materials} />}
      </mesh>
    </group>
  )
}

export function KitchenScene() {
  const modules = useKitchenStore((s) => s.modules)
  const topMaterialId = useKitchenStore((s) => s.topMaterial)
  const { nodes, materials } = useGLTF('/scene.glb') as unknown as GLTFResult

  // bbox per tipo: corpo + pannello statico (se c'è), il pannello on/off ha le stesse dimensioni quindi basta uno dei due come riferimento
  const bboxByType = useMemo(() => {
    const result = {} as Record<ModuleType, ModuleBBox>
    for (const type of Object.keys(BODY_KEY_BY_TYPE) as ModuleType[]) {
      const bodyKey = BODY_KEY_BY_TYPE[type]
      const panelKey = SINK_SWAPPABLE_TYPES.has(type) ? 'mod_sink_off' : STATIC_PANEL_KEY_BY_TYPE[type]
      const geometries = [nodes[bodyKey].geometry]
      if (panelKey) geometries.push(nodes[panelKey].geometry)
      result[type] = moduleBBox(geometries)
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
            topMaterialId={topMaterialId}
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
