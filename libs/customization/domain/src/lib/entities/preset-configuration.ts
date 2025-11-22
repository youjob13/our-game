import { CharacterPreset, CharacterPresetData } from '../value-objects/character-preset';

export interface PresetConfigurationData {
  selectedPresets: Map<string, CharacterPresetData>;
  lastUpdated?: Date;
}

export class PresetConfiguration {
  private constructor(
    private readonly presets: Map<string, CharacterPreset>,
    public readonly lastUpdated: Date,
  ) {}

  static create(data?: PresetConfigurationData): PresetConfiguration {
    const presets = new Map<string, CharacterPreset>();

    if (data?.selectedPresets) {
      for (const [characterId, presetData] of data.selectedPresets.entries()) {
        presets.set(characterId, CharacterPreset.create(presetData));
      }
    }

    return new PresetConfiguration(presets, data?.lastUpdated ?? new Date());
  }

  static createEmpty(): PresetConfiguration {
    return new PresetConfiguration(new Map(), new Date());
  }

  setPresetForCharacter(characterId: string, preset: CharacterPreset): PresetConfiguration {
    if (preset.characterId !== characterId) {
      throw new Error(
        `Preset character ID (${preset.characterId}) must match target character ID (${characterId})`,
      );
    }

    const newPresets = new Map(this.presets);
    newPresets.set(characterId, preset);

    return new PresetConfiguration(newPresets, new Date());
  }

  getPresetForCharacter(characterId: string): CharacterPreset | null {
    return this.presets.get(characterId) ?? null;
  }

  getVariantIdForCharacter(characterId: string): string {
    const preset = this.presets.get(characterId);
    return preset?.variantId ?? 'default';
  }

  hasPresetForCharacter(characterId: string): boolean {
    return this.presets.has(characterId);
  }

  getAllCharacterIds(): string[] {
    return Array.from(this.presets.keys());
  }

  toData(): PresetConfigurationData {
    const selectedPresets = new Map<string, CharacterPresetData>();

    for (const [characterId, preset] of this.presets.entries()) {
      selectedPresets.set(characterId, preset.toData());
    }

    return {
      selectedPresets,
      lastUpdated: this.lastUpdated,
    };
  }
}
