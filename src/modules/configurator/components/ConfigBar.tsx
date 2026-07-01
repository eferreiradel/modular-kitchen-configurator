'use client'

import { useTranslations } from 'next-intl'
import { useKitchenStore, MAX_MODULES, EXCLUSIVE_TYPES } from '@/modules/store'
import { FINISHES, HANDLES, MODULE_ORDER, TOP_FINISHES } from '../data'

const S = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20,
} as const

export function ConfigBar() {
  const t = useTranslations('configurator')
  const {
    modules, selectedId, globalFinish, globalTopFinish,
    selectModule, setModuleCfg, setHasSink, setType, setFinish, setTopFinish, addModule, removeModule,
  } = useKitchenStore()
  const selIdx = modules.findIndex((m) => m.id === selectedId)
  const selMod = modules[selIdx] ?? null

  const isLast = selIdx === modules.length - 1
  const canAdd = modules.length < MAX_MODULES
  const nextIsAdd = isLast && canAdd

  const goPrev = () => selIdx > 0 && selectModule(modules[selIdx - 1].id)
  const goNext = () => {
    if (nextIsAdd) addModule('base')
    else if (!isLast) selectModule(modules[selIdx + 1].id)
  }

  if (!selMod) return null

  const typeOptions = MODULE_ORDER.map((type) => {
    const usedElse = EXCLUSIVE_TYPES.has(type) && modules.some((m) => m.id !== selectedId && m.type === type)
    return { id: type, on: selMod.type === type, usedElse }
  })

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 22,
        zIndex: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: S.md,
        pointerEvents: 'none',
      }}
    >
      <NavButton onClick={goPrev} disabled={selIdx <= 0} label="‹" />

      <div
        style={{
          pointerEvents: 'auto',
          width: 'min(880px, calc(100vw - 140px))',
          maxHeight: '40vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.78)',
          backdropFilter: 'blur(26px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(26px) saturate(1.3)',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 20px 50px -28px rgba(40,38,32,0.22), inset 0 1px 0 rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* Head */}
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          padding: `${S.md}px ${S.lg}px`, borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 18, color: '#1a1a18' }}>
            {t(`types.${selMod.type}.label`)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: S.md }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'rgba(0,0,0,0.4)' }}>
              {selIdx + 1} / {modules.length}
            </span>
            <button
              onClick={() => removeModule(selMod.id)}
              disabled={modules.length <= 1}
              aria-label={t('ui.removeModule')}
              title={t('ui.removeModule')}
              style={{
                width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(0,0,0,0.1)', borderRadius: '50%',
                background: 'rgba(0,0,0,0.035)', color: 'rgba(180,40,40,0.85)',
                fontSize: 13, cursor: modules.length <= 1 ? 'not-allowed' : 'pointer',
                opacity: modules.length <= 1 ? 0.35 : 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Sections row */}
        <div style={{ flex: 1, overflowX: 'auto', display: 'flex', gap: S.xl, padding: `${S.lg}px` }}>

          <Section label={t('ui.moduleType')}>
            <div style={{ display: 'flex', gap: S.sm, flexWrap: 'wrap', width: 160 }}>
              {typeOptions.map((opt) => (
                <Pill
                  key={opt.id}
                  on={opt.on}
                  disabled={opt.usedElse}
                  onClick={() => !opt.usedElse && setType(opt.id)}
                >
                  {t(`types.${opt.id}.label`)}
                </Pill>
              ))}
            </div>
          </Section>

          {(selMod.type === 'base' || selMod.type === 'drawer') && (
            <Section label={t('sink.title')}>
              <button
                onClick={() => setHasSink(!selMod.hasSink)}
                style={{
                  display: 'flex', alignItems: 'center', gap: S.sm,
                  padding: `${S.sm}px ${S.md}px`,
                  border: 0, borderRadius: 11, cursor: 'pointer',
                  background: selMod.hasSink ? 'rgba(150,210,0,0.16)' : 'rgba(0,0,0,0.035)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{
                  width: 30, height: 17, flexShrink: 0, borderRadius: 9999, padding: 2,
                  display: 'flex', alignItems: 'center',
                  justifyContent: selMod.hasSink ? 'flex-end' : 'flex-start',
                  background: selMod.hasSink ? '#bef000' : 'rgba(0,0,0,0.15)',
                }}>
                  <span style={{ width: 13, height: 13, borderRadius: '50%', background: '#fff' }} />
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12.5, color: '#1c1c1a' }}>
                  {t('sink.add')}
                </span>
              </button>
            </Section>
          )}

          <Section label={<>{t('ui.frontFinish')} <span style={{ color: 'rgba(0,0,0,0.3)' }}>{t('ui.worktopGlobal')}</span></>}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S.sm, width: 130 }}>
              {FINISHES.map((f) => {
                const on = globalFinish === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setFinish(f.id)}
                    title={t(`finishes.${f.id}`)}
                    style={{
                      width: 22, height: 22, borderRadius: '50%',
                      border: '1px solid rgba(0,0,0,0.18)', cursor: 'pointer',
                      background: f.sw,
                      boxShadow: on ? '0 0 0 1.5px #f2f1ed, 0 0 0 3px #96d200' : 'none',
                    }}
                  />
                )
              })}
            </div>
          </Section>


          <Section label={<>{t('ui.worktop')} <span style={{ color: 'rgba(0,0,0,0.3)' }}>{t('ui.worktopGlobal')}</span></>}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S.sm, width: 130 }}>
              {TOP_FINISHES.map((f) => {
                const on = globalTopFinish === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setTopFinish(f.id)}
                    title={f.label}
                    style={{
                      width: 22, height: 22, borderRadius: 6,
                      border: '1px solid rgba(0,0,0,0.18)', cursor: 'pointer',
                      background: f.sw,
                      boxShadow: on ? '0 0 0 1.5px #f2f1ed, 0 0 0 3px #96d200' : 'none',
                    }}
                  />
                )
              })}
            </div>
          </Section>




        </div>
      </div>

      <NavButton onClick={goNext} disabled={isLast && !canAdd} label={nextIsAdd ? '+' : '›'} highlight={nextIsAdd} />
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────

function NavButton({ onClick, disabled, label, highlight }: { onClick: () => void; disabled: boolean; label: string; highlight?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        pointerEvents: 'auto',
        flexShrink: 0,
        width: 44, height: 44,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '50%',
        border: highlight ? '1px solid rgba(110,150,0,0.65)' : '1px solid rgba(0,0,0,0.1)',
        background: highlight ? '#bef000' : 'rgba(255,255,255,0.85)',
        color: highlight ? '#1a2a00' : 'rgba(0,0,0,0.7)',
        fontSize: 18,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        boxShadow: '0 10px 24px -14px rgba(40,38,32,0.3)',
      }}
    >
      {label}
    </button>
  )
}

function Section({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>
        {label}
      </span>
      {children}
    </div>
  )
}

function Pill({ on, disabled, onClick, children }: { on: boolean; disabled: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '5px 10px',
        border: on ? '1px solid rgba(110,150,0,0.65)' : '1px solid rgba(0,0,0,0.08)',
        borderRadius: 9999, cursor: disabled ? 'not-allowed' : 'pointer',
        background: on ? 'rgba(150,210,0,0.18)' : 'rgba(0,0,0,0.035)',
        opacity: disabled ? 0.4 : 1,
        fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 500,
        color: on ? '#1a1a18' : 'rgba(0,0,0,0.62)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

function SegRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 48, fontFamily: 'var(--font-sans)', fontSize: 10.5, color: 'rgba(0,0,0,0.46)', flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', gap: 4 }}>{children}</div>
    </div>
  )
}

function SegBtn({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px', border: 0, borderRadius: 9999,
        fontFamily: 'var(--font-sans)', fontSize: 10.5, fontWeight: 600,
        cursor: 'pointer',
        background: on ? '#bef000' : 'rgba(0,0,0,0.06)',
        color: on ? '#1a2a00' : 'rgba(0,0,0,0.62)',
      }}
    >
      {children}
    </button>
  )
}
