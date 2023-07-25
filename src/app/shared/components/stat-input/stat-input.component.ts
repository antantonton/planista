import { Component, EventEmitter, Input, Output } from '@angular/core'
import { StatForm } from 'src/app/planner/planner.models'

@Component({
  selector: 'app-stat-input',
  templateUrl: './stat-input.component.html',
  styleUrls: ['./stat-input.component.css'],
})
export class StatInputComponent {
  @Input() selected = false
  @Input() showToggle = true
  @Input() statForm!: StatForm
  @Output() onSelected = new EventEmitter<void>()

  onRadioButtonClick(): void {
    if (!this.selected) {
      this.onSelected.emit()
    }
  }
}
