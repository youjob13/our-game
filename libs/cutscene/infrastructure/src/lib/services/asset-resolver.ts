import { Injectable } from '@angular/core';
import { Emotion } from '@cutscene/domain';

@Injectable({ providedIn: 'root' })
export class CutsceneAssetResolver {
  private readonly BASE_CHARACTER_PATH = 'assets/characters';
  private readonly FALLBACK_CHARACTER = 'default';

  resolveCharacterSprite(characterId: string, emotion: Emotion): string {
    return `${this.BASE_CHARACTER_PATH}/${characterId}/${emotion}.png`;
  }

  resolveFallbackCharacterSprite(emotion: Emotion): string {
    return `${this.BASE_CHARACTER_PATH}/${this.FALLBACK_CHARACTER}/${emotion}.png`;
  }

  resolveBackgroundAsset(assetPath: string): string {
    if (assetPath.startsWith('http')) {
      return assetPath;
    }
    // Remove leading slash to make path relative (respects base href)
    const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
    if (normalizedPath.startsWith('assets/') || normalizedPath.startsWith('backgrounds/')) {
      return normalizedPath;
    }
    return `assets/backgrounds/${normalizedPath}`;
  }

  resolveAudioAsset(assetPath: string): string {
    if (assetPath.startsWith('http')) {
      return assetPath;
    }
    // Remove leading slash to make path relative (respects base href)
    const normalizedPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
    if (normalizedPath.startsWith('assets/')) {
      return normalizedPath;
    }
    return `assets/music/${normalizedPath}`;
  }
}
