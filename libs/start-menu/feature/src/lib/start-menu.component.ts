import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AnimatedBackgroundComponent } from './animated-background.component';

interface MenuButton {
  label: string;
  action: string;
}

@Component({
  selector: 'sml-lib-start-menu',
  templateUrl: './start-menu.component.html',
  styleUrl: './start-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnimatedBackgroundComponent],
})
export class StartMenuComponent {
  protected readonly gameTitle = 'Игра-архив воспоминаний';

  protected readonly menuButtons: MenuButton[] = [
    { label: 'Story Mode', action: 'story' },
    { label: 'Chapters', action: 'chapters' },
    { label: 'Settings', action: 'settings' },
    { label: 'Customization', action: 'customization' },
  ];

  protected onButtonClick(action: string): void {
    // Placeholder for future navigation logic
    console.log(`Button clicked: ${action}`);
  }
}
