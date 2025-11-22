import { Routes } from '@angular/router';
import { CustomizationPageComponent } from '@customization/feature';
import { StartMenuComponent } from 'feature';

import { CutscenePageComponent } from './pages/cutscene/cutscene-page.component';
import { GameplayPageComponent } from './pages/gameplay/gameplay-page.component';

export const routes: Routes = [
  {
    path: '',
    component: StartMenuComponent,
  },
  {
    path: 'customization',
    component: CustomizationPageComponent,
  },
  {
    path: 'cutscene/:chapterId',
    component: CutscenePageComponent,
  },
  {
    path: 'gameplay',
    component: GameplayPageComponent,
  },
];
