import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-info-button',
  templateUrl: './info-button.component.html',
  styleUrls: ['./info-button.component.css'],
})
export class InfoButtonComponent {
  @Input() icon = 'pi pi-info-circle'
  @Input() label = ''
  @Input() text: string[] = []
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'left'
  dialogVisible = false

  showDialog() {
    this.dialogVisible = true
  }
}
