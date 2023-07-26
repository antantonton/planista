import { Form, FormArray, FormControl, FormGroup } from '@angular/forms'
import { AttributeType, Equipment } from '../shared/models/lanista-api.models'

export type PlannerForm = FormGroup<{
  level: FormControl<number>
  selectedAttribute: FormGroup<{
    attributeType: FormControl<AttributeType>
    type: FormControl<number>
  }>
  staminaStats: FormArray<StatForm>
  agilityStats: FormArray<StatForm>
  weaponSkills: FormArray<StatForm>
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
