import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { ConsumableForm, EquipmentForm, PlannerForm, StatForm } from './planner.models'
import { LanistaHelpersService } from '../shared/services/lanista-helpers.service'
import { ArmorSlot, AttributeType, Config, Consumable, Equipment, Stat } from '../shared/models/lanista-api.models'
import { firstValueFrom, Subscription } from 'rxjs'
import { ConfigService } from '../shared/services/config.service'

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css'],
})
export class PlannerComponent implements OnInit, OnDestroy {
  readonly AttributeType = AttributeType
  private readonly _subscriptions = new Subscription()
  private readonly _configService = inject(ConfigService)
  private readonly _lanistaHelpersService = inject(LanistaHelpersService)
  private readonly _defaultLevel = 25

  readonly statsInfoText = `Enter the desired stat points you want to have after racial modifiers have been applied.\nRemaining points will be allocated to the selected stat for comparison.`
  readonly resultsInfoText = `Displays the resulting stat points (after racial modifiers) for the selected stat.`
  readonly equipmentInfoText = `Add equipment to see how it affects your stats. Bonuses from equipment are used to reach the desired stat points.`

  readonly plannerForm: PlannerForm = new FormGroup({
    level: new FormControl(this._defaultLevel, { nonNullable: true }),
    selectedAttribute: new FormGroup({
      attributeType: new FormControl<AttributeType>(AttributeType.STAT, { nonNullable: true }),
      type: new FormControl(0, { nonNullable: true }),
      name: new FormControl('', { nonNullable: true }),
    }),
    staminaStats: new FormArray<StatForm>([]),
    agilityStats: new FormArray<StatForm>([]),
    weaponSkills: new FormArray<StatForm>([]),
    mainHand: new FormControl<Equipment | null>(null),
    offHand: new FormControl<Equipment | null>(null),
    armors: new FormArray<EquipmentForm>([]),
    trinkets: new FormArray<EquipmentForm>([]),
    consumables: new FormArray<ConsumableForm>([]),
  })

  config: Config | undefined

  ngOnInit(): void {
    firstValueFrom(this._configService.getConfig()).then((config) => {
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
      this._initializeEquipmentFormArray(
        this.plannerForm.controls.armors,
        this._lanistaHelpersService.getArmorSlotsFromConfig(config),
      )
      this._initializeEquipmentFormArray(
        this.plannerForm.controls.trinkets,
        this._lanistaHelpersService.getTrinketSlotsFromConfig(config),
      )
      this._initializeConsumableFormArray(this.plannerForm.controls.consumables)
      this.onStatSelected(AttributeType.STAT, this.plannerForm.controls.staminaStats.controls[0])
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
      name: form.controls.name.value ?? '',
    })
    this._toggleAttributeForms()
  }

  onResetStatsClick(): void {
    this._resetStatForms()
  }

  onResetEquipmentClick(): void {
    this._resetEquipmentForms()
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

  private _initializeEquipmentFormArray(formArray: FormArray<EquipmentForm>, armorSlots: ArmorSlot[]): void {
    formArray.clear()
    for (const armorSlot of armorSlots) {
      formArray.push(
        new FormGroup({
          name: new FormControl(armorSlot.name, { nonNullable: true }),
          type: new FormControl(armorSlot.type, { nonNullable: true }),
          equipment: new FormControl<Equipment | null>(null),
        }),
      )
    }
  }

  private _initializeConsumableFormArray(formArray: FormArray<ConsumableForm>, numberOfConsumables = 3): void {
    formArray.clear()
    for (let i = 0; i < numberOfConsumables; i++) {
      formArray.push(
        new FormGroup({
          name: new FormControl(`Consumable #${i + 1}`, { nonNullable: true }),
          consumable: new FormControl<Consumable | null>(null),
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
   * Resets the stat form values to their initial state
   */
  private _resetStatForms(): void {
    this.plannerForm.controls.level.setValue(this._defaultLevel)
    this.plannerForm.controls.selectedAttribute.setValue({
      attributeType: AttributeType.STAT,
      type: 0,
      name: '',
    })
    this.plannerForm.controls.staminaStats.controls.forEach((form) => form.controls.value.setValue(null))
    this.plannerForm.controls.agilityStats.controls.forEach((form) => form.controls.value.setValue(null))
    this.plannerForm.controls.weaponSkills.controls.forEach((form) => form.controls.value.setValue(null))
    this._toggleAttributeForms()
  }

  /**
   * Resets the equipment form values to their initial state
   */
  private _resetEquipmentForms(): void {
    this.plannerForm.controls.mainHand.setValue(null)
    this.plannerForm.controls.offHand.setValue(null)
    this.plannerForm.controls.armors.controls.forEach((form) => form.controls.equipment.setValue(null))
    this.plannerForm.controls.trinkets.controls.forEach((form) => form.controls.equipment.setValue(null))
  }
}
