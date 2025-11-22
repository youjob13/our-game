export interface CharacterPresetData {
  characterId: string;
  variantId: string;
  name: string;
  description?: string;
  previewImage?: string;
}

export class CharacterPreset {
  private constructor(
    public readonly characterId: string,
    public readonly variantId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly previewImage: string | null,
  ) {}

  static create(data: CharacterPresetData): CharacterPreset {
    const trimmedCharacterId = data.characterId.trim();
    const trimmedVariantId = data.variantId.trim();
    const trimmedName = data.name.trim();

    if (!trimmedCharacterId) {
      throw new Error('Character ID cannot be empty');
    }

    if (!trimmedVariantId) {
      throw new Error('Variant ID cannot be empty');
    }

    if (!trimmedName) {
      throw new Error('Preset name cannot be empty');
    }

    return new CharacterPreset(
      trimmedCharacterId,
      trimmedVariantId,
      trimmedName,
      data.description?.trim() ?? '',
      data.previewImage ?? null,
    );
  }

  equals(other: CharacterPreset): boolean {
    return this.characterId === other.characterId && this.variantId === other.variantId;
  }

  toData(): CharacterPresetData {
    return {
      characterId: this.characterId,
      variantId: this.variantId,
      name: this.name,
      description: this.description,
      previewImage: this.previewImage ?? undefined,
    };
  }
}
