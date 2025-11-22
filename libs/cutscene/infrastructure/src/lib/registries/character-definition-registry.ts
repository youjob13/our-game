import { Injectable, Type } from '@angular/core';
import { DanilCharacterComponent, SanyaCharacterComponent } from '@cutscene/ui';

@Injectable({ providedIn: 'root' })
export class CharacterDefinitionRegistry {
  private readonly characters = new Map<string, Type<unknown>>();

  constructor() {
    this.register('danil', DanilCharacterComponent);
    this.register('sanya', SanyaCharacterComponent);
  }

  register(characterId: string, component: Type<unknown>): void {
    if (this.characters.has(characterId)) {
      console.warn(`Character "${characterId}" is already registered. Overwriting.`);
    }
    this.characters.set(characterId, component);
  }

  get(characterId: string): Type<unknown> | undefined {
    return this.characters.get(characterId);
  }

  has(characterId: string): boolean {
    return this.characters.has(characterId);
  }

  getRegisteredIds(): string[] {
    return Array.from(this.characters.keys());
  }
}
