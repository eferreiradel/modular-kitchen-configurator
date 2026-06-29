'use client'

import { useTranslations } from 'next-intl'
import { useKitchenStore, MAX_MODULES, EXCLUSIVE_TYPES } from '@/modules/store'
import { ModulePlaceholder } from './ModulePlaceholder'
import type { ModuleType } from '@/types/configurator'

export function AddModuleOverlay() {
  const t = useTranslations('configurator')
  const { view, modules, addModule, setView } = useKitchenStore()

  if (view !== 'add') return null

  const present = new Set(modules.map((m) => m.type))
  const atMax = modules.length >= MAX_MODULES

  const buildRow = (type: ModuleType) => {
    const excl = EXCLUSIVE_TYPES.has(type) && present.has(type)
    const disabled = excl || atMax
    const subline = excl
      ? t('rules.alreadyPlaced', { label: t(`types.${type}.label`) })
      : atMax
      ? t('rules.maxModules')
      : t(`types.${type}.desc`)
    return { type, label: t(`types.${type}.label`), subline, disabled, placed: excl }
  }

  const baseTypes = (['base', 'drawer'] as ModuleType[]).map(buildRow)
  const exclTypes = (['cooktop', 'oven', 'fridge'] as ModuleType[]).map(buildRow)

  return (
    <div
      onClick={() => setView('overview')}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(30,30,28,0.2)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 380,
          maxHeight: '84vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 18,
          background: 'rgba(252,252,250,0.86)',
          backdropFilter: 'blur(30px) saturate(1.3)',
          WebkitBackdropFilter: 'blur(30px) saturate(1.3)',
          border: '1px solid rgba(0,0,0,0.10)',
          boxShadow: '0 34px 80px -34px rgba(40,38,32,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
          overflow: 'hidden',
          animation: 'ksRise 0.32s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* ── Head ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 20px 16px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 22, color: '#1a1a18', lineHeight: 1 }}>
              {t('ui.addModule')}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.42)' }}>
              {t('ui.appendedTo', { count: modules.length })}
            </span>
          </div>
          <button
            onClick={() => setView('overview')}
            aria-label={t('ui.close')}
            style={{
              width: 32, height: 32, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(0,0,0,0.12)', borderRadius: '50%',
              background: 'rgba(0,0,0,0.045)', color: 'rgba(0,0,0,0.6)',
              fontSize: 15, cursor: 'pointer',
            }}
          >✕</button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 24px' }}>

          {/* Cabinet section */}
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
            marginBottom: 12,
          }}>
            {t('ui.cabinetUnlimited')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {baseTypes.map((row) => (
              <AddRow key={row.type} {...row} onAdd={() => addModule(row.type)} placedLabel={t('ui.placed')} />
            ))}
          </div>

          {/* Fixtures section */}
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
            marginBottom: 12,
          }}>
            {t('ui.fixturesMax1')}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {exclTypes.map((row) => (
              <AddRow key={row.type} {...row} onAdd={() => addModule(row.type)} placedLabel={t('ui.placed')} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function AddRow({
  type, label, subline, disabled, placed, placedLabel, onAdd,
}: {
  type: ModuleType
  label: string
  subline: string
  disabled: boolean
  placed: boolean
  placedLabel: string
  onAdd: () => void
}) {
  return (
    <button
      onClick={disabled ? undefined : onAdd}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        textAlign: 'left',
        padding: '12px 14px',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 13,
        background: disabled ? 'rgba(0,0,0,0.02)' : 'rgba(0,0,0,0.035)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{ flexShrink: 0, width: 46, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ModulePlaceholder type={type} mode="plan" />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: 3, minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13.5, fontWeight: 450, color: '#1a1a18' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 11, color: 'rgba(0,0,0,0.42)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subline}</span>
      </span>
      {placed
        ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', flexShrink: 0 }}>{placedLabel}</span>
        : !disabled && <span style={{ fontSize: 18, color: '#5a7a00', flexShrink: 0 }}>+</span>
      }
    </button>
  )
}
