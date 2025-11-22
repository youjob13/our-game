import {
  Component,
  OnInit,
  inject,
  output,
  input,
  ChangeDetectionStrategy,
  computed,
  effect,
} from '@angular/core';
import { CustomizationFacade } from '@customization/application';
import { CutsceneFacade } from '@cutscene/application';
import { Emotion } from '@cutscene/domain';
import { CutsceneRepository } from '@cutscene/infrastructure';
import {
  DialogBoxComponent,
  CharacterSpriteComponent,
  BackgroundRendererComponent,
} from '@cutscene/ui';

@Component({
  selector: 'sml-lib-cutscene-player',
  templateUrl: './cutscene-player.component.html',
  styleUrl: './cutscene-player.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogBoxComponent, CharacterSpriteComponent, BackgroundRendererComponent],
  host: {
    '(click)': 'handleClick()',
    '(keydown.space)': 'handleSpaceKey()',
    '(keydown.escape)': 'handleSkip()',
    '[class.is-playing]': 'facade.isPlaying()',
    '[class.is-completed]': 'facade.isCompleted()',
    '[attr.tabindex]': '0',
  },
})
export class CutscenePlayerComponent implements OnInit {
  protected readonly facade = inject(CutsceneFacade);
  private readonly repository = inject(CutsceneRepository);
  private readonly customizationFacade = inject(CustomizationFacade);

  readonly chapterId = input.required<string>();
  readonly cutsceneComplete = output<void>();

  protected readonly currentSpeaker = computed(() => {
    const dialog = this.facade.currentDialog();
    return dialog?.speaker ?? '';
  });

  protected readonly characterPositions = computed(() => {
    const cutscene = this.facade.currentCutscene();
    const positions = cutscene?.getCharacterPositions() ?? [];

    return positions.map((position) => {
      const customVariantId = this.customizationFacade.getVariantForCharacter(position.id);
      return {
        ...position,
        variantId: customVariantId,
        getAssetPath: (emotion: Emotion) => position.getAssetPath(emotion),
      };
    });
  });

  protected readonly leftCharacter = computed(() => {
    return this.characterPositions().find((c) => c.position === 'left') ?? null;
  });

  protected readonly rightCharacter = computed(() => {
    return this.characterPositions().find((c) => c.position === 'right') ?? null;
  });

  protected readonly currentSpeakerEmotion = computed(() => {
    const dialog = this.facade.currentDialog();
    return dialog?.emotion ?? 'neutral';
  });

  constructor() {
    // Monitor completion
    effect(() => {
      if (this.facade.isCompleted()) {
        this.cutsceneComplete.emit();
      }
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.customizationFacade.initialize();
      const chapter = await this.repository.getChapterById(this.chapterId());
      this.facade.startChapter(chapter);
    } catch (error) {
      console.error('Failed to load chapter:', error);
    }
  }

  protected handleClick(): void {
    if (this.facade.isPlaying()) {
      this.facade.nextDialog();
    }
  }

  protected handleSpaceKey(): void {
    if (this.facade.isPlaying()) {
      this.facade.nextDialog();
    }
  }

  protected handleSkip(): void {
    this.facade.skipCutscene();
  }

  protected isSpeaking(characterName: string): boolean {
    return this.currentSpeaker() === characterName;
  }
}
