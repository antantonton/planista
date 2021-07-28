import { Component, OnInit } from '@angular/core'
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Attribute, WeaponSkill } from '../shared/attributes/attributes'
import * as _ from 'lodash'
import { AttributesService } from '../shared/attributes/attributes.service'
import { Race, RACE_MODIFIERS } from '../shared/race/races'

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {

  level: number = 25

  attributes = Object.values(Attribute)
  weaponSkills = Object.values(WeaponSkill)

  defaultLockedAttrbute: Attribute | WeaponSkill = Attribute.STAMINA
  lockedAttribute: Attribute | WeaponSkill = this.defaultLockedAttrbute

  attributeForm: FormGroup
  weaponSkillForm: FormGroup

  constructor(
    private _formBuilder: FormBuilder,
    private _attributesService: AttributesService,
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
   * Returns a tooltip for the results title
   * @returns 
   */
  getDesiredAttributesTooltip(): string {
    return `Enter the desired attribute points you want to have after racial modifiers have been applied`
  }

  /**
   * Returns the total number of points that can be allocated for the given level
   * @returns 
   */
  getTotalPoints(): number {
    return this._attributesService.getPointsByLevel(this.level)
  }

}
