import { Injectable, signal, computed } from '@angular/core';
import { Chapter, Cutscene } from '@cutscene/domain';

@Injectable({ providedIn: 'root' })
export class CutsceneFacade {
  // State signals
  private currentChapterSignal = signal<Chapter | null>(null);
  private currentCutsceneSignal = signal<Cutscene | null>(null);
  private currentDialogIndexSignal = signal(0);
  private isPlayingSignal = signal(false);
  private isCompletedSignal = signal(false);

  // Public readonly signals
  readonly currentChapter = this.currentChapterSignal.asReadonly();
  readonly currentCutscene = this.currentCutsceneSignal.asReadonly();
  readonly currentDialogIndex = this.currentDialogIndexSignal.asReadonly();
  readonly isPlaying = this.isPlayingSignal.asReadonly();
  readonly isCompleted = this.isCompletedSignal.asReadonly();

  // Computed values
  readonly currentDialog = computed(() => {
    const cutscene = this.currentCutsceneSignal();
    const index = this.currentDialogIndexSignal();
    return cutscene?.getDialogs()[index] ?? null;
  });

  readonly hasNextDialog = computed(() => {
    const cutscene = this.currentCutsceneSignal();
    const index = this.currentDialogIndexSignal();
    if (!cutscene) return false;
    return index < cutscene.getDialogs().length - 1;
  });

  readonly progress = computed(() => {
    const cutscene = this.currentCutsceneSignal();
    const index = this.currentDialogIndexSignal();
    if (!cutscene) return 0;
    const totalDialogs = cutscene.getDialogCount();
    return totalDialogs > 0 ? Math.round(((index + 1) / totalDialogs) * 100) : 0;
  });

  readonly dialogCount = computed(() => {
    const cutscene = this.currentCutsceneSignal();
    return cutscene?.getDialogCount() ?? 0;
  });

  // Actions
  startChapter(chapter: Chapter): void {
    const cutscene = chapter.getCutscene();

    this.currentChapterSignal.set(chapter);
    this.currentCutsceneSignal.set(cutscene);
    this.currentDialogIndexSignal.set(0);
    this.isPlayingSignal.set(true);
    this.isCompletedSignal.set(false);
  }

  nextDialog(): void {
    if (this.hasNextDialog()) {
      this.currentDialogIndexSignal.update((index) => index + 1);
    } else {
      this.completeCutscene();
    }
  }

  previousDialog(): void {
    const index = this.currentDialogIndexSignal();
    if (index > 0) {
      this.currentDialogIndexSignal.update((i) => i - 1);
    }
  }

  skipCutscene(): void {
    this.completeCutscene();
  }

  reset(): void {
    this.currentChapterSignal.set(null);
    this.currentCutsceneSignal.set(null);
    this.currentDialogIndexSignal.set(0);
    this.isPlayingSignal.set(false);
    this.isCompletedSignal.set(false);
  }

  private completeCutscene(): void {
    this.isPlayingSignal.set(false);
    this.isCompletedSignal.set(true);
  }
}
