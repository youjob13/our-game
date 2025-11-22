import { Component, input, ChangeDetectionStrategy, computed } from '@angular/core';
import { CharacterPosition, Emotion } from '@cutscene/domain';

import { SVGCharacterRendererComponent } from '../svg-character-renderer/svg-character-renderer.component';

@Component({
  selector: 'sml-lib-character-sprite',
  templateUrl: './character-sprite.component.html',
  styleUrl: './character-sprite.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SVGCharacterRendererComponent],
  host: {
    '[attr.data-position]': 'character().position',
    '[attr.data-emotion]': 'currentEmotion()',
    '[class.is-speaking]': 'isSpeaking()',
  },
})
export class CharacterSpriteComponent {
  readonly character = input.required<CharacterPosition>();
  readonly isSpeaking = input(false);
  readonly speakerEmotion = input<Emotion>('neutral');

  protected readonly currentEmotion = computed(() => {
    return this.isSpeaking() ? this.speakerEmotion() : this.character().initialEmotion;
  });

  protected readonly characterName = computed(() => {
    return this.character().displayName;
  });

  protected readonly variantId = computed(() => {
    return this.character().variantId;
  });
}
