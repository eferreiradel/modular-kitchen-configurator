export type ModuleType = 'base' | 'drawer'  | 'oven' | 'fridge' | 'grill'

export type TopFinishId = 'marmo-b' | 'marmo-n' | 'granito' | 'cemento' | 'acciaio' | 'porcellanato'

export interface TopFinishOption {
  id: TopFinishId
  label: string
  color: string
  sw: string
}

export type FinishId =
  | 'lac-w' | 'lac-g' | 'lac-s' | 'lac-b' | 'lac-t' | 'oak' | 'marmo'

export type HandleId = 'vista' | 'scomparsa' | 'gola'

export type BurnersCount = '2' | '4'
export type FuelType = 'gas' | 'induzione'
export type OvenFinish = 'acciaio' | 'nero'
export type FridgeHeight = 'standard' | 'tall'

export type ConfigView = 'overview' | 'add' | 'detail'

export interface KitchenModule {
  id: string
  type: ModuleType
  handle: HandleId
  burners: BurnersCount
  fuel: FuelType
  ovenFinish: OvenFinish
  fridgeHeight: FridgeHeight
  hasSink: boolean
}

export interface ModuleTypeMeta {
  label: string
  desc: string
  exclusive: boolean
}

export interface FinishOption {
  id: FinishId
  label: string
  sw: string
  panel: string
  top: string
  stroke: string
}

export interface HandleOption {
  id: HandleId
  label: string
  desc: string
}
