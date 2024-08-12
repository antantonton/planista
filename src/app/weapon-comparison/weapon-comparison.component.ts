import { Component, inject } from '@angular/core'
import { EquipmentService } from '../shared/services/equipment.service'
import { Equipment } from '../shared/models/lanista-api.models'
import { map } from 'rxjs'
import { TitleCasePipe } from '@angular/common'
import { LanistaHelpersService } from '../shared/services/lanista-helpers.service'

type EquipmentDisplayObject = {
  name: string
  type: string
  isTwoHanded: boolean
  level: number
  damageMin: number
  damageMax: number
  damageAvg: number
  damageRoof: number
  actions: number
  durability: number
  weight: number
  modifiers: string
}

@Component({
  selector: 'app-weapon-comparison',
  templateUrl: './weapon-comparison.component.html',
  styleUrls: ['./weapon-comparison.component.css'],
})
export class WeaponComparisonComponent {
  private readonly _lanistaHelpersService = inject(LanistaHelpersService)
  private readonly _titleCasePipe = inject(TitleCasePipe)
  private readonly _equipmentService = inject(EquipmentService)
  readonly weapons$ = this._equipmentService
    .getWeapons()
    .pipe(map((weapons) => weapons.map((weapon) => this._mapWeaponToDisplayObject(weapon))))
  readonly columns: {
    field: keyof EquipmentDisplayObject
    header: string
    filterType?: 'text' | 'numeric' | 'boolean' | 'date'
  }[] = [
    {
      field: 'type',
      header: 'Type',
      filterType: 'text',
    },
    {
      field: 'isTwoHanded',
      header: '2h',
      filterType: 'boolean',
    },
    {
      field: 'level',
      header: 'Level',
      filterType: 'numeric',
    },
    {
      field: 'damageMin',
      header: 'Damage min',
    },
    {
      field: 'damageMax',
      header: 'Damage max',
    },
    {
      field: 'damageRoof',
      header: 'Damage roof',
    },
    {
      field: 'damageAvg',
      header: 'Damage avg',
    },
    {
      field: 'actions',
      header: 'Actions',
      filterType: 'numeric',
    },
    {
      field: 'durability',
      header: 'Durability',
    },
    {
      field: 'weight',
      header: 'Weight',
    },
    {
      field: 'modifiers',
      header: 'Modifiers',
      filterType: 'text',
    },
  ]

  private _mapWeaponToDisplayObject(weapon: Equipment): EquipmentDisplayObject {
    return {
      name: weapon.name,
      type: this._titleCasePipe.transform(weapon.type_name),
      isTwoHanded: weapon.is_two_handed,
      level: weapon.required_level,
      damageMin: weapon.base_damage_min,
      damageMax: weapon.base_damage_max,
      damageAvg: (weapon.base_damage_min + weapon.base_damage_max) / 2,
      damageRoof: weapon.damage_roof,
      actions: weapon.actions,
      durability: weapon.durability,
      weight: weapon.weight,
      modifiers: this._lanistaHelpersService.getModifiersLabelFromConfig(weapon.bonuses).join(', '),
    }
  }
}
