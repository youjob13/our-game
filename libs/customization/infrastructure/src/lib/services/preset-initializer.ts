import { Injectable, inject } from '@angular/core';
import { PresetRegistry, CharacterPresetData } from '@customization/domain';

@Injectable({ providedIn: 'root' })
export class PresetInitializer {
  private readonly registry = inject(PresetRegistry);

  initialize(): void {
    const presets: CharacterPresetData[] = [
      {
        characterId: 'danil',
        variantId: 'default',
        name: 'Default Style',
        description: 'Classic look with casual attire',
        previewImage: '/assets/presets/danil-default.png',
      },
      {
        characterId: 'danil',
        variantId: 'casual',
        name: 'Casual Style',
        description: 'Relaxed everyday outfit',
        previewImage: '/assets/presets/danil-casual.png',
      },
      {
        characterId: 'danil',
        variantId: 'formal',
        name: 'Formal Style',
        description: 'Professional business attire',
        previewImage: '/assets/presets/danil-formal.png',
      },
      {
        characterId: 'sanya',
        variantId: 'default',
        name: 'Default Style',
        description: 'Classic everyday look',
        previewImage: '/assets/presets/sanya-default.png',
      },
      {
        characterId: 'sanya',
        variantId: 'casual',
        name: 'Casual Style',
        description: 'Comfortable casual wear',
        previewImage: '/assets/presets/sanya-casual.png',
      },
      {
        characterId: 'sanya',
        variantId: 'formal',
        name: 'Formal Style',
        description: 'Elegant formal outfit',
        previewImage: '/assets/presets/sanya-formal.png',
      },
    ];

    this.registry.registerPresets(presets);
  }
}
