import { Injectable, inject, signal, computed } from '@angular/core';
import { PresetConfiguration, CharacterPreset, PresetRegistry } from '@customization/domain';

import { CustomizationService } from '../services/customization.service';

@Injectable({ providedIn: 'root' })
export class CustomizationFacade {
  private readonly service = inject(CustomizationService);
  private readonly presetRegistry = inject(PresetRegistry);

  private readonly configurationSignal = signal<PresetConfiguration>(
    PresetConfiguration.createEmpty(),
  );
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly configuration = this.configurationSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  readonly availableCharacterIds = computed(() => this.presetRegistry.getAllCharacterIds());

  async initialize(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const config = await this.service.loadConfiguration();
      this.configurationSignal.set(config);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.errorSignal.set(`Failed to initialize: ${message}`);
      console.error('Customization initialization error:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  getPresetsForCharacter(characterId: string): CharacterPreset[] {
    return this.presetRegistry.getPresetsForCharacter(characterId);
  }

  getSelectedPresetForCharacter(characterId: string): CharacterPreset | null {
    return this.configurationSignal().getPresetForCharacter(characterId);
  }

  getVariantForCharacter(characterId: string): string {
    return this.configurationSignal().getVariantIdForCharacter(characterId);
  }

  async selectPreset(characterId: string, preset: CharacterPreset): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const updatedConfig = await this.service.selectPresetForCharacter(characterId, preset);
      this.configurationSignal.set(updatedConfig);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.errorSignal.set(`Failed to select preset: ${message}`);
      console.error('Preset selection error:', error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async clearAll(): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      await this.service.clearAllPresets();
      this.configurationSignal.set(PresetConfiguration.createEmpty());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.errorSignal.set(`Failed to clear presets: ${message}`);
      console.error('Clear presets error:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }
}
