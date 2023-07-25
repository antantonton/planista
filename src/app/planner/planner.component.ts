import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { LanistaApiService } from '../shared/services/lanista-api.service'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { PlannerForm, StatForm } from './planner.models'
import { LanistaHelpersService } from '../shared/services/lanista-helpers.service'
import { AttributeType, Config, Stat } from '../shared/models/lanista-api.models'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
})
export class PlannerComponent implements OnInit, OnDestroy {
  readonly githubLink = 'https://github.com/antantonton/planista2'
  readonly AttributeType = AttributeType
  private readonly _subscriptions = new Subscription()
  private readonly _lanistaApiService = inject(LanistaApiService)
  private readonly _lanistaHelpersService = inject(LanistaHelpersService)
  private readonly _defaultLevel = 25

  readonly statsInfoText = `Enter the desired stat points you want to have after racial modifiers have been applied.\nRemaining points will be allocated to the selected stat for comparison.`
  readonly resultsInfoText = `Displays the resulting stat points (after racial modifiers) for the selected stat.`

  readonly plannerForm: PlannerForm = new FormGroup({
    level: new FormControl(this._defaultLevel, { nonNullable: true }),
    selectedAttribute: new FormGroup({
      attributeType: new FormControl<AttributeType>(AttributeType.STAT, { nonNullable: true }),
      type: new FormControl(0, { nonNullable: true }),
    }),
    staminaStats: new FormArray<StatForm>([]),
    agilityStats: new FormArray<StatForm>([]),
    weaponSkills: new FormArray<StatForm>([]),
  })

  config: Config | undefined

  ngOnInit(): void {
    this._lanistaApiService.getConfig().then((config) => {
      console.log('Config from Lanista API: ', config)
      this.config = config

      this._initializeAttributeFormArray(
        this.plannerForm.controls.staminaStats,
        this._lanistaHelpersService.getStaminaStatsFromConfig(config),
      )
      this._initializeAttributeFormArray(
        this.plannerForm.controls.agilityStats,
        this._lanistaHelpersService.getAgilityStatsFromConfig(config),
      )
      this._initializeAttributeFormArray(
        this.plannerForm.controls.weaponSkills,
        this._lanistaHelpersService.getWeaponSkillsFromConfig(config),
      )
      this._toggleAttributeForms()
    })
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe()
  }

  onStatSelected(type: AttributeType, form: StatForm): void {
    this.plannerForm.controls.selectedAttribute.setValue({
      attributeType: type,
      type: form.controls.type.value ?? 0,
    })
    this._toggleAttributeForms()
  }

  onResetClick(): void {
    this._resetForm()
  }

  private _initializeAttributeFormArray(formArray: FormArray<StatForm>, stats: Stat[]): void {
    formArray.clear()
    for (const stat of stats) {
      formArray.push(
        new FormGroup({
          name: new FormControl(stat.name, { nonNullable: true }),
          type: new FormControl(stat.type, { nonNullable: true }),
          value: new FormControl<number | null>(null),
        }),
      )
    }
  }

  /**
   * Toggles the enabled/disabled of all stat forms
   */
  private _toggleAttributeForms(): void {
    // Enable all stat forms
    ;[
      ...this.plannerForm.controls.staminaStats.controls,
      ...this.plannerForm.controls.agilityStats.controls,
      ...this.plannerForm.controls.weaponSkills.controls,
    ].forEach((form) => form.enable())

    let attributeFormsToCheck: StatForm[] = []
    const selectedAttributeType = this.plannerForm.controls.selectedAttribute.controls.attributeType.value
    if (selectedAttributeType === AttributeType.STAT) {
      attributeFormsToCheck = [
        ...this.plannerForm.controls.staminaStats.controls,
        ...this.plannerForm.controls.agilityStats.controls,
      ]
    } else if (selectedAttributeType === AttributeType.WEAPON_SKILL) {
      attributeFormsToCheck = [...this.plannerForm.controls.weaponSkills.controls]
    }

    // Disable the selected stat form
    const selectedAttributeForm = attributeFormsToCheck.find(
      (form) => form.controls.type.value === this.plannerForm.controls.selectedAttribute.controls.type.value,
    )
    selectedAttributeForm?.controls.value.setValue(null)
    selectedAttributeForm?.disable()
  }

  /**
   * Resets the form values to their initial state
   */
  private _resetForm(): void {
    this.plannerForm.controls.level.setValue(this._defaultLevel)
    this.plannerForm.controls.selectedAttribute.setValue({
      attributeType: AttributeType.STAT,
      type: 0,
    })
    this.plannerForm.controls.staminaStats.controls.forEach((form) => form.controls.value.setValue(null))
    this.plannerForm.controls.agilityStats.controls.forEach((form) => form.controls.value.setValue(null))
    this.plannerForm.controls.weaponSkills.controls.forEach((form) => form.controls.value.setValue(null))
    this._toggleAttributeForms()
    this.plannerForm.markAsPristine()
  }
}
