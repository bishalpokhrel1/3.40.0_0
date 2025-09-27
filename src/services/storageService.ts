// Storage service for Chrome extension
export interface ExtensionSettings {
  tasksEnabled: boolean;
  weatherEnabled: boolean;
  newsEnabled: boolean;
  theme: 'light' | 'dark';
  notifications: boolean;
}

const defaultSettings: ExtensionSettings = {
  tasksEnabled: true,
  weatherEnabled: true,
  newsEnabled: true,
  theme: 'light',
  notifications: true
};

export class StorageService {
  // Get settings from Chrome storage
  static async getSettings(): Promise<ExtensionSettings> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.get(defaultSettings, (settings) => {
          resolve(settings as ExtensionSettings);
        });
      } else {
        // Fallback to localStorage for development
        const stored = localStorage.getItem('extension-settings');
        if (stored) {
          try {
            resolve({ ...defaultSettings, ...JSON.parse(stored) });
          } catch {
            resolve(defaultSettings);
          }
        } else {
          resolve(defaultSettings);
        }
      }
    });
  }

  // Save settings to Chrome storage
  static async saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.set(settings, () => {
          resolve();
        });
      } else {
        // Fallback to localStorage for development
        const current = localStorage.getItem('extension-settings');
        const currentSettings = current ? JSON.parse(current) : defaultSettings;
        const newSettings = { ...currentSettings, ...settings };
        localStorage.setItem('extension-settings', JSON.stringify(newSettings));
        resolve();
      }
    });
  }

  // Get a specific setting
  static async getSetting<K extends keyof ExtensionSettings>(
    key: K
  ): Promise<ExtensionSettings[K]> {
    const settings = await this.getSettings();
    return settings[key];
  }

  // Set a specific setting
  static async setSetting<K extends keyof ExtensionSettings>(
    key: K,
    value: ExtensionSettings[K]
  ): Promise<void> {
    await this.saveSettings({ [key]: value });
  }

  // Clear all settings
  static async clearSettings(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.sync.clear(() => {
          resolve();
        });
      } else {
        localStorage.removeItem('extension-settings');
        resolve();
      }
    });
  }
}

// Export default settings for use in components
export { defaultSettings };