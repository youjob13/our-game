import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { Emotion } from '@cutscene/domain';

@Component({
  selector: 'sml-lib-danil-character',
  templateUrl: './danil-character.component.html',
  styleUrl: './danil-character.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanilCharacterComponent {
  readonly variant = input<string>('default');
  readonly emotion = input<Emotion>('neutral');

  protected readonly skinTone = computed(() => '#f4d5a6');
  protected readonly hairColor = computed(() => '#3d2817');

  protected readonly shirtColor = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'casual':
        return '#5a5a5a';
      case 'formal':
        return '#2c3e50';
      default:
        return '#5a5a5a';
    }
  });

  protected readonly pantsColor = computed(() => {
    const variant = this.variant();
    return variant === 'formal' ? '#1a1a2e' : '#2c3e50';
  });
}
