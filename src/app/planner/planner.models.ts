import { FormArray, FormControl, FormGroup } from '@angular/forms'
import { AttributeType } from '../shared/models/lanista-api.models'

export type PlannerForm = FormGroup<{
  level: FormControl<number>
  selectedAttribute: FormGroup<{
    attributeType: FormControl<AttributeType>
    type: FormControl<number>
  }>
  staminaStats: FormArray<StatForm>
  agilityStats: FormArray<StatForm>
  weaponSkills: FormArray<StatForm>
}>

export type StatForm = FormGroup<{
  name: FormControl<string>
  type: FormControl<number>
  value: FormControl<number | null>
}>
