import { Injectable, inject } from '@angular/core';
import {
  PresetConfiguration,
  PresetConfigurationRepository,
  CharacterPreset,
} from '@customization/domain';

@Injectable({ providedIn: 'root' })
export class CustomizationService {
  private readonly repository = inject(PresetConfigurationRepository);

  async loadConfiguration(): Promise<PresetConfiguration> {
    try {
      return await this.repository.load();
    } catch (error) {
      console.error('Failed to load preset configuration:', error);
      return PresetConfiguration.createEmpty();
    }
  }

  async selectPresetForCharacter(
    characterId: string,
    preset: CharacterPreset,
  ): Promise<PresetConfiguration> {
    const currentConfig = await this.loadConfiguration();
    const updatedConfig = currentConfig.setPresetForCharacter(characterId, preset);
    await this.repository.save(updatedConfig);
    return updatedConfig;
  }

  async getVariantForCharacter(characterId: string): Promise<string> {
    const config = await this.loadConfiguration();
    return config.getVariantIdForCharacter(characterId);
  }

  async clearAllPresets(): Promise<void> {
    await this.repository.clear();
  }
}
