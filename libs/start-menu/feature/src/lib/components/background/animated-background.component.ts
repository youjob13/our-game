import { ChangeDetectionStrategy, Component } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  duration: number;
  delay: number;
}

@Component({
  selector: 'sml-lib-animated-background',
  templateUrl: './animated-background.component.html',
  styleUrl: './animated-background.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnimatedBackgroundComponent {
  protected readonly particles: Particle[] = this.generateParticles(50);

  private generateParticles(count: number): Particle[] {
    return Array.from({ length: count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 5,
    }));
  }
}
