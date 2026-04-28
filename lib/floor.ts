import type { FloorState, FloorSignal } from './types/forge'

const KEY = 'ip_floor_state'

const DEFAULT: FloorState = {
  peace:      'stable',
  sovereignty: 'stable',
  lastUpdated: new Date().toISOString(),
}

export function getFloorState(): FloorState {
  if (typeof window === 'undefined') return DEFAULT
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as FloorState) : DEFAULT
  } catch {
    return DEFAULT
  }
}

export function setFloorState(state: FloorState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {}
}

export function floorIsStale(state: FloorState): boolean {
  const updated = new Date(state.lastUpdated).getTime()
  return Date.now() - updated > 24 * 60 * 60 * 1000
}

export function worstSignal(state: FloorState): FloorSignal {
  const order: FloorSignal[] = ['stable', 'pressured', 'shaking']
  const pi = order.indexOf(state.peace)
  const si = order.indexOf(state.sovereignty)
  return order[Math.max(pi, si)]
}
