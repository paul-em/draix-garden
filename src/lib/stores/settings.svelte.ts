import type { Settings } from '$lib/db/schema';

const SETTINGS_KEY = 'garden-tracker-settings';

class SettingsStore {
  settings = $state<Settings>({});

  constructor() {
    this.loadSettings();
  }

  loadSettings() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        try {
          this.settings = JSON.parse(stored);
        } catch (err) {
          console.error('Failed to parse settings:', err);
        }
      }
    }
  }

  saveSettings(newSettings: Partial<Settings>) {
    this.settings = { ...this.settings, ...newSettings };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    }
  }

  getOpenAIKey(): string | undefined {
    return this.settings.openaiApiKey;
  }

  setOpenAIKey(key: string) {
    this.saveSettings({ openaiApiKey: key });
  }

  clearOpenAIKey() {
    this.saveSettings({ openaiApiKey: undefined });
  }

  hasOpenAIKey(): boolean {
    return !!this.settings.openaiApiKey && this.settings.openaiApiKey.trim().length > 0;
  }
}

export const settingsStore = new SettingsStore();

