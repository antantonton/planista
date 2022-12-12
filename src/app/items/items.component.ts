import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { combineLatest, map, Observable, startWith } from 'rxjs'
import { ItemApiService } from './item-api.service'
import { Weapon, WeaponType } from './weapon.models'
import { uniq } from 'lodash'

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {
  readonly filterForm: FormGroup<{
    type: FormControl<{ key: string; value: number }>
    level: FormControl<number>
    name: FormControl<string>
  }> = new FormGroup({
    type: new FormControl(),
    level: new FormControl(),
    name: new FormControl(),
  })

  readonly weaponTypes$: Observable<WeaponType> = this._itemApiService.getWeaponTypes()
  readonly allWeapons$: Observable<Weapon[]> = this._itemApiService.getWeapons()

  readonly filteredWeapons$: Observable<Weapon[]> = combineLatest([
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.value)),
    this.allWeapons$,
  ]).pipe(
    map(([filter, weapons]) => {
      const filteredWeapons = weapons.filter((weapon) => {
        const matchesLevel = filter.level ? weapon.required_level === filter.level : true
        const matchesType = filter.type ? weapon.type === filter.type.value : true

        const matchesName = filter.name
          ? weapon.name.toLowerCase().trim().includes(filter.name.toLowerCase().trim())
          : true
        return matchesLevel && matchesType && matchesName
      })
      return filteredWeapons
    }),
  )

  readonly levels$: Observable<number[]> = this.allWeapons$.pipe(
    map((weapons) => {
      const levels = weapons.map((weapon) => weapon.required_level)
      return uniq(levels)
    }),
  )

  constructor(private _itemApiService: ItemApiService) {}

  ngOnInit(): void {}

  onClearClick(): void {
    this.filterForm.setValue({
      type: null,
      level: null,
      name: null,
    })
  }
}
