import { Injectable, inject } from '@angular/core'
import { DialogService } from 'primeng/dynamicdialog'
import { InfoDialogComponent } from './info-dialog.component'
import { firstValueFrom } from 'rxjs'

export interface InfoDialogData {
  text: string[]
}

@Injectable({
  providedIn: 'root',
})
export class InfoDialogService {
  private readonly _dialogService = inject(DialogService)

  constructor() {}

  async open(header: string, text: string[]): Promise<void> {
    const data: InfoDialogData = {
      text: text,
    }
    const dialogRef = this._dialogService.open(InfoDialogComponent, {
      modal: true,
      dismissableMask: true,
      width: window.innerWidth < 500 ? '100%' : '500px',
      header: header,
      data: data,
    })
    await firstValueFrom(dialogRef.onClose)
  }
}
