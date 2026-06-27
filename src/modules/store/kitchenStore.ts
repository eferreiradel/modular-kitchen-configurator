import { create } from 'zustand'
import type {
  KitchenModule,
  ModuleType,
  ConfigView,
  FinishId,
  HandleId,
  WorktopId,
  BurnersCount,
  FuelType,
  OvenFinish,
  FridgeHeight,
} from '@/types/configurator'

export const MAX_MODULES = 6

let _counter = 0
function makeModule(type: ModuleType): KitchenModule {
  _counter += 1
  return {
    id: 'm' + _counter,
    type,
    finish: 'lac-w',
    handle: 'scomparsa',
    burners: '4',
    fuel: 'induzione',
    ovenFinish: 'acciaio',
    fridgeHeight: 'standard',
  }
}

const initial: KitchenModule[] = [
  makeModule('base'),
  makeModule('cooktop'),
  makeModule('sink'),
  makeModule('base'),
]

type ModuleCfgKey = 'finish' | 'handle' | 'burners' | 'fuel' | 'ovenFinish' | 'fridgeHeight'
type ModuleCfgVal = FinishId | HandleId | BurnersCount | FuelType | OvenFinish | FridgeHeight

interface KitchenState {
  view: ConfigView
  modules: KitchenModule[]
  selectedId: string
  worktop: WorktopId

  selectModule: (id: string) => void
  setModuleCfg: (key: ModuleCfgKey, value: ModuleCfgVal) => void
  setType: (type: ModuleType) => void
  addModule: (type: ModuleType) => void
  setWorktop: (id: WorktopId) => void
  setView: (view: ConfigView) => void
}

export const useKitchenStore = create<KitchenState>((set, get) => ({
  view: 'overview',
  modules: initial,
  selectedId: initial[1].id,
  worktop: 'q-bianco',

  selectModule: (id) => set({ selectedId: id }),

  setModuleCfg: (key, value) =>
    set((s) => ({
      modules: s.modules.map((m) =>
        m.id === s.selectedId ? { ...m, [key]: value } : m
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

  setWorktop: (id) => set({ worktop: id }),

  setView: (view) => set({ view }),
}))

export const EXCLUSIVE_TYPES = new Set<ModuleType>(['sink', 'cooktop', 'oven', 'fridge'])
