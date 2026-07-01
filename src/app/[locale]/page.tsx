'use client'

import dynamic from 'next/dynamic'

const KitchenConfigurator = dynamic(
  () => import('@/modules/configurator').then((m) => m.KitchenConfigurator),
  { ssr: false }
)

export default function Page() {
  return <KitchenConfigurator />
}
