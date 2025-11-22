import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { PresetConfigurationRepository } from '@customization/domain';
import { LocalStoragePresetRepository, PresetInitializer } from '@customization/infrastructure';

import { routes } from './app.routes';

function initializePresets(initializer: PresetInitializer): () => void {
  return () => {
    initializer.initialize();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: PresetConfigurationRepository,
      useClass: LocalStoragePresetRepository,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializePresets,
      deps: [PresetInitializer],
      multi: true,
    },
  ],
};
