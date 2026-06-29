'use client'

import { useTranslations } from 'next-intl'
import { useKitchenStore } from '@/modules/store'
import { Scene, MaterialsDebugCard } from '@/modules/scene'
import { MIN_HEIGHT, STAGE_RIGHT_CLEARANCE, DOCK_INSET_RIGHT } from '../layout'
import { ConfigDock } from './ConfigDock'
import { AddModuleOverlay } from './AddModuleOverlay'

export function KitchenConfigurator() {
  const t = useTranslations('configurator')
  const modules = useKitchenStore((s) => s.modules)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: MIN_HEIGHT,
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
        color: '#1c1c1a',
        background: 'radial-gradient(135% 100% at 50% 16%, #fcfcfb 0%, #efeee9 50%, #e1e0d9 100%)',
      }}
    >
      {/* ── Canvas 3D — occupa tutto tranne il dock a destra ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          right: STAGE_RIGHT_CLEARANCE,
        }}
      >
        <Scene />
      </div>

      {/* ── HUD top-left ── */}
      <div
        style={{
          position: 'absolute',
          top: 22,
          left: 28,
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 21, letterSpacing: '0.01em', color: '#1a1a18' }}>
          {t('hud.brand')}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.42)' }}>
          {t('hud.subtitle', { count: modules.length })}
        </span>
      </div>

      {/* ── Debug materiali/nodi del glb ── */}
      <MaterialsDebugCard />

      {/* ── Config dock ── */}
      <ConfigDock />

      {/* ── Add module overlay ── */}
      <AddModuleOverlay />
    </div>
  )
}
