import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CharacterPreset } from '@customization/domain';

@Component({
  selector: 'sml-lib-preset-card',
  templateUrl: './preset-card.component.html',
  styleUrl: './preset-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PresetCardComponent {
  readonly preset = input.required<CharacterPreset>();
  readonly selected = input<boolean>(false);

  readonly presetSelected = output<CharacterPreset>();

  protected onSelect(): void {
    this.presetSelected.emit(this.preset());
  }
}
