interface ConfigKeys {
  OPENWEATHER_API_KEY: string;
  GOOGLE_API_KEY: string;
}

export const configService = {
  async getConfig<K extends keyof ConfigKeys>(key: K): Promise<ConfigKeys[K] | null> {
    try {
      const result = await chrome.storage.sync.get(key);
      return result[key] || null;
    } catch (error) {
      console.error(`Error getting config for ${key}:`, error);
      return null;
    }
  },

  async setConfig<K extends keyof ConfigKeys>(key: K, value: ConfigKeys[K]): Promise<void> {
    try {
      await chrome.storage.sync.set({ [key]: value });
    } catch (error) {
      console.error(`Error setting config for ${key}:`, error);
      throw error;
    }
  },

  async getAllConfig(): Promise<Partial<ConfigKeys>> {
    try {
      const result = await chrome.storage.sync.get(null);
      return result as Partial<ConfigKeys>;
    } catch (error) {
      console.error('Error getting all config:', error);
      return {};
    }
  },

  async checkAndInitConfig(): Promise<void> {
    const config = await this.getAllConfig();
    
    // Check if we're missing any required API keys
    if (!config.OPENWEATHER_API_KEY || !config.GOOGLE_API_KEY) {
      console.warn('Missing required API keys. Please configure them in extension settings.');
    }
  }
};