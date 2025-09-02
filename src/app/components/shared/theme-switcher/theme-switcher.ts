import { NgClass, isPlatformBrowser } from '@angular/common';
import { Component, computed, DOCUMENT, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { $t } from '@primeuix/themes';

import Aura from '@primeuix/themes/aura';
import { ThemeState } from '../../../models/theme-state';

const presets = {
  Aura,
};

@Component({
  selector: 'app-theme-switcher',
  imports: [NgClass],
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.css'
})
export class ThemeSwitcher {
  private readonly STORAGE_KEY = 'themeState';

  presets = Object.keys(presets);

  document = inject(DOCUMENT);
  platformId = inject(PLATFORM_ID);

  themeState = signal<ThemeState>(null);
  transitionComplete = signal<boolean>(false);

  iconClass = computed(() => (this.themeState().darkTheme ? 'pi-sun' : 'pi-moon'));

  selectedSurfaceColor = computed(() => this.themeState().surface);
  selectedPrimaryColor = computed(() => {
    return this.themeState().primary;
  });

  primaryColors = computed(() => {
    const presetPalette = presets[this.themeState().preset].primitive;
    const colors = [
      'emerald',
      'green',
      'lime',
      'orange',
      'amber',
      'yellow',
      'teal',
      'cyan',
      'sky',
      'blue',
      'indigo',
      'violet',
      'purple',
      'fuchsia',
      'pink',
      'rose',
    ];

    const palettes = [{ name: 'noir', palette: {} }];

    colors.forEach((color) => {
      palettes.push({
        name: color,
        palette: presetPalette[color],
      });
    });

    return palettes;
  });

  surfaces = [
    {
      name: 'slate',
      palette: {
        0: '#ffffff',
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
    },
    {
      name: 'gray',
      palette: {
        0: '#ffffff',
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
      },
    },
    {
      name: 'neutral',
      palette: {
        0: '#ffffff',
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
      },
    },
  ];

  constructor() {
    this.themeState.set({ ...this.loadThemeState() });

    effect(() => {
      const state = this.themeState();

      this.saveThemeState(state);
      this.handleDarkModeTransition(state);
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.onPresetChange(this.themeState().preset);
    }
  }

  onPresetChange(modifiedPreset: string) {
    this.themeState.update((state) => ({ ...state, preset: modifiedPreset }));
    const preset = presets[modifiedPreset];
    const surfacePalette = this.surfaces.find(
      (s) => s.name === this.selectedSurfaceColor()
    )?.palette;
    $t()
      .preset(preset)
      .preset(this.getPresetExt())
      .surfacePalette(surfacePalette)
      .use({ useDefaultOptions: true });
  }

  getPresetExt(): any {
    const color = this.primaryColors().find((c) => c.name === this.selectedPrimaryColor());

    if (color.name === 'noir') {
      return {
        semantic: {
          primary: {
            50: '{surface.50}',
            100: '{surface.100}',
            200: '{surface.200}',
            300: '{surface.300}',
            400: '{surface.400}',
            500: '{surface.500}',
            600: '{surface.600}',
            700: '{surface.700}',
            800: '{surface.800}',
            900: '{surface.900}',
            950: '{surface.950}',
          },
          colorScheme: {
            light: {
              primary: {
                color: '{primary.950}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.800}',
                activeColor: '{primary.700}',
              },
              highlight: {
                background: '{primary.950}',
                focusBackground: '{primary.700}',
                color: '#ffffff',
                focusColor: '#ffffff',
              },
            },
            dark: {
              primary: {
                color: '{primary.50}',
                contrastColor: '{primary.950}',
                hoverColor: '{primary.200}',
                activeColor: '{primary.300}',
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.300}',
                color: '{primary.950}',
                focusColor: '{primary.950}',
              },
            },
          },
        },
      };
    } else {
      return {
        semantic: {
          primary: color.palette,
          colorScheme: {
            light: {
              primary: {
                color: '{primary.500}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.600}',
                activeColor: '{primary.700}',
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.100}',
                color: '{primary.700}',
                focusColor: '{primary.800}',
              },
            },
            dark: {
              primary: {
                color: '{primary.400}',
                contrastColor: '{surface.900}',
                hoverColor: '{primary.300}',
                activeColor: '{primary.200}',
              },
              highlight: {
                background: 'color-mix(in srgb, {primary.400}, transparent 84%)',
                focusBackground: 'color-mix(in srgb, {primary.400}, transparent 76%)',
                color: 'rgba(255,255,255,.87)',
                focusColor: 'rgba(255,255,255,.87)',
              },
            },
          },
        },
      };
    }
  }

  handleDarkModeTransition(state: ThemeState) {
    if (isPlatformBrowser(this.platformId)) {
      if ((document as any).startViewTransition) {
        this.startViewTransition(state);
      } else {
        this.toggleDarkMode(state);
        this.onTransitionEnd();
      }
    }
  }

  onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }

  toggleDarkMode(state: ThemeState) {
    if (state.darkTheme) {
      this.document.documentElement.classList.add('p-dark');
    } else {
      this.document.documentElement.classList.remove('p-dark');
    }
  }

  startViewTransition(state: ThemeState) {
    const transition = (document as any).startViewTransition(() => this.toggleDarkMode(state));
  }

  saveThemeState(state: ThemeState) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    }
  }

  loadThemeState(): ThemeState {
    if (isPlatformBrowser(this.platformId)) {
      const storedState = localStorage.getItem(this.STORAGE_KEY);
      if (storedState) {
        return JSON.parse(storedState);
      }
    }

    return {
      preset: 'Aura',
      primary: 'noir',
      surface: null,
      darkTheme: false,
    };
  }

  toggleTheme() {
    this.themeState.update((state) => ({
      ...state,
      darkTheme: !state.darkTheme,
    }));
  }
}
