import type { Theme } from './types'
import { ember }      from './presets/ember'
import { forest }     from './presets/forest'
import { ocean }      from './presets/ocean'
import { royal }      from './presets/royal'
import { solar }      from './presets/solar'
import { voidTheme }  from './presets/void'
import { dusk }       from './presets/dusk'
import { rose }       from './presets/rose'
import { arctic }     from './presets/arctic'
import { earth }      from './presets/earth'
import { sage }       from './presets/sage'
import { chrome }     from './presets/chrome'

export const THEMES: Record<string, Theme> = {
  ember,
  forest,
  ocean,
  royal,
  solar,
  void:  voidTheme,
  dusk,
  rose,
  arctic,
  earth,
  sage,
  chrome,
}

export const THEME_ORDER = ['ember', 'forest', 'ocean', 'royal', 'solar', 'void', 'dusk', 'rose', 'arctic', 'earth', 'sage', 'chrome']
