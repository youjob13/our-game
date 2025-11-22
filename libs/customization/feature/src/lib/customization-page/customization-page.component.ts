import { Component, ChangeDetectionStrategy, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CustomizationFacade } from '@customization/application';
import { CharacterPreset } from '@customization/domain';
import { CharacterPresetSelectorComponent } from '@customization/ui';

@Component({
  selector: 'sml-lib-customization-page',
  templateUrl: './customization-page.component.html',
  styleUrl: './customization-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CharacterPresetSelectorComponent],
})
export class CustomizationPageComponent implements OnInit {
  private readonly facade = inject(CustomizationFacade);
  private readonly router = inject(Router);

  protected readonly loading = this.facade.loading;
  protected readonly error = this.facade.error;
  protected readonly characterIds = this.facade.availableCharacterIds;

  protected readonly characterSelectors = computed(() => {
    return this.characterIds().map((characterId) => ({
      characterId,
      characterName: this.formatCharacterName(characterId),
      presets: this.facade.getPresetsForCharacter(characterId),
      selectedPreset: this.facade.getSelectedPresetForCharacter(characterId),
    }));
  });

  async ngOnInit(): Promise<void> {
    await this.facade.initialize();
  }

  protected async onPresetSelected(event: {
    characterId: string;
    preset: CharacterPreset;
  }): Promise<void> {
    try {
      await this.facade.selectPreset(event.characterId, event.preset);
    } catch (error) {
      console.error('Failed to select preset:', error);
    }
  }

  protected onBack(): void {
    this.router.navigate(['/']);
  }

  private formatCharacterName(characterId: string): string {
    return characterId.charAt(0).toUpperCase() + characterId.slice(1);
  }
}
