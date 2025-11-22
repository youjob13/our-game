import { Cutscene, CutsceneData } from './cutscene';

export interface ChapterData {
  id: string;
  title: string;
  order: number;
  cutscene: CutsceneData;
}

export class Chapter {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly order: number,
    private readonly cutscene: Cutscene
  ) {}

  static create(data: ChapterData): Chapter {
    if (!data.id.trim()) {
      throw new Error('Chapter id cannot be empty');
    }

    if (!data.title.trim()) {
      throw new Error('Chapter title cannot be empty');
    }

    if (data.order < 1) {
      throw new Error('Chapter order must be at least 1');
    }

    const cutscene = Cutscene.create(data.cutscene);

    return new Chapter(data.id, data.title, data.order, cutscene);
  }

  getCutscene(): Cutscene {
    return this.cutscene;
  }
}

