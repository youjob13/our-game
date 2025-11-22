import { Injectable } from '@angular/core';
import { Emotion } from '@cutscene/domain';

@Injectable({ providedIn: 'root' })
export class CutsceneAssetResolver {
  private readonly BASE_CHARACTER_PATH = '/assets/characters';
  private readonly FALLBACK_CHARACTER = 'default';

  resolveCharacterSprite(characterId: string, emotion: Emotion): string {
    return `${this.BASE_CHARACTER_PATH}/${characterId}/${emotion}.png`;
  }

  resolveFallbackCharacterSprite(emotion: Emotion): string {
    return `${this.BASE_CHARACTER_PATH}/${this.FALLBACK_CHARACTER}/${emotion}.png`;
  }

  resolveBackgroundAsset(assetPath: string): string {
    if (assetPath.startsWith('/') || assetPath.startsWith('http')) {
      return assetPath;
    }
    return `/assets/backgrounds/${assetPath}`;
  }

  resolveAudioAsset(assetPath: string): string {
    if (assetPath.startsWith('/') || assetPath.startsWith('http')) {
      return assetPath;
    }
    return `/assets/music/${assetPath}`;
  }
}
