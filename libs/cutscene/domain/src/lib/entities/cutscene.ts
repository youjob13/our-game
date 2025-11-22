import { Dialog, DialogData } from '../value-objects/dialog';
import { CharacterPosition, CharacterPositionData } from '../value-objects/character-position';
import { BackgroundConfig, BackgroundConfigData } from '../value-objects/background-config';
import { AudioConfig, AudioConfigData } from '../value-objects/audio-config';

export interface CutsceneData {
  id: string;
  background: BackgroundConfigData;
  audio?: AudioConfigData;
  characters: CharacterPositionData[];
  dialogs: DialogData[];
  metadata?: Record<string, unknown>;
}

export class Cutscene {
  private static readonly MIN_CHARACTERS = 1;
  private static readonly MAX_CHARACTERS = 2;

  private constructor(
    public readonly id: string,
    private readonly backgroundConfig: BackgroundConfig,
    private readonly audioConfig: AudioConfig,
    private readonly characterPositions: CharacterPosition[],
    private readonly dialogSequence: Dialog[],
    public readonly metadata: Record<string, unknown>,
  ) {}

  static create(data: CutsceneData): Cutscene {
    if (!data.id.trim()) {
      throw new Error('Cutscene id cannot be empty');
    }

    if (data.dialogs.length === 0) {
      throw new Error('Cutscene must have at least one dialog');
    }

    if (data.characters.length < this.MIN_CHARACTERS) {
      throw new Error(`Cutscene must have at least ${this.MIN_CHARACTERS} character(s)`);
    }

    if (data.characters.length > this.MAX_CHARACTERS) {
      throw new Error(`Cutscene cannot have more than ${this.MAX_CHARACTERS} characters`);
    }

    const background = BackgroundConfig.create(data.background);
    const audio = AudioConfig.create(data.audio);
    const characterPositions = data.characters.map((cp) => CharacterPosition.create(cp));
    const dialogs = data.dialogs.map((d) => Dialog.create(d));

    return new Cutscene(
      data.id,
      background,
      audio,
      characterPositions,
      dialogs,
      data.metadata ?? {},
    );
  }

  getDialogs(): readonly Dialog[] {
    return this.dialogSequence;
  }

  getCharacterPositions(): readonly CharacterPosition[] {
    return this.characterPositions;
  }

  getBackground(): BackgroundConfig {
    return this.backgroundConfig;
  }

  getAudio(): AudioConfig {
    return this.audioConfig;
  }

  getCharacterById(id: string): CharacterPosition | undefined {
    return this.characterPositions.find((c) => c.id === id);
  }

  getTotalDuration(): number {
    return this.dialogSequence.reduce((sum, dialog) => sum + dialog.displayDuration, 0);
  }

  getDialogCount(): number {
    return this.dialogSequence.length;
  }
}
