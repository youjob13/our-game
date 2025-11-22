import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sml-gameplay-page',
  template: `
    <div class="gameplay-placeholder">
      <div class="content">
        <h1>Геймплей</h1>
        <p>Здесь будет основная игра</p>
        <p class="chapter-info">Глава 1: Начало путешествия</p>
        <a routerLink="/" class="back-button">Вернуться в меню</a>
      </div>
    </div>
  `,
  styles: [
    `
      .gameplay-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        text-align: center;
      }

      .content {
        padding: 48px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 16px;
        backdrop-filter: blur(10px);
      }

      h1 {
        font-size: 48px;
        margin: 0 0 16px;
        text-transform: uppercase;
        letter-spacing: 3px;
      }

      p {
        font-size: 20px;
        margin: 0 0 16px;
        opacity: 0.9;
      }

      .chapter-info {
        font-size: 16px;
        font-style: italic;
        margin-bottom: 32px;
        opacity: 0.7;
      }

      .back-button {
        display: inline-block;
        padding: 16px 32px;
        background: rgba(255, 255, 255, 0.2);
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        color: #fff;
        text-decoration: none;
        font-size: 16px;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class GameplayPageComponent {}
