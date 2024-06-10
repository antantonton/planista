import { inject, Injectable } from '@angular/core'

import { LanistaApiService } from './lanista-api.service'
import { BehaviorSubject, filter, Observable } from 'rxjs'
import { Config } from '../models/lanista-api.models'

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly _lanistaApiService = inject(LanistaApiService)

  private readonly _config$ = new BehaviorSubject<Config | null>(null)

  constructor() {
    this._lanistaApiService.getConfig().then((config) => {
      console.log('Config from Lanista API: ', config)
      this._config$.next(config)
    })
  }

  getConfig(): Observable<Config> {
    return this._config$.asObservable().pipe(filter(Boolean))
  }
}
