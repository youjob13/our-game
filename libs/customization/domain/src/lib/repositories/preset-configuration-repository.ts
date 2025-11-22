import { Injectable } from '@angular/core';

import { PresetConfiguration } from '../entities/preset-configuration';

@Injectable()
export abstract class PresetConfigurationRepository {
  abstract save(configuration: PresetConfiguration): Promise<void>;
  abstract load(): Promise<PresetConfiguration>;
  abstract clear(): Promise<void>;
}
