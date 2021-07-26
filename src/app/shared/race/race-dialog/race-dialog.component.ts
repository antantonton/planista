import { Component, Inject, OnInit } from '@angular/core'
import { MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Attribute } from '../../attributes/attributes'
import { RACE_BONUSES } from '../races'

export const DEFAULT_RACE_DIALOG_CONFIG: MatDialogConfig = {
  autoFocus: false,
  restoreFocus: false,
  width: '20%',
}

@Component({
  selector: 'app-race-dialog',
  templateUrl: './race-dialog.component.html',
  styleUrls: ['./race-dialog.component.scss']
})
export class RaceDialogComponent implements OnInit {

  attributes = Object.values(Attribute)

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _dialogRef: MatDialogRef<RaceDialogComponent>,
  ) {}

  ngOnInit(): void {
  }

  getFormattedAttributeFactor(attribute: Attribute): number {
    return (1 - RACE_BONUSES[this.data.race][attribute]) * 100
  }

  onCloseClick(): void {
    this._dialogRef.close(false)
  }

}
