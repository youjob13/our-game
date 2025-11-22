import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CutscenePlayerComponent } from '@cutscene/feature';

@Component({
  selector: 'sml-cutscene-page',
  template: `
    <sml-lib-cutscene-player [chapterId]="chapterId" (cutsceneComplete)="onCutsceneComplete()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CutscenePlayerComponent],
})
export class CutscenePageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly chapterId = this.route.snapshot.paramMap.get('chapterId') ?? 'chapter-1';

  protected onCutsceneComplete(): void {
    this.router.navigate(['/gameplay']);
  }
}
