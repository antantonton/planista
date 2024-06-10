import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { AttributeType, Equipment } from '../shared/models/lanista-api.models'

export type PlannerForm = FormGroup<{
  level: FormControl<number>
  selectedAttribute: FormGroup<{
    attributeType: FormControl<AttributeType>
    type: FormControl<number>
    name: FormControl<string>
  }>
  staminaStats: FormArray<StatForm>
  agilityStats: FormArray<StatForm>
  weaponSkills: FormArray<StatForm>

  // Equipment
  mainHand: FormControl<Equipment | null>
  offHand: FormControl<Equipment | null>
  armors: FormArray<EquipmentForm>
  trinkets: FormArray<EquipmentForm>
}>

export type StatForm = FormGroup<{
  name: FormControl<string>
  type: FormControl<number>
  value: FormControl<number | null>
}>

export type EquipmentForm = FormGroup<{
  name: FormControl<string>
  type: FormControl<number>
  equipment: FormControl<Equipment | null>
}>
