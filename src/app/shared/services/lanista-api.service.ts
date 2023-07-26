import { Injectable } from '@angular/core'
import { Config, Equipment } from '../models/lanista-api.models'

@Injectable({
  providedIn: 'root',
})
export class LanistaApiService {
  constructor() {}

  async getConfig(): Promise<Config> {
    return fetch('https://beta.lanista.se/api/config').then((response) => response.json())
  }

  async getRaceInfo(): Promise<unknown> {
    return fetch(' https://beta.lanista.se/api/races').then((response) => response.json())
  }

  async getWeapons(): Promise<unknown> {
    return fetch('https://beta.lanista.se/api/external/items/weapons/all').then((response) => response.json())
  }

  async getArmors(): Promise<Equipment[]> {
    return fetch('https://beta.lanista.se/api/external/items/armors/all').then((response) => response.json())
  }

  async getConsumables(): Promise<unknown> {
    return fetch('https://beta.lanista.se/api/external/items/consumables/all').then((response) => response.json())
  }
}
