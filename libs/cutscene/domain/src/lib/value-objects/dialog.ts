import { Emotion, isValidEmotion } from './emotion';

export interface DialogData {
  speaker: string;
  text: string;
  emotion?: Emotion;
  displayDuration?: number;
}

export class Dialog {
  private static readonly MIN_TEXT_LENGTH = 1;
  private static readonly MAX_TEXT_LENGTH = 500;
  private static readonly DEFAULT_DURATION = 3000;

  private constructor(
    public readonly speaker: string,
    public readonly text: string,
    public readonly emotion: Emotion,
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

    const emotion = data.emotion ?? 'neutral';
    if (!isValidEmotion(emotion)) {
      throw new Error(`Invalid emotion: ${emotion}`);
    }

    return new Dialog(
      trimmedSpeaker,
      trimmedText,
      emotion,
      data.displayDuration ?? this.DEFAULT_DURATION,
    );
  }
}
