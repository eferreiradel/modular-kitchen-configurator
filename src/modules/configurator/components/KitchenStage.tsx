'use client'

import { useTranslations } from 'next-intl'
import { useKitchenStore } from '@/modules/store'
import { finishById, worktopById } from '../data'
import { STAGE_LEFT, STAGE_TOP, STAGE_BOTTOM, STAGE_RIGHT_CLEARANCE, MODULE_GAP } from '../layout'
import { ModulePlaceholder } from './ModulePlaceholder'
import type { ModuleType } from '@/types/configurator'

export function KitchenStage() {
  const t = useTranslations('configurator')
  const { view, modules, selectedId, worktop, selectModule, setView } = useKitchenStore()
  const wt = worktopById(worktop)
  const selMod = modules.find((m) => m.id === selectedId) ?? null

  function moduleLabel(type: ModuleType, idxAmongType: number) {
    return `${t(`types.${type}.label`)} ${String(idxAmongType).padStart(2, '0')}`
  }

  // ── Detail view ──────────────────────────────────────────────
  if (view === 'detail' && selMod) {
    const fin = finishById(selMod.finish)
    const idxAmongType = modules.filter((m) => m.type === selMod.type).findIndex((m) => m.id === selMod.id) + 1

    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          paddingTop: STAGE_TOP,
          paddingBottom: STAGE_BOTTOM,
          paddingLeft: STAGE_LEFT,
          paddingRight: STAGE_RIGHT_CLEARANCE,
          zIndex: 2,
        }}
      >
        <div className="flex flex-col items-center gap-6 animate-rise">
          <div
            className="relative flex items-center justify-center rounded-2xl"
            style={{
              width: 520,
              height: 360,
              background: `linear-gradient(180deg, ${fin.top} 0%, ${fin.panel} 100%)`,
              boxShadow: '0 40px 80px -42px rgba(40,38,32,0.28), inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
          >
            <ModulePlaceholder type={selMod.type} mode="detail" stroke={fin.stroke} style={{ width: 430, height: 300 }} />
            <span className="absolute top-4 left-4 font-mono text-[9.5px] tracking-[0.16em] uppercase text-black/40">
              {t('ui.interiorOpen')}
            </span>
          </div>
          <span className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-black/50">
            {moduleLabel(selMod.type, idxAmongType)} — {t(`finishes.${selMod.finish}`)}
          </span>
        </div>
      </div>
    )
  }

  // ── Overview ─────────────────────────────────────────────────
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        paddingTop: STAGE_TOP,
        paddingBottom: STAGE_BOTTOM,
        paddingLeft: STAGE_LEFT,
        paddingRight: STAGE_RIGHT_CLEARANCE,
        zIndex: 2,
      }}
    >
      <div className="relative flex items-end justify-center" style={{ gap: MODULE_GAP }}>
        {/* worktop slab — si estende oltre i bordi del gruppo */}
        <div
          className="absolute top-0 h-[15px] rounded-lg z-[3]"
          style={{
            left: -MODULE_GAP,
            right: -MODULE_GAP,
            background: `linear-gradient(180deg, ${wt.top} 0%, ${wt.sw} 100%)`,
            boxShadow: '0 3px 14px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.35)',
          }}
        />

        {modules.map((mod) => {
          const fin = finishById(mod.finish)
          const idxAmongType = modules.slice(0, modules.indexOf(mod) + 1).filter((m) => m.type === mod.type).length
          const label = moduleLabel(mod.type, idxAmongType)
          const sel = mod.id === selectedId

          return (
            <button
              key={mod.id}
              onClick={() => {
                selectModule(mod.id)
                if (view === 'detail') setView('overview')
              }}
              className="relative flex-none border-0 bg-transparent cursor-pointer flex flex-col items-center gap-3 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ transform: sel ? 'translateY(-14px)' : 'translateY(0)' }}
            >
              <div
                className="relative mt-2 rounded-b-lg flex items-end justify-center"
                style={{
                  width: 96,
                  height: 230,
                  background: `linear-gradient(180deg, ${fin.top} 0%, ${fin.panel} 100%)`,
                  boxShadow: sel
                    ? '0 26px 44px -26px rgba(40,38,32,0.22), 0 0 0 1.5px #96d200, 0 0 26px -4px rgba(150,210,0,0.45)'
                    : '0 18px 40px -28px rgba(40,38,32,0.2), inset 0 1px 0 rgba(255,255,255,0.55)',
                }}
              >
                <ModulePlaceholder
                  type={mod.type}
                  mode="elevation"
                  stroke={fin.stroke}
                  style={{ width: 92, height: 222 }}
                />
              </div>
              <span
                className="font-mono text-[9px] tracking-[0.12em] uppercase"
                style={{ color: sel ? '#5a7a00' : 'rgba(0,0,0,0.46)' }}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
