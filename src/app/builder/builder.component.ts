import { Component, OnInit } from '@angular/core'
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { Attribute, WeaponSkill } from '../shared/attributes/attributes'
import { AttributesService } from '../shared/attributes/attributes.service'
import { DEFAULT_RACE_DIALOG_CONFIG, RaceDialogComponent } from '../shared/race/race-dialog/race-dialog.component'
import { Race, RACE_MODIFIERS } from '../shared/race/races'
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

  defaultLockedAttrbute: Attribute | WeaponSkill = Attribute.STAMINA
  lockedAttribute: Attribute | WeaponSkill = this.defaultLockedAttrbute
  level: number = 25

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
      type: [null],
      skill: [{ value: null, disabled: true }, Validators.min(0)],
    })

    // Subscribe to weapon changes
    this.weaponSkillForm.valueChanges.subscribe(data => {
      // Only do something is type has been set
      if (data.type) {
        // Enable the number field
        this.weaponSkillForm.controls.skill.enable({emitEvent: false})

        // Path all weapon skills to 0, then patch the selected skill to the current value
        this.attributeForm.patchValue({
          ..._.zipObject(this.weaponSkills, _.fill(Array(this.weaponSkills.length), null)),
          [data.type]: data.skill ?? null
        })
      }
      else {
        // Disable the number field
        this.weaponSkillForm.controls.skill.disable({emitEvent: false})
      }
    })

    // Initialize attribute form group
    this.attributeForm = new FormGroup({})

    // Add one form control per attribute
    for (const attribute in Attribute) {
      this.attributeForm.addControl(
        attribute,
        new FormControl({ value: null, disabled: this.isAttributeLocked(attribute as Attribute) }, Validators.min(0))
      )
    }

    // Add one form control per weapon skill
    for (const weaponSkill in WeaponSkill) {
      this.attributeForm.addControl(
        weaponSkill,
        new FormControl({ value: null, disabled: this.isWeaponSkillLocked() }, Validators.min(0))
      )
    }
  }

  /**
   * Callback function for clicks on the lock icon
   * @param attribute 
   */
  onLockClick(attribute?: Attribute): void {
    // Set the new locked attribute
    this.lockedAttribute = attribute

    // Enable all forms
    this.weaponSkillForm.enable()
    this.attributeForm.enable()

    // Get the locked form, patch it to null, then disable it
    const form: AbstractControl = this.lockedAttribute ? this.attributeForm.controls[attribute] : this.weaponSkillForm.controls.skill
    form.patchValue(null)
    form.disable()
  }

   /**
   * Callback function for the reset button
   */
  onResetClick(): void {
    // Reset all form and locked attribute to defaults
    this.weaponSkillForm.setValue({type: '', skill: null})
    Object.values(this.attributeForm.controls).forEach(control => control.setValue(null))
    this.lockedAttribute = this.defaultLockedAttrbute
  }

  /**
   * Checks if the given attribute is locked
   * @param attribute 
   * @returns 
   */
  isAttributeLocked(attribute: Attribute): boolean {
    return attribute === this.lockedAttribute
  }

  /**
   * Checks if weapon skill is locked
   * @returns 
   */
  isWeaponSkillLocked(): boolean {
    return !this.lockedAttribute
  }

  /**
   * Returns the points after modifiers for the locked attribute
   * @param race 
   * @returns 
   */
  getLockedAttributePoints(race: Race): number {
    const lockedAttribute: Attribute | WeaponSkill = this.lockedAttribute ?? this.weaponSkillForm.value.type
    return this._attributesService.getRemainingPoints(this.level, race, this.attributeForm.value) * RACE_MODIFIERS[race][lockedAttribute]
  }

  /**
   * Returns the color to use for the remaining points
   * @param race 
   * @returns 
   */
  getLockedAttributePointsColor(race: Race): string {
    return this.getLockedAttributePoints(race) < 0 ? 'red' : 'green'
  }

  /**
   * Callback function for clicking a race list item
   * @param race 
   */
  onRaceItemClicked(race: Race): void {
    this._dialog.open(
      RaceDialogComponent,
      {
        ...DEFAULT_RACE_DIALOG_CONFIG,
        data: {race: race}
      },
    )
  }

  /**
   * Returns a tooltip for the results title
   * @returns 
   */
  getDesiredAttributesTooltip(): string {
    return `Enter the desired attribute points you want to have after racial modifiers have been applied.`
  }

  /**
   * Returns a tooltip for the results title
   * @returns 
   */
  getResultsTooltip(): string {
    return `Displays the amount remaining points after the desired attributes have been achieved for each race.
      A negative result means that the desired attribute points can not be achieved for the given race and level.`
  }

}
