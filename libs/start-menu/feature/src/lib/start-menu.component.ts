import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AnimatedBackgroundComponent } from './components/background/animated-background.component';
import { AnimatedGuitarComponent } from './components/guitar/animated-guitar.component';

interface MenuButton {
  label: string;
  action: string;
  disabled: boolean;
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

  protected readonly gameDescription =
    'Рад, что судьба послала мне такого ангелочка. \n Пусть наши воспоминания останутся не только в сердце, но и в коде';

  protected readonly gameTitle = 'Архив воспоминаний';

  protected readonly menuButtons: MenuButton[] = [
    { label: 'Режим Истории', disabled: false, action: 'story' },
    { label: 'Главы', disabled: true, action: 'chapters' },
    { label: 'Настройки', disabled: true, action: 'customization' },
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
