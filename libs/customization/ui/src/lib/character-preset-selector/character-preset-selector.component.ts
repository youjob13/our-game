import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CharacterPreset } from '@customization/domain';

import { PresetCardComponent } from '../preset-card/preset-card.component';

@Component({
  selector: 'sml-lib-character-preset-selector',
  templateUrl: './character-preset-selector.component.html',
  styleUrl: './character-preset-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PresetCardComponent],
})
export class CharacterPresetSelectorComponent {
  readonly characterId = input.required<string>();
  readonly characterName = input.required<string>();
  readonly presets = input.required<CharacterPreset[]>();
  readonly selectedPreset = input<CharacterPreset | null>(null);

  readonly presetSelected = output<{ characterId: string; preset: CharacterPreset }>();

  protected readonly selectedVariantId = computed(() => this.selectedPreset()?.variantId ?? null);

  protected onPresetSelect(preset: CharacterPreset): void {
    this.presetSelected.emit({ characterId: this.characterId(), preset });
  }

  protected isSelected(preset: CharacterPreset): boolean {
    return this.selectedVariantId() === preset.variantId;
  }
}
