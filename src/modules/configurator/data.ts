import type {
  ModuleType,
  ModuleTypeMeta,
  FinishOption,
  HandleOption,
  WorktopOption,
} from '@/types/configurator'

export const MODULE_ORDER: ModuleType[] = [
  'base', 'drawer', 'sink', 'cooktop', 'oven', 'fridge',
]

export const TYPES: Record<ModuleType, ModuleTypeMeta> = {
  base:    { label: 'Base',    desc: 'Empty cabinet · 2 doors',       exclusive: false },
  drawer:  { label: 'Drawer',  desc: '3-drawer unit',                 exclusive: false },
  sink:    { label: 'Sink',    desc: 'Integrated basin cutout',        exclusive: true  },
  cooktop: { label: 'Cooktop', desc: '2 or 4 burner',                  exclusive: true  },
  oven:    { label: 'Oven',    desc: 'Built-in oven',                  exclusive: true  },
  fridge:  { label: 'Fridge',  desc: 'Integrated refrigerator',        exclusive: true  },
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

export const HANDLES: HandleOption[] = [
  { id: 'vista',     label: 'A vista',     desc: 'Visible bar handle' },
  { id: 'scomparsa', label: 'A scomparsa', desc: 'Recessed grip'      },
  { id: 'gola',      label: 'Gola',        desc: 'Integrated groove'  },
]

export const WORKTOPS: WorktopOption[] = [
  { id: 'q-bianco', label: 'Quarzo bianco',  sw: '#eef0ef', top: '#f6f7f6' },
  { id: 'q-grigio', label: 'Quarzo grigio',  sw: '#b9bcbd', top: '#cfd1d2' },
  { id: 'inox',     label: 'Acciaio inox',   sw: 'linear-gradient(135deg,#d6dade,#aeb4ba)', top: '#dfe3e6' },
  { id: 'legno',    label: 'Legno massello', sw: 'linear-gradient(135deg,#b08a5c,#8a6840)', top: '#bd9866' },
]

export function finishById(id: string): FinishOption {
  return FINISHES.find((f) => f.id === id) ?? FINISHES[0]
}

export function worktopById(id: string): WorktopOption {
  return WORKTOPS.find((w) => w.id === id) ?? WORKTOPS[0]
}
