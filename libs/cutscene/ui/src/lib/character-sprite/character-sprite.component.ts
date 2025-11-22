import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CharacterPosition } from '@cutscene/domain';

@Component({
  selector: 'sml-lib-character-sprite',
  templateUrl: './character-sprite.component.html',
  styleUrl: './character-sprite.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-position]': 'character().position',
    '[attr.data-emotion]': 'character().emotion',
    '[class.is-speaking]': 'isSpeaking()',
  },
})
export class CharacterSpriteComponent {
  readonly character = input.required<CharacterPosition>();
  readonly isSpeaking = input(false);
}
