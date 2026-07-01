import type {
  ModuleType,
  ModuleTypeMeta,
  FinishOption,
  HandleOption,
  TopFinishOption,
  TopFinishId,
} from '@/types/configurator'

export const MODULE_ORDER: ModuleType[] = [
  'base', 'drawer', /* 'cooktop', */ /* 'oven', */ 'fridge', 'grill',
]

export const TYPES: Record<ModuleType, ModuleTypeMeta> = {
  base:    { label: 'Base',    desc: 'Empty cabinet · 2 doors',       exclusive: false },
  drawer:  { label: 'Drawer',  desc: '3-drawer unit',                 exclusive: false },
  cooktop: { label: 'Cooktop', desc: '2 or 4 burner',                  exclusive: true  },
  oven:    { label: 'Oven',    desc: 'Built-in oven',                  exclusive: true  },
  fridge:  { label: 'Fridge',  desc: 'Integrated refrigerator',        exclusive: true  },
  grill:   { label: 'Grill',   desc: 'Built-in grill',                 exclusive: true  },
}

export const FINISHES: FinishOption[] = [
  { id: 'lac-w', label: 'Laccato bianco', sw: '#ecebe4', panel: '#e4e2d8', top: '#f1efe6', stroke: '#33312b' },
  { id: 'lac-g', label: 'Laccato grigio', sw: '#bcbcb4', panel: '#b4b4ab', top: '#c8c8bf', stroke: '#33332c' },
  { id: 'lac-s', label: 'Laccato salvia', sw: '#b6c2ad', panel: '#aab79f', top: '#c2cdb6', stroke: '#2b3526' },
  { id: 'lac-b', label: 'Laccato blu',    sw: '#9fb1c2', panel: '#92a6ba', top: '#aebecd', stroke: '#1f2d3a' },
  { id: 'lac-t', label: 'Laccato terra',  sw: '#cba98a', panel: '#c19e7c', top: '#d6b596', stroke: '#3a2a1c' },
  { id: 'oak',   label: 'Rovere naturale',sw: 'linear-gradient(135deg,#c8a070,#a87c4e)', panel: '#bb9264', top: '#cba373', stroke: '#3a2a18' },
  { id: 'marmo', label: 'Marmo',          sw: 'radial-gradient(circle at 35% 30%,#fff,#dad8d3)', panel: '#e6e3dd', top: '#f0eee9', stroke: '#33312b' },
]

export const TOP_FINISHES: TopFinishOption[] = [
  { id: 'marmo-b',      label: 'Marmo bianco',    color: '#e8e6e0', sw: 'radial-gradient(circle at 35% 30%, #fff, #d8d5cf)' },
  { id: 'marmo-n',      label: 'Marmo nero',       color: '#2c2c2a', sw: 'radial-gradient(circle at 35% 30%, #3a3a38, #1a1a18)' },
  { id: 'granito',      label: 'Granito antracite',color: '#3e3d3b', sw: 'radial-gradient(circle at 40% 40%, #4a4845, #2e2d2b)' },
  { id: 'cemento',      label: 'Cemento',          color: '#9a9890', sw: '#9a9890' },
  { id: 'acciaio',      label: 'Acciaio inox',     color: '#c8c6c2', sw: 'linear-gradient(135deg, #d4d2ce, #b8b6b2)' },
  { id: 'porcellanato', label: 'Porcellanato',     color: '#f0ede6', sw: '#f0ede6' },
]

export const DEFAULT_TOP_FINISH: TopFinishId = 'marmo-b'

export function topFinishById(id: string): TopFinishOption {
  return TOP_FINISHES.find((t) => t.id === id) ?? TOP_FINISHES[0]
}

export const HANDLES: HandleOption[] = [
  { id: 'vista',     label: 'A vista',     desc: 'Visible bar handle' },
  { id: 'scomparsa', label: 'A scomparsa', desc: 'Recessed grip'      },
  { id: 'gola',      label: 'Gola',        desc: 'Integrated groove'  },
]

export function finishById(id: string): FinishOption {
  return FINISHES.find((f) => f.id === id) ?? FINISHES[0]
}
