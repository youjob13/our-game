import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { Emotion } from '@cutscene/domain';

@Component({
  selector: 'sml-lib-sanya-character',
  templateUrl: './sanya-character.component.html',
  styleUrl: './sanya-character.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SanyaCharacterComponent {
  readonly variant = input<string>('default');
  readonly emotion = input<Emotion>('neutral');

  protected readonly skinTone = computed(() => '#f4d7c0');
  protected readonly hairColor = computed(() => '#3d2817');

  protected readonly shirtColor = computed(() => {
    const variant = this.variant();
    switch (variant) {
      case 'casual':
        return '#f5f5f5';
      case 'formal':
        return '#e8e8e8';
      default:
        return '#f0f0f0';
    }
  });

  protected readonly pantsColor = computed(() => {
    const variant = this.variant();
    return variant === 'formal' ? '#2c3e50' : '#4a6b8a';
  });
}
