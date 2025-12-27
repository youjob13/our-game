import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FlappyBirdComponent } from './flappy-bird/flappy-bird.component';

@Component({
  selector: 'sml-gameplay-page',
  template: `
    <div class="gameplay-container">
      <sml-flappy-bird #flappyBird />
      @if (flappyBird.isGameOver()) {
        <div class="back-button-container">
          <a routerLink="/" class="back-button">Вернуться в меню</a>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .gameplay-container {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background: #30c0df;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .back-button-container {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
      }

      .back-button {
        display: inline-block;
        padding: 12px 24px;
        background: rgba(255, 255, 255, 0.9);
        border: 2px solid rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        color: #333;
        text-decoration: none;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

        &:hover {
          background: rgba(255, 255, 255, 1);
          border-color: rgba(0, 0, 0, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 6px 8px rgba(0, 0, 0, 0.3);
        }

        &:active {
          transform: translateY(0);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FlappyBirdComponent, RouterLink],
})
export class GameplayPageComponent {}
