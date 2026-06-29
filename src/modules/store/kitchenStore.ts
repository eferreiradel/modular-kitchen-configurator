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
export const DEFAULT_TOP_MATERIAL = 'base'

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
    hasSink: false,
  }
}

const initial: KitchenModule[] = [
  makeModule('base'),
  makeModule('cooktop'),
  { ...makeModule('base'), hasSink: true },
  makeModule('base'),
]

type ModuleCfgKey = 'finish' | 'handle' | 'burners' | 'fuel' | 'ovenFinish' | 'fridgeHeight'
type ModuleCfgVal = FinishId | HandleId | BurnersCount | FuelType | OvenFinish | FridgeHeight

interface KitchenState {
  view: ConfigView
  modules: KitchenModule[]
  selectedId: string
  worktop: WorktopId
  /** materiale del top, globale per tutta la cucina — non ha senso un top misto pannello per pannello */
  topMaterial: string

  selectModule: (id: string) => void
  setModuleCfg: (key: ModuleCfgKey, value: ModuleCfgVal) => void
  setHasSink: (value: boolean) => void
  setType: (type: ModuleType) => void
  addModule: (type: ModuleType) => void
  setWorktop: (id: WorktopId) => void
  setTopMaterial: (id: string) => void
  setView: (view: ConfigView) => void
}

export const useKitchenStore = create<KitchenState>((set, get) => ({
  view: 'overview',
  modules: initial,
  selectedId: initial[1].id,
  worktop: 'q-bianco',
  topMaterial: DEFAULT_TOP_MATERIAL,

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

  setWorktop: (id) => set({ worktop: id }),

  setTopMaterial: (id) => set({ topMaterial: id }),

  setView: (view) => set({ view }),
}))

export const EXCLUSIVE_TYPES = new Set<ModuleType>(['cooktop', 'oven', 'fridge', 'grill'])
