import { NgComponentOutlet } from '@angular/common';
import { Component, ChangeDetectionStrategy, input, computed, inject } from '@angular/core';
import { Emotion } from '@cutscene/domain';
import { CharacterDefinitionRegistry } from '@cutscene/infrastructure';

@Component({
  selector: 'sml-lib-svg-character-renderer',
  templateUrl: './svg-character-renderer.component.html',
  styleUrl: './svg-character-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet],
})
export class SVGCharacterRendererComponent {
  protected readonly registry = inject(CharacterDefinitionRegistry);

  readonly characterId = input.required<string>();
  readonly emotion = input.required<Emotion>();
  readonly variantId = input<string>('default');

  protected readonly characterComponent = computed(() => this.registry.get(this.characterId()));

  protected readonly componentInputs = computed(() => ({
    emotion: this.emotion(),
    variant: this.variantId(),
  }));
}
