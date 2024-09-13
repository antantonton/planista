import { Component, EventEmitter, Input, Output, inject } from '@angular/core'
import { InfoDialogService } from '../info-dialog/info-dialog.service'

@Component({
  selector: 'app-divider-header',
  templateUrl: './divider-header.component.html',
  styleUrls: ['./divider-header.component.css'],
})
export class DividerHeaderComponent {
  private readonly _infoDialogService = inject(InfoDialogService)

  @Input() label = ''
  @Input() infoText: string[] = []
  @Input() actionIcon = ''
  @Input() actionTooltip = ''
  @Output() actionClick = new EventEmitter<void>()

  onActionClicked(): void {
    this.actionClick.emit()
  }

  onInfoClicked(): void {
    this._infoDialogService.open(this.label, this.infoText)
  }
}
