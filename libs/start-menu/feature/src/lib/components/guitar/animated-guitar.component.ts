import { ChangeDetectionStrategy, Component } from '@angular/core';

interface MusicNote {
  id: number;
  symbol: string;
  x: number;
  delay: number;
  duration: number;
}

@Component({
  selector: 'sml-lib-animated-guitar',
  templateUrl: './animated-guitar.component.html',
  styleUrl: './animated-guitar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedGuitarComponent {
  protected readonly musicNotes: MusicNote[] = this.generateMusicNotes();

  private generateMusicNotes(): MusicNote[] {
    const noteSymbols = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      symbol: noteSymbols[Math.floor(Math.random() * noteSymbols.length)],
      x: -10 + Math.random() * 20,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 2,
    }));
  }
}
