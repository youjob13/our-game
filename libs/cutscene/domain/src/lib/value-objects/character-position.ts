export type CharacterPositionType = 'left' | 'right' | 'center';

export interface CharacterPositionData {
  characterName: string;
  position: CharacterPositionType;
  emotion: string;
}

export class CharacterPosition {
  private constructor(
    public readonly characterName: string,
    public readonly position: CharacterPositionType,
    public readonly emotion: string
  ) {}

  static create(data: CharacterPositionData): CharacterPosition {
    const trimmedName = data.characterName.trim();

    if (!trimmedName) {
      throw new Error('Character name cannot be empty');
    }

    return new CharacterPosition(trimmedName, data.position, data.emotion);
  }
}

