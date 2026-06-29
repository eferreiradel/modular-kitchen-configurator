'use client'

import type { ModuleType } from '@/types/configurator'

const ICONS: Record<ModuleType, string> = {
  base:    '▭',
  drawer:  '☰',
  cooktop: '⊕',
  oven:    '▣',
  fridge:  '▬',
  grill:   '▦',
}

interface Props {
  type: ModuleType
  mode: 'plan' | 'elevation' | 'detail'
  stroke?: string
  style?: React.CSSProperties
  className?: string
}

export function ModulePlaceholder({ type, mode, stroke = '#33312b', style, className }: Props) {
  const icon = ICONS[type]
  const size = mode === 'detail' ? 64 : mode === 'elevation' ? 32 : 20

  return (
    <span
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: stroke,
        fontSize: size,
        lineHeight: 1,
        opacity: 0.7,
        ...style,
      }}
      aria-hidden
    >
      {icon}
    </span>
  )
}
