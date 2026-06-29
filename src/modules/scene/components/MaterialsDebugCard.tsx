'use client'

import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'

export function MaterialsDebugCard() {
  const { materials, nodes } = useGLTF('/scene.glb')

  const materialNames = Object.keys(materials)
  const nodeNames = Object.keys(nodes)

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 22,
        left: 28,
        zIndex: 5,
        width: 260,
        maxHeight: '50vh',
        overflowY: 'auto',
        padding: 14,
        borderRadius: 12,
        background: 'rgba(20,20,18,0.82)',
        backdropFilter: 'blur(10px)',
        color: '#f2f1ed',
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        lineHeight: 1.6,
      }}
    >
      <div style={{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, opacity: 0.6 }}>
        scene.glb — materials ({materialNames.length})
      </div>
      {materialNames.length === 0 && <div style={{ opacity: 0.5 }}>nessun materiale</div>}
      {materialNames.map((name) => {
        const mat = materials[name] as THREE.MeshStandardMaterial
        const hex = mat.color ? `#${mat.color.getHexString()}` : '#888'
        return (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: hex, flexShrink: 0, border: '1px solid rgba(255,255,255,0.2)' }} />
            <span>{name}</span>
          </div>
        )
      })}

      <div style={{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '12px 0 8px', opacity: 0.6 }}>
        nodes ({nodeNames.length})
      </div>
      {nodeNames.map((name) => (
        <div key={name} style={{ opacity: 0.75 }}>{name}</div>
      ))}
    </div>
  )
}
