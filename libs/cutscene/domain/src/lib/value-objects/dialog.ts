export type DialogEmotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'surprised';

export interface DialogData {
  speaker: string;
  text: string;
  emotion?: DialogEmotion;
  displayDuration?: number;
}

export class Dialog {
  private static readonly MIN_TEXT_LENGTH = 1;
  private static readonly MAX_TEXT_LENGTH = 500;
  private static readonly DEFAULT_DURATION = 3000;

  private constructor(
    public readonly speaker: string,
    public readonly text: string,
    public readonly emotion: DialogEmotion,
    public readonly displayDuration: number,
  ) {}

  static create(data: DialogData): Dialog {
    const trimmedText = data.text.trim();
    const trimmedSpeaker = data.speaker.trim();

    if (!trimmedSpeaker) {
      throw new Error('Dialog speaker cannot be empty');
    }

    if (trimmedText.length < this.MIN_TEXT_LENGTH) {
      throw new Error('Dialog text cannot be empty');
    }

    if (trimmedText.length > this.MAX_TEXT_LENGTH) {
      throw new Error(`Dialog text cannot exceed ${this.MAX_TEXT_LENGTH} characters`);
    }

    return new Dialog(
      trimmedSpeaker,
      trimmedText,
      data.emotion ?? 'neutral',
      data.displayDuration ?? this.DEFAULT_DURATION,
    );
  }
}
