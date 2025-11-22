import { Routes } from '@angular/router';
import { StartMenuComponent } from 'feature';

import { CutscenePageComponent } from './pages/cutscene/cutscene-page.component';
import { GameplayPageComponent } from './pages/gameplay/gameplay-page.component';

export const routes: Routes = [
  {
    path: '',
    component: StartMenuComponent,
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
