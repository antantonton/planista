import { inject, Injectable } from '@angular/core'

import { LanistaApiService } from './lanista-api.service'
import { BehaviorSubject, map, Observable } from 'rxjs'
import { Consumable } from '../models/lanista-api.models'

@Injectable({
  providedIn: 'root',
})
export class ConsumableService {
  private readonly _lanistaApiService = inject(LanistaApiService)
  private readonly _consumables$ = new BehaviorSubject<Consumable[]>([])

  constructor() {
    this._lanistaApiService.getConsumables().then((consumables) => {
      console.log('Consumables from Lanista API: ', consumables)
      this._consumables$.next(consumables)
    })
  }

  getConsumables(onlyStandard = true): Observable<Consumable[]> {
    return this._consumables$
      .asObservable()
      .pipe(
        map((consumables) => consumables.filter((consumable) => (onlyStandard ? !consumable.for_live_battle : true))),
      )
  }
}
