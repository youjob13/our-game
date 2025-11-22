import { Injectable, Type } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BackgroundComponentRegistry {
  private readonly registry = new Map<string, Type<unknown>>();

  register(name: string, component: Type<unknown>): void {
    if (this.registry.has(name)) {
      console.warn(`Background component "${name}" is already registered. Overwriting.`);
    }
    this.registry.set(name, component);
  }

  get(name: string): Type<unknown> | undefined {
    return this.registry.get(name);
  }

  has(name: string): boolean {
    return this.registry.has(name);
  }

  getRegisteredNames(): string[] {
    return Array.from(this.registry.keys());
  }
}
