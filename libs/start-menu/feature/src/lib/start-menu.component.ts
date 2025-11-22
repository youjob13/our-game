import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AnimatedBackgroundComponent } from './components/background/animated-background.component';
import { AnimatedGuitarComponent } from './components/guitar/animated-guitar.component';

interface MenuButton {
  label: string;
  action: string;
}

@Component({
  selector: 'sml-lib-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrl: './start-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimatedBackgroundComponent, AnimatedGuitarComponent],
})
export class StartMenuComponent {
  private readonly router = inject(Router);

  protected readonly gameTitle = 'Архив воспоминаний';

  protected readonly menuButtons: MenuButton[] = [
    { label: 'Story Mode', action: 'story' },
    { label: 'Chapters', action: 'chapters' },
    { label: 'Customization', action: 'customization' },
  ];

  protected onButtonClick(action: string): void {
    if (action === 'story') {
      this.router.navigate(['/cutscene', 'chapter-1']);
    } else if (action === 'customization') {
      this.router.navigate(['/customization']);
    } else {
      console.log(`Button clicked: ${action}`);
    }
  }
}
