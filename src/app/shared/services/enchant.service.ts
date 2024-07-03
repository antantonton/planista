import { inject, Injectable } from '@angular/core'

import { LanistaApiService } from './lanista-api.service'
import { BehaviorSubject, map, Observable } from 'rxjs'
import { Enchant } from '../models/lanista-api.models'

@Injectable({
  providedIn: 'root',
})
export class EnchantService {
  private readonly _lanistaApiService = inject(LanistaApiService)

  private readonly _enchants$ = new BehaviorSubject<Enchant[]>([])

  constructor() {
    this._lanistaApiService.getEnchants().then((enchants) => {
      console.log('Enchants from Lanista API: ', enchants)
      this._enchants$.next(enchants)
    })
  }

  getEnchants(): Observable<Enchant[]> {
    return this._enchants$.asObservable()
  }
}
