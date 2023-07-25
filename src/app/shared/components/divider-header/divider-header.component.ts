import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-divider-header',
  templateUrl: './divider-header.component.html',
  styleUrls: ['./divider-header.component.css'],
})
export class DividerHeaderComponent {
  @Input() label = ''
  @Input() infoText = ''
  @Input() actionIcon = ''
  @Input() actionTooltip = ''
  @Output() actionClick = new EventEmitter<void>()

  onActionClicked(): void {
    this.actionClick.emit()
  }
}
