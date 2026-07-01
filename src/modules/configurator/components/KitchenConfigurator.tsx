'use client'

import { Scene } from '@/modules/scene'
import { ConfigBar } from './ConfigBar'

export function KitchenConfigurator() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Scene />
      <ConfigBar />
    </div>
  )
}
