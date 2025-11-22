import { NgComponentOutlet, NgOptimizedImage } from '@angular/common';
import { Component, input, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { BackgroundConfig } from '@cutscene/domain';
import { BackgroundComponentRegistry, CutsceneAssetResolver } from '@cutscene/infrastructure';

@Component({
  selector: 'sml-lib-background-renderer',
  templateUrl: './background-renderer.component.html',
  styleUrl: './background-renderer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage, NgComponentOutlet],
  host: {
    '[attr.data-background-type]': 'background().type',
  },
})
export class BackgroundRendererComponent {
  private readonly registry = inject(BackgroundComponentRegistry);
  private readonly assetResolver = inject(CutsceneAssetResolver);

  readonly background = input.required<BackgroundConfig>();

  protected readonly resolvedAsset = computed(() => {
    const bg = this.background();
    return this.assetResolver.resolveBackgroundAsset(bg.asset);
  });

  protected readonly componentToRender = computed(() => {
    const bg = this.background();
    if (!bg.isComponent()) return null;

    const component = this.registry.get(bg.asset);
    if (!component) {
      console.warn(
        `Background component "${bg.asset}" not found in registry. Available: ${this.registry.getRegisteredNames().join(', ')}`,
      );
      return null;
    }
    return component;
  });
}
