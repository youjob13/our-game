import { Dialog, DialogData } from '../value-objects/dialog';
import {
  CharacterPosition,
  CharacterPositionData,
} from '../value-objects/character-position';

export interface CutsceneData {
  id: string;
  background: string;
  characterPositions: CharacterPositionData[];
  dialogs: DialogData[];
}

export class Cutscene {
  private constructor(
    public readonly id: string,
    public readonly background: string,
    private readonly characterPositions: CharacterPosition[],
    private readonly dialogSequence: Dialog[]
  ) {}

  static create(data: CutsceneData): Cutscene {
    if (!data.id.trim()) {
      throw new Error('Cutscene id cannot be empty');
    }

    if (!data.background.trim()) {
      throw new Error('Cutscene background cannot be empty');
    }

    if (data.dialogs.length === 0) {
      throw new Error('Cutscene must have at least one dialog');
    }

    const characterPositions = data.characterPositions.map((cp) =>
      CharacterPosition.create(cp)
    );
    const dialogs = data.dialogs.map((d) => Dialog.create(d));

    return new Cutscene(data.id, data.background, characterPositions, dialogs);
  }

  getDialogs(): readonly Dialog[] {
    return this.dialogSequence;
  }

  getCharacterPositions(): readonly CharacterPosition[] {
    return this.characterPositions;
  }

  getTotalDuration(): number {
    return this.dialogSequence.reduce(
      (sum, dialog) => sum + dialog.displayDuration,
      0
    );
  }

  getDialogCount(): number {
    return this.dialogSequence.length;
  }
}

