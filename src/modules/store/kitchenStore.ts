import { create } from 'zustand'
import type {
  KitchenModule,
  ModuleType,
  ConfigView,
  FinishId,
  HandleId,
  BurnersCount,
  FuelType,
  OvenFinish,
  FridgeHeight,
  TopFinishId,
} from '@/types/configurator'
import { DEFAULT_TOP_FINISH } from '@/modules/configurator/data'

export const DEFAULT_FINISH: FinishId = 'lac-w'

export const MAX_MODULES = 6

let _counter = 0
function makeModule(type: ModuleType): KitchenModule {
  _counter += 1
  return {
    id: 'm' + _counter,
    type,
    handle: 'scomparsa',
    burners: '4',
    fuel: 'induzione',
    ovenFinish: 'acciaio',
    fridgeHeight: 'standard',
    hasSink: false,
  }
}

const initial: KitchenModule[] = [
  makeModule('base'),
  makeModule('base'),
  makeModule('base'),
  makeModule('base'),
]

type ModuleCfgKey = 'handle' | 'burners' | 'fuel' | 'ovenFinish' | 'fridgeHeight'
type ModuleCfgVal = HandleId | BurnersCount | FuelType | OvenFinish | FridgeHeight

interface KitchenState {
  view: ConfigView
  modules: KitchenModule[]
  selectedId: string
  globalFinish: FinishId
  globalTopFinish: TopFinishId

  selectModule: (id: string) => void
  setModuleCfg: (key: ModuleCfgKey, value: ModuleCfgVal) => void
  setHasSink: (value: boolean) => void
  setType: (type: ModuleType) => void
  addModule: (type: ModuleType) => void
  removeModule: (id: string) => void
  setFinish: (id: FinishId) => void
  setTopFinish: (id: TopFinishId) => void
  setView: (view: ConfigView) => void
}

export const useKitchenStore = create<KitchenState>((set, get) => ({
  view: 'overview',
  modules: initial,
  selectedId: initial[1].id,
  globalFinish: DEFAULT_FINISH,
  globalTopFinish: DEFAULT_TOP_FINISH,

  selectModule: (id) => set({ selectedId: id }),

  setModuleCfg: (key, value) =>
    set((s) => ({
      modules: s.modules.map((m) =>
        m.id === s.selectedId ? { ...m, [key]: value } : m
      ),
    })),

  setHasSink: (value) =>
    set((s) => ({
      modules: s.modules.map((m) =>
        m.id === s.selectedId ? { ...m, hasSink: value } : m
      ),
    })),

  setType: (type) =>
    set((s) => {
      const sel = s.modules.find((m) => m.id === s.selectedId)
      if (!sel || sel.type === type) return {}
      const isExclusive = EXCLUSIVE_TYPES.has(type)
      if (isExclusive && s.modules.some((m) => m.id !== sel.id && m.type === type)) return {}
      return {
        modules: s.modules.map((m) =>
          m.id === s.selectedId ? { ...m, type } : m
        ),
      }
    }),

  addModule: (type) => {
    const s = get()
    if (s.modules.length >= MAX_MODULES) return
    const isExclusive = EXCLUSIVE_TYPES.has(type)
    if (isExclusive && s.modules.some((m) => m.type === type)) return
    const m = makeModule(type)
    set((s) => ({ modules: [...s.modules, m], selectedId: m.id, view: 'overview' }))
  },

  removeModule: (id) => {
    const s = get()
    if (s.modules.length <= 1) return
    const idx = s.modules.findIndex((m) => m.id === id)
    if (idx === -1) return
    const modules = s.modules.filter((m) => m.id !== id)
    const nextSelected = s.selectedId === id
      ? modules[Math.min(idx, modules.length - 1)].id
      : s.selectedId
    set({ modules, selectedId: nextSelected })
  },

  setFinish: (id) => set({ globalFinish: id }),

  setTopFinish: (id) => set({ globalTopFinish: id }),

  setView: (view) => set({ view }),
}))

export const EXCLUSIVE_TYPES = new Set<ModuleType>(['oven', 'fridge', 'grill'])
