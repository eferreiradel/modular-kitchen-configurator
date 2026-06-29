'use client'

import { useTranslations } from 'next-intl'
import { useKitchenStore, MAX_MODULES, EXCLUSIVE_TYPES } from '@/modules/store'
import { FINISHES, HANDLES, WORKTOPS, MODULE_ORDER, finishById, worktopById } from '../data'
import { DOCK_INSET_RIGHT } from '../layout'
import { ModulePlaceholder } from './ModulePlaceholder'
import { useTopMaterialVariants } from '@/modules/scene'
import type { ModuleType } from '@/types/configurator'

const S = {
  // Spacing scale (px)
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xl2: 24,
  xl3: 32,
} as const

export function ConfigDock() {
  const t = useTranslations('configurator')
  const {
    view, modules, selectedId, worktop, topMaterial,
    selectModule, setModuleCfg, setHasSink, setType, setWorktop, setTopMaterial, setView,
  } = useKitchenStore()

  const topMaterials = useTopMaterialVariants()
  const selMod = modules.find((m) => m.id === selectedId) ?? null
  const selIdx = selMod ? modules.indexOf(selMod) + 1 : 0
  const selSeen = selMod
    ? modules.filter((m) => m.type === selMod.type).findIndex((m) => m.id === selMod.id) + 1
    : 0
  const selTitle = selMod
    ? `${t(`types.${selMod.type}.label`)} ${String(selSeen).padStart(2, '0')}`
    : '—'

  const typeOptions = MODULE_ORDER.map((type) => {
    const on = !!selMod && selMod.type === type
    const usedElse = EXCLUSIVE_TYPES.has(type) && modules.some((m) => m.id !== selectedId && m.type === type)
    return { id: type as ModuleType, label: t(`types.${type}.label`), on, usedElse }
  })

  const segBtn = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px',
    border: 0,
    borderRadius: 9999,
    fontFamily: 'var(--font-sans)',
    fontSize: 11,
    fontWeight: 600,
    cursor: 'pointer',
    background: active ? '#bef000' : 'rgba(0,0,0,0.06)',
    color: active ? '#1a2a00' : 'rgba(0,0,0,0.62)',
  })

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: DOCK_INSET_RIGHT,
        zIndex: 6,
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          pointerEvents: 'auto',
          width: 308,
          maxHeight: '84vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(26px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(26px) saturate(1.3)',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 20px 50px -28px rgba(40,38,32,0.18), inset 0 1px 0 rgba(255,255,255,0.05)',
          overflow: 'hidden',
        }}
      >
        {/* ── Head ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${S.lg}px ${S.xl}px`,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: S.sm }}>
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: '#bef000',
              boxShadow: '0 0 8px 1px rgba(190,240,0,0.6)',
              flexShrink: 0,
            }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.5)' }}>
              {t('ui.configure')}
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'rgba(0,0,0,0.4)' }}>
            {selIdx} / {modules.length}
          </span>
        </div>

        {/* ── Scrollable body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: `${S.lg}px ${S.xl}px ${S.xl}px` }}>

          {/* Sequence label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: S.md }}>
            <Label>{t('ui.sequence')}</Label>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'rgba(0,0,0,0.3)' }}>
              {t('ui.alphaVersion', { count: modules.length })}
            </span>
          </div>

          {/* Sequence chips */}
          <div style={{ display: 'flex', gap: S.sm, overflowX: 'auto', paddingBottom: S.sm }}>
            {modules.map((m) => {
              const idxAmongType = modules.slice(0, modules.indexOf(m) + 1).filter((x) => x.type === m.type).length
              const sel = m.id === selectedId
              return (
                <button
                  key={m.id}
                  onClick={() => selectModule(m.id)}
                  title={`${t(`types.${m.type}.label`)} ${String(idxAmongType).padStart(2, '0')}`}
                  style={{
                    flexShrink: 0,
                    width: 58,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: S.xs,
                    padding: `${S.sm}px ${S.xs}px`,
                    border: sel ? '1px solid rgba(110,150,0,0.65)' : '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 10,
                    background: sel ? 'rgba(150,210,0,0.16)' : 'rgba(0,0,0,0.035)',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: 42, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ModulePlaceholder type={m.type} mode="plan" stroke={sel ? 'rgba(110,150,0,0.95)' : 'rgba(0,0,0,0.55)'} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.04em', textTransform: 'uppercase', color: sel ? '#5a7a00' : 'rgba(0,0,0,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 50 }}>
                    {t(`types.${m.type}.label`)}
                  </span>
                </button>
              )
            })}
            {modules.length < MAX_MODULES && (
              <button
                onClick={() => setView('add')}
                aria-label={t('ui.addModule')}
                style={{
                  flexShrink: 0,
                  width: 40,
                  alignSelf: 'stretch',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed rgba(100,150,0,0.55)',
                  borderRadius: 10,
                  background: 'rgba(150,210,0,0.1)',
                  color: '#5a7a00',
                  fontSize: 18,
                  cursor: 'pointer',
                }}
              >+</button>
            )}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(0,0,0,0.08)', margin: `${S.lg}px 0` }} />

          {/* Selected title */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: S.xl }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 23, color: '#1a1a18', lineHeight: 1 }}>{selTitle}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: 'rgba(0,0,0,0.4)' }}>
              {selMod ? t('ui.module', { type: selMod.type }) : ''}
            </span>
          </div>

          {/* Module type */}
          <Section label={t('ui.moduleType')}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: S.sm }}>
              {typeOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => !opt.usedElse && setType(opt.id)}
                  disabled={opt.usedElse}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: S.xs, padding: `${S.md}px ${S.xs}px`,
                    border: opt.on ? '1px solid rgba(110,150,0,0.65)' : '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 11, cursor: opt.usedElse ? 'not-allowed' : 'pointer',
                    background: opt.on ? 'rgba(150,210,0,0.18)' : 'rgba(0,0,0,0.035)',
                    opacity: opt.usedElse ? 0.4 : 1,
                  }}
                >
                  <span style={{ width: 40, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ModulePlaceholder type={opt.id} mode="plan" stroke={opt.on ? 'rgba(110,150,0,0.95)' : 'rgba(0,0,0,0.6)'} />
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10.5, fontWeight: 500, color: opt.on ? '#1a1a18' : 'rgba(0,0,0,0.62)' }}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </Section>

          {/* Sink */}
          {selMod?.type === 'base' && (
            <Section label={t('sink.title')}>
              <button
                onClick={() => setHasSink(!selMod.hasSink)}
                style={{
                  display: 'flex', alignItems: 'center', gap: S.md,
                  width: '100%', textAlign: 'left',
                  padding: `${S.md}px ${S.md}px`,
                  border: 0, borderRadius: 11, cursor: 'pointer',
                  background: selMod.hasSink ? 'rgba(150,210,0,0.16)' : 'rgba(0,0,0,0.035)',
                }}
              >
                <span style={{
                  width: 32, height: 18, flexShrink: 0, borderRadius: 9999, padding: 2,
                  display: 'flex', alignItems: 'center',
                  justifyContent: selMod.hasSink ? 'flex-end' : 'flex-start',
                  background: selMod.hasSink ? '#bef000' : 'rgba(0,0,0,0.15)',
                }}>
                  <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff' }} />
                </span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 450, color: '#1c1c1a' }}>
                  {t('sink.add')}
                </span>
              </button>
            </Section>
          )}

          {/* Front finish */}
          <Section label={t('ui.frontFinish')}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S.sm }}>
              {FINISHES.map((f) => {
                const on = selMod?.finish === f.id
                return (
                  <button
                    key={f.id}
                    onClick={() => setModuleCfg('finish', f.id)}
                    title={t(`finishes.${f.id}`)}
                    style={{
                      width: 26, height: 26, borderRadius: '50%',
                      border: '1px solid rgba(0,0,0,0.18)', cursor: 'pointer',
                      background: f.sw,
                      boxShadow: on ? '0 0 0 1.5px #f2f1ed, 0 0 0 3px #96d200' : 'none',
                    }}
                  />
                )
              })}
            </div>
            <p style={{ marginTop: S.sm, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(0,0,0,0.46)' }}>
              {selMod ? t(`finishes.${selMod.finish}`) : ''}
            </p>
          </Section>

          {/* Handle */}
          <Section label={t('ui.handle')}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {HANDLES.map((h) => {
                const on = selMod?.handle === h.id
                return (
                  <button
                    key={h.id}
                    onClick={() => setModuleCfg('handle', h.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: S.md,
                      width: '100%', textAlign: 'left',
                      padding: `${S.md}px ${S.md}px`,
                      border: 0, borderRadius: 11, cursor: 'pointer',
                      background: on ? 'rgba(0,0,0,0.05)' : 'transparent',
                    }}
                  >
                    <span style={{
                      width: 16, height: 16, flexShrink: 0, borderRadius: '50%',
                      border: `1.5px solid ${on ? '#96d200' : 'rgba(0,0,0,0.3)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {on && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#bef000' }} />}
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 450, color: '#1c1c1a' }}>{t(`handles.${h.id}.label`)}</span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'rgba(0,0,0,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t(`handles.${h.id}.desc`)}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Worktop */}
          <Section label={<>{t('ui.worktop')} <span style={{ color: 'rgba(0,0,0,0.3)' }}>{t('ui.worktopGlobal')}</span></>}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: S.sm }}>
              {WORKTOPS.map((w) => {
                const on = worktop === w.id
                return (
                  <button
                    key={w.id}
                    onClick={() => setWorktop(w.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: S.sm,
                      padding: `${S.sm + 2}px ${S.md}px`,
                      border: on ? '1px solid rgba(110,150,0,0.65)' : '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 11, cursor: 'pointer',
                      background: on ? 'rgba(150,210,0,0.16)' : 'rgba(0,0,0,0.035)',
                    }}
                  >
                    <span style={{ width: 16, height: 16, flexShrink: 0, borderRadius: 5, border: '1px solid rgba(0,0,0,0.18)', background: w.sw }} />
                    <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 500, color: 'rgba(0,0,0,0.78)', lineHeight: 1.05 }}>{t(`worktops.${w.id}`)}</span>
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Top material — globale, generato dai materiali mat_top_* del .blend */}
          <Section label={<>{t('ui.topMaterial')} <span style={{ color: 'rgba(0,0,0,0.3)' }}>{t('ui.worktopGlobal')}</span></>}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: S.sm }}>
              {topMaterials.map((id) => {
                const on = topMaterial === id
                return (
                  <button
                    key={id}
                    onClick={() => setTopMaterial(id)}
                    style={{
                      padding: '6px 12px',
                      border: on ? '1px solid rgba(110,150,0,0.65)' : '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 9999, cursor: 'pointer',
                      background: on ? 'rgba(150,210,0,0.18)' : 'rgba(0,0,0,0.035)',
                      fontFamily: 'var(--font-sans)', fontSize: 11.5, fontWeight: 500,
                      color: on ? '#1a1a18' : 'rgba(0,0,0,0.62)',
                    }}
                  >
                    {id}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Cooktop */}
          {selMod?.type === 'cooktop' && (
            <Section label={t('cooktop.title')}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: S.sm }}>
                <SegRow label={t('cooktop.burners')}>
                  {(['2', '4'] as const).map((n) => (
                    <button key={n} onClick={() => setModuleCfg('burners', n)} style={segBtn(selMod.burners === n)}>{n}</button>
                  ))}
                </SegRow>
                <SegRow label={t('cooktop.heat')}>
                  <button onClick={() => setModuleCfg('fuel', 'gas')} style={segBtn(selMod.fuel === 'gas')}>{t('cooktop.gas')}</button>
                  <button onClick={() => setModuleCfg('fuel', 'induzione')} style={segBtn(selMod.fuel === 'induzione')}>{t('cooktop.induction')}</button>
                </SegRow>
              </div>
            </Section>
          )}

          {/* Oven */}
          {selMod?.type === 'oven' && (
            <Section label={t('oven.title')}>
              <SegRow label={t('oven.finish')}>
                <button onClick={() => setModuleCfg('ovenFinish', 'acciaio')} style={segBtn(selMod.ovenFinish === 'acciaio')}>{t('oven.steel')}</button>
                <button onClick={() => setModuleCfg('ovenFinish', 'nero')} style={segBtn(selMod.ovenFinish === 'nero')}>{t('oven.black')}</button>
              </SegRow>
              <p style={{ marginTop: S.md, display: 'flex', alignItems: 'center', gap: S.sm, fontFamily: 'var(--font-sans)', fontSize: 11, color: 'rgba(0,0,0,0.46)' }}>
                <span style={{ color: '#5a7a00' }}>✓</span> {t('oven.pyrolysis')}
              </p>
            </Section>
          )}

          {/* Fridge */}
          {selMod?.type === 'fridge' && (
            <Section label={t('fridge.title')}>
              <SegRow label={t('fridge.height')}>
                <button onClick={() => setModuleCfg('fridgeHeight', 'standard')} style={segBtn(selMod.fridgeHeight === 'standard')}>{t('fridge.standard')}</button>
                <button onClick={() => setModuleCfg('fridgeHeight', 'tall')} style={segBtn(selMod.fridgeHeight === 'tall')}>{t('fridge.tall')}</button>
              </SegRow>
            </Section>
          )}

        </div>

        {/* ── Footer CTA ── */}
        <div style={{ padding: `${S.md}px ${S.lg}px`, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          {view !== 'detail' ? (
            <button
              onClick={() => selMod && setView('detail')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 40, border: 0, borderRadius: 9999,
                background: '#bef000', color: '#1a2a00',
                fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              {t('ui.detailView')}
            </button>
          ) : (
            <button
              onClick={() => setView('overview')}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: 40, borderRadius: 9999,
                border: '1px solid rgba(0,0,0,0.14)', background: 'rgba(0,0,0,0.045)', color: 'rgba(0,0,0,0.8)',
                fontFamily: 'var(--font-sans)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              {t('ui.backToOverview')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>
      {children}
    </span>
  )
}

function Section({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <Label>{label}</Label>
      </div>
      {children}
    </div>
  )
}

function SegRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ width: 52, fontFamily: 'var(--font-sans)', fontSize: 11, color: 'rgba(0,0,0,0.46)', flexShrink: 0 }}>{label}</span>
      <div style={{ display: 'flex', gap: 4 }}>{children}</div>
    </div>
  )
}
