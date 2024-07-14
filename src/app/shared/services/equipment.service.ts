import { inject, Injectable } from '@angular/core'

import { LanistaApiService } from './lanista-api.service'
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs'
import { Equipment } from '../models/lanista-api.models'
import { ConfigService } from './config.service'
import { LanistaHelpersService } from './lanista-helpers.service'

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private readonly _lanistaApiService = inject(LanistaApiService)
  private readonly _configService = inject(ConfigService)
  private readonly _weapons$ = new BehaviorSubject<Equipment[]>([])
  private readonly _armors$ = new BehaviorSubject<Equipment[]>([])
  private readonly _lanistaHelpersService = inject(LanistaHelpersService)

  constructor() {
    this._lanistaApiService.getWeapons().then((weapons) => {
      console.log('Weapons from Lanista API: ', weapons)
      this._weapons$.next(weapons)
    })

    this._lanistaApiService.getArmors().then((armors) => {
      console.log('Armors from Lanista API: ', armors)
      this._armors$.next(armors)
    })
  }

  getWeapons(): Observable<Equipment[]> {
    return this._weapons$.asObservable()
  }

  getArmors(): Observable<Equipment[]> {
    return this._armors$.asObservable()
  }

  getTrinkets(): Observable<Equipment[]> {
    return combineLatest([this._armors$, this._configService.getConfig()]).pipe(
      map(([armors, config]) => {
        return armors.filter((armor) =>
          this._lanistaHelpersService
            .getTrinketSlotsFromConfig(config)
            .some((armorType) => armorType.type === armor.type),
        )
      }),
    )
  }
}
