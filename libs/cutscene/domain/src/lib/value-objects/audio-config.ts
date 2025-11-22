export interface AudioConfigData {
  backgroundMusic?: string;
  autoLoop?: boolean;
}

export class AudioConfig {
  private constructor(
    public readonly backgroundMusic: string | null,
    public readonly autoLoop: boolean,
  ) {}

  static create(data: AudioConfigData = {}): AudioConfig {
    const trimmedMusic = data.backgroundMusic?.trim() ?? null;

    return new AudioConfig(trimmedMusic, data.autoLoop ?? true);
  }

  hasMusic(): boolean {
    return this.backgroundMusic !== null;
  }
}
