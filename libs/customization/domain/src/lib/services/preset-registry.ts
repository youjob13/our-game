import { Injectable } from '@angular/core';

import { CharacterPreset, CharacterPresetData } from '../value-objects/character-preset';

@Injectable({ providedIn: 'root' })
export class PresetRegistry {
  private readonly presets = new Map<string, CharacterPreset[]>();

  registerPreset(preset: CharacterPreset): void {
    const characterId = preset.characterId;
    const existingPresets = this.presets.get(characterId) ?? [];

    const isDuplicate = existingPresets.some((p) => p.equals(preset));
    if (isDuplicate) {
      console.warn(`Preset "${preset.name}" for character "${characterId}" is already registered`);
      return;
    }

    this.presets.set(characterId, [...existingPresets, preset]);
  }

  registerPresets(presets: CharacterPresetData[]): void {
    for (const presetData of presets) {
      this.registerPreset(CharacterPreset.create(presetData));
    }
  }

  getPresetsForCharacter(characterId: string): CharacterPreset[] {
    return this.presets.get(characterId) ?? [];
  }

  getAllCharacterIds(): string[] {
    return Array.from(this.presets.keys());
  }

  hasPresetsForCharacter(characterId: string): boolean {
    return this.presets.has(characterId) && this.presets.get(characterId)!.length > 0;
  }
}
