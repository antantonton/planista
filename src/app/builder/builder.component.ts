import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Attribute, WeaponSkill } from '../shared/attributes/attributes'
import { AttributesService } from '../shared/attributes/attributes.service'
import { DEFAULT_RACE_DIALOG_CONFIG, RaceDialogComponent } from '../shared/race/race-dialog/race-dialog.component'
import { Race } from '../shared/race/races'
import * as _ from 'lodash'

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {

  attributes = Object.values(Attribute)
  weaponSkills = Object.values(WeaponSkill)
  races = Object.values(Race)

  infoForm: FormGroup
  attributeForm: FormGroup
  weaponSkillForm: FormGroup

  constructor(
    private _formBuilder: FormBuilder,
    private _attributesService: AttributesService,
    private _dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // Initialize weapon form
    this.weaponSkillForm = this._formBuilder.group({
      type: ['', Validators.required],
      skill: [null, Validators.min(0)],
    })

    // Subscribe to weapon changes
    this.weaponSkillForm.valueChanges.subscribe(data => {
      // Only do something is type has been set
      if (data.type) {
        // Path all weapon skills to 0, then patch the selected skill to the current value
        this.attributeForm.patchValue({
          ..._.zipObject(this.weaponSkills, _.fill(Array(this.weaponSkills.length), null)),
          [data.type]: data.skill
        })
      }
    })

    // Initialize attribute form group
    this.attributeForm = new FormGroup({})

    // Add one form control per attribute
    for (const attribute in Attribute) {
      this.attributeForm.addControl(attribute, new FormControl(null, Validators.min(0)))
    }

    // Add one form control per weapon skill
    for (const weaponSkill in WeaponSkill) {
      this.attributeForm.addControl(weaponSkill, new FormControl(null, Validators.min(0)))
    }
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
