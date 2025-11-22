import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Dialog } from '@cutscene/domain';

@Component({
  selector: 'sml-lib-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrl: './dialog-box.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.has-dialog]': 'dialog() !== null',
    '[attr.data-emotion]': 'dialog()?.emotion',
  },
})
export class DialogBoxComponent {
  readonly dialog = input.required<Dialog | null>();
  readonly isTyping = input(false);
}
