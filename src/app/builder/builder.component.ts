import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Attribute } from '../shared/attributes/attributes'
import { AttributesService } from '../shared/attributes/attributes.service'
import { DEFAULT_RACE_DIALOG_CONFIG, RaceDialogComponent } from '../shared/race/race-dialog/race-dialog.component'
import { Race } from '../shared/race/races'

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {

  attributes = Object.values(Attribute)
  races = Object.values(Race)

  infoForm: FormGroup
  attributeForm: FormGroup
  weaponTypeControl: FormControl = new FormControl('', Validators.required)

  constructor(
    private _formBuilder: FormBuilder,
    private _attributesService: AttributesService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {


    this.infoForm = this._formBuilder.group({
      name: ['', Validators.required],
      level: [0, Validators.min(0)],
    })


    // Initialize attribute form group
    this.attributeForm = new FormGroup({})

    // Add one form control per attribute
    for (const attribute in Attribute) {
      this.attributeForm.addControl(attribute, new FormControl(0, Validators.min(0)))
    }

    console.log('attributeForm: ', this.attributeForm)
  }

  getRemainingPoints(race: Race): number {
    return this._attributesService.getRemainingPoints(25, race, this.attributeForm.value)
  }

  getRemainingPontsColor(race: Race): string {
    return this.getRemainingPoints(race) < 0 ? 'red' : 'green'
  }

  onRaceItemClicked(race: Race): void {
    this._dialog.open(
      RaceDialogComponent,
      {
        ...DEFAULT_RACE_DIALOG_CONFIG,
        data: {race: race}
      },
    )
  }

}
