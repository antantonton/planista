import { Injectable } from '@angular/core'
import axios from 'axios'
import { from, Observable } from 'rxjs'
import { Weapon, WeaponType } from './weapon.models'
import { sortBy } from 'lodash'

@Injectable({
  providedIn: 'root',
})
export class ItemApiService {
  constructor() {}

  getWeapons(): Observable<Weapon[]> {
    const weaponPromise = axios
      .get('https://beta.lanista.se/api/external/items/weapons/all')
      .then((response) => sortBy(response.data, (weapon: Weapon) => weapon.required_level))
    return from(weaponPromise)
  }

  getWeaponTypes(): Observable<WeaponType> {
    const weaponPromise = axios.get('https://beta.lanista.se/api/config').then((response) => {
      return response.data.weapon_types
    })
    return from(weaponPromise)
  }
}
