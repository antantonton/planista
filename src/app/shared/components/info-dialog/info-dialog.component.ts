import { Component, inject } from '@angular/core'
import { DynamicDialogConfig } from 'primeng/dynamicdialog'

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrls: ['./info-dialog.component.css'],
})
export class InfoDialogComponent {
  private readonly _dialogConfig = inject(DynamicDialogConfig)
  readonly text: string[] = this._dialogConfig.data.text
}
