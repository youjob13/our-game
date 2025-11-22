import { Injectable } from '@angular/core';
import {
  PresetConfiguration,
  PresetConfigurationRepository,
  CharacterPresetData,
} from '@customization/domain';

interface StorageData {
  selectedPresets: Record<string, CharacterPresetData>;
  lastUpdated: string;
}

@Injectable({ providedIn: 'root' })
export class LocalStoragePresetRepository extends PresetConfigurationRepository {
  private readonly STORAGE_KEY = 'character-customization-presets';

  async save(configuration: PresetConfiguration): Promise<void> {
    const data = configuration.toData();

    const storageData: StorageData = {
      selectedPresets: Object.fromEntries(data.selectedPresets.entries()),
      lastUpdated: data.lastUpdated?.toISOString() ?? new Date().toISOString(),
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storageData));
    } catch (error) {
      console.error('Failed to save preset configuration:', error);
      throw new Error('Failed to persist customization settings');
    }
  }

  async load(): Promise<PresetConfiguration> {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);

      if (!raw) {
        return PresetConfiguration.createEmpty();
      }

      const storageData = JSON.parse(raw) as StorageData;

      const selectedPresets = new Map<string, CharacterPresetData>(
        Object.entries(storageData.selectedPresets),
      );

      return PresetConfiguration.create({
        selectedPresets,
        lastUpdated: new Date(storageData.lastUpdated),
      });
    } catch (error) {
      console.error('Failed to load preset configuration:', error);
      return PresetConfiguration.createEmpty();
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear preset configuration:', error);
      throw new Error('Failed to clear customization settings');
    }
  }
}
