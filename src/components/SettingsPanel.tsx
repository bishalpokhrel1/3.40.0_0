import { create } from 'zustand';

interface Settings {
  darkMode: boolean;
  temperatureUnit: 'C' | 'F';
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useStore = create<SettingsStore>((set) => ({
  settings: {
    darkMode: false,
    temperatureUnit: 'C',
  },
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
}));

export default function SettingsPanel(): JSX.Element {
  const { settings, updateSettings } = useStore();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Settings
      </h2>
      
      <div className="space-y-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Dark Mode
          </label>
          <button
            onClick={() => updateSettings({ darkMode: !settings.darkMode })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
              settings.darkMode ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Weather Unit Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-sm text-gray-600 dark:text-gray-300">
            Temperature Unit
          </label>
          <button
            onClick={() =>
              updateSettings({
                temperatureUnit: settings.temperatureUnit === 'C' ? 'F' : 'C',
              })
            }
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded"
          >
            °{settings.temperatureUnit}
          </button>
        </div>
      </div>
    </div>
  );
};