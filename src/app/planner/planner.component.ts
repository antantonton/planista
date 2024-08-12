import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { ConsumableForm, EquipmentForm, PlannerForm, StatForm } from './planner.models'
import { LanistaHelpersService } from '../shared/services/lanista-helpers.service'
import { ArmorSlot, AttributeType, Config, Consumable, Equipment, Stat } from '../shared/models/lanista-api.models'
import { firstValueFrom, Subscription } from 'rxjs'
import { ConfigService } from '../shared/services/config.service'
import { ActivatedRoute, Router } from '@angular/router'
import { state } from '@angular/animations'

export type FormState = {
  level?: number | null
  selectedAttribute?: number | null
  staminaStats?: (number | undefined | null)[]
  agilityStats?: (number | undefined | null)[]
  weaponSkills?: (number | undefined | null)[]
  mainHand?: number | null
  offHand?: number | null
  armors?: (number | undefined | null)[]
  trinkets?: (number | undefined | null)[]
  consumables?: (number | undefined | null)[]
}

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
  private readonly _route = inject(ActivatedRoute)
  private readonly _router = inject(Router)
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
    const savedBuild = this._route.snapshot.queryParams?.['build']
    if (savedBuild) {
      const stateStrings = savedBuild.split('-')

      // const decodedBuild = atob(savedBuild)
      // const formState = JSON.parse(decodedBuild) as FormState
      // console.log('formState from url: ', formState)
      // this.plannerForm.controls.level.setValue(formState.level ?? this._defaultLevel)
      // this.plannerForm.controls.selectedAttribute.setValue({
      //   attributeType: formState.selectedAttribute ?? AttributeType.STAT,
      //   type: formState.selectedAttribute ?? 0,
      //   name: '',
      // })
      // this._initializeAttributeFormArray(this.plannerForm.controls.staminaStats, formState.staminaStats ?? [])
      // this._initializeAttributeFormArray(this.plannerForm.controls.agilityStats, formState.agilityStats ?? [])
      // this._initializeAttributeFormArray(this.plannerForm.controls.weaponSkills, formState.weaponSkills ?? [])
      // this._initializeEquipmentFormArray(this.plannerForm.controls.armors, formState.armors ?? [])
      // this._initializeEquipmentFormArray(this.plannerForm.controls.trinkets, formState.trinkets ?? [])
      // this._initializeConsumableFormArray(this.plannerForm.controls.consumables)
      // this.onStatSelected(AttributeType.STAT, this.plannerForm.controls.staminaStats.controls[0])
      // this._toggleAttributeForms()
    }

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

      this._subscriptions.add(
        this.plannerForm.valueChanges.subscribe((value) => {
          // level-selectedAttribute-staminaStats-agilityStats-weaponSkills-mainHand-offHand-armors-trinkets-consumables
          const stateStrings: string[] = []
          stateStrings.push(value?.level?.toString()?.padStart(2, '0') ?? '00')
          stateStrings.push(value?.selectedAttribute?.type?.toString()?.padStart(2, '0') ?? '00')

          // Stats
          stateStrings.push(
            [
              ...(value?.staminaStats?.map((stat) => stat.value?.toString()?.padStart(3, '0') ?? '000').join('') ?? ''),
              ...(value?.agilityStats?.map((stat) => stat.value?.toString()?.padStart(3, '0') ?? '000').join('') ?? ''),
              ...(value?.weaponSkills?.map((stat) => stat.value?.toString()?.padStart(3, '0') ?? '000').join('') ?? ''),
            ].join(''),
          )

          // Equipment
          stateStrings.push(
            [
              value?.mainHand?.id?.toString()?.padStart(3, '0') ?? '000',
              value?.offHand?.id?.toString()?.padStart(3, '0') ?? '000',
              ...(value?.armors?.map((armor) => armor.equipment?.id?.toString()?.padStart(3, '0') ?? '000').join('') ??
                ''),
              ...(value?.trinkets
                ?.map((trinket) => trinket.equipment?.id?.toString()?.padStart(3, '0') ?? '000')
                .join('') ?? ''),
              ...(value?.consumables
                ?.map((consumable) => consumable.consumable?.id?.toString()?.padStart(3, '0') ?? '000')
                ?.join('') ?? ''),
            ].join(''),
          )

          const stateString = stateStrings.join('-')
          console.log('stateString: ', stateString)

          const formState: FormState = {
            level: value.level,
            selectedAttribute: value?.selectedAttribute?.type,
            staminaStats: value?.staminaStats?.map((stat) => stat.value),
            agilityStats: value?.agilityStats?.map((stat) => stat.value),
            weaponSkills: value?.weaponSkills?.map((stat) => stat.value),
            mainHand: value.mainHand?.id,
            offHand: value.offHand?.id,
            armors: value?.armors?.map((armor) => armor.equipment?.id),
            trinkets: value?.trinkets?.map((trinket) => trinket.equipment?.id),
            consumables: value?.consumables?.map((consumable) => consumable.consumable?.id),
          }

          console.log('formState: ', formState)

          const stringifiedValue = JSON.stringify(formState, null, 2)
          // console.log('stringifiedValue: ', stringifiedValue)

          const base64Value = btoa(stringifiedValue)
          // console.log('base64Value: ', base64Value)
          console.log('base64Value.length: ', base64Value.length)

          const queryString = this.objectToQueryString(formState)
          console.log('queryString.length: ', queryString.length)
          this._router.navigate([], {
            relativeTo: this._route,
            // queryParams: { build: base64Value },
            // queryParams: { build: this.objectToQueryString(formState) },
            queryParams: { build: stateString },
            // queryParamsHandling: 'merge',
            // skipLocationChange: true,
          })
        }),
      )
    })
  }

  objectToQueryString(obj: any): string {
    const keys = Object.keys(obj)
    const keyValuePairs = keys.map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
    })
    // more code goes here
    return keyValuePairs.join('&')
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
