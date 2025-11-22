import { Emotion, isValidEmotion } from './emotion';

export type CharacterPositionType = 'left' | 'right' | 'center';

export interface CharacterPositionData {
  id: string;
  displayName: string;
  position: CharacterPositionType;
  initialEmotion: Emotion;
  variantId?: string;
}

export class CharacterPosition {
  private constructor(
    public readonly id: string,
    public readonly displayName: string,
    public readonly position: CharacterPositionType,
    public readonly initialEmotion: Emotion,
    public readonly variantId: string,
  ) {}

  static create(data: CharacterPositionData): CharacterPosition {
    const trimmedId = data.id.trim();
    const trimmedName = data.displayName.trim();

    if (!trimmedId) {
      throw new Error('Character id cannot be empty');
    }

    if (!trimmedName) {
      throw new Error('Character display name cannot be empty');
    }

    if (!isValidEmotion(data.initialEmotion)) {
      throw new Error(`Invalid emotion: ${data.initialEmotion}`);
    }

    return new CharacterPosition(
      trimmedId,
      trimmedName,
      data.position,
      data.initialEmotion,
      data.variantId ?? 'default',
    );
  }

  getAssetPath(emotion: Emotion): string {
    return `/assets/characters/${this.id}/${emotion}.png`;
  }
}
