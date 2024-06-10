import { inject, Injectable } from '@angular/core'

import { LanistaApiService } from './lanista-api.service'
import { BehaviorSubject, Observable } from 'rxjs'
import { Consumable, Equipment } from '../models/lanista-api.models'

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

  getConsumables(): Observable<Consumable[]> {
    return this._consumables$.asObservable()
  }
}
