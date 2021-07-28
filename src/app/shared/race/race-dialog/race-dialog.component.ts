import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Attribute, WeaponSkill } from '../../attributes/attributes'
import { RACE_MODIFIERS } from '../races'

export const DEFAULT_RACE_DIALOG_CONFIG: MatDialogConfig = {
  autoFocus: false,
  restoreFocus: false,
  width: '300px',
  maxHeight: '90vh'
}

@Component({
  selector: 'app-race-dialog',
  templateUrl: './race-dialog.component.html',
  styleUrls: ['./race-dialog.component.scss']
})
export class RaceDialogComponent implements OnInit {

  attributes = [...Object.values(Attribute), ...Object.values(WeaponSkill)]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<RaceDialogComponent>,
  ) {}

  ngOnInit(): void {
  }

  getFormattedAttributeFactor(attribute: Attribute): number {
    return (1 - RACE_MODIFIERS[this.data.race][attribute]) * 100
  }

  onCloseClick(): void {
    this._dialogRef.close(false)
  }

}
