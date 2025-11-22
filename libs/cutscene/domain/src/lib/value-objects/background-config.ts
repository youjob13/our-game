export type BackgroundType = 'image' | 'video' | 'svg' | 'component';

export interface BackgroundConfigData {
  type: BackgroundType;
  asset: string;
  loop?: boolean;
  muted?: boolean;
}

export class BackgroundConfig {
  private constructor(
    public readonly type: BackgroundType,
    public readonly asset: string,
    public readonly loop: boolean,
    public readonly muted: boolean,
  ) {}

  static create(data: BackgroundConfigData): BackgroundConfig {
    const trimmedAsset = data.asset.trim();

    if (!trimmedAsset) {
      throw new Error('Background asset cannot be empty');
    }

    if (data.type === 'video') {
      return new BackgroundConfig(data.type, trimmedAsset, data.loop ?? true, data.muted ?? true);
    }

    return new BackgroundConfig(data.type, trimmedAsset, false, false);
  }

  isVideo(): boolean {
    return this.type === 'video';
  }

  isImage(): boolean {
    return this.type === 'image';
  }

  isSvg(): boolean {
    return this.type === 'svg';
  }

  isComponent(): boolean {
    return this.type === 'component';
  }
}
