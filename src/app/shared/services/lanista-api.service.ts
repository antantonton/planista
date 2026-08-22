import { Injectable } from '@angular/core'
import {
  Config,
  Consumable,
  Equipment,
  Enchant,
  Races,
  Race,
  Stat,
  WeaponSkill,
  ArmorTypes,
} from '../models/lanista-api.models'

@Injectable({
  providedIn: 'root',
})
export class LanistaApiService {
  constructor() {}

  async getConfig(): Promise<Config> {
    const config = await fetch('https://lanista.se/api/config')
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error fetching config from Lanista API, falling back to Races API:', error)
        return this._getConfigFromRaces()
      })
    return config
  }

  async getRaceInfo(): Promise<unknown> {
    return fetch(' https://lanista.se/api/races').then((response) => response.json())
  }

  async getWeapons(): Promise<Equipment[]> {
    return fetch('https://lanista.se/api/external/items/weapons/all').then((response) => response.json())
  }

  async getArmors(): Promise<Equipment[]> {
    return fetch('https://lanista.se/api/external/items/armors/all').then((response) => response.json())
  }

  async getConsumables(): Promise<Consumable[]> {
    return fetch('https://lanista.se/api/external/items/consumables/all').then((response) => response.json())
  }

  async getEnchants(): Promise<Enchant[]> {
    return fetch('https://lanista.se/api/external/items/enchants/all').then((response) => response.json())
  }

  /**
   * Returns config from the Races API endpoint
   * With a compatibility layer in between to fill in missing fields
   */
  private async _getConfigFromRaces(): Promise<Config> {
    const races: Races = await fetch('https://lanista.se/api/external/races').then((response) => response.json())
    const staminaAttributes = [0, 1, 3]
    const agilityAttributes = [4, 7]
    const trinketArmorTypes: ArmorTypes = {
      neck: 6,
      finger: 7,
      back: 8,
      amulet: 9,
      bracelet: 10,
      trinket: 11,
    }
    const blockableArmorTypes: ArmorTypes = {
      head: 0,
      shoulders: 1,
      chest: 2,
      hands: 3,
      legs: 4,
      feet: 5,
    }
    const weaponSkills: WeaponSkill[] = races.weapon_skills.map((weaponSkill) => ({
      ...weaponSkill,
      visible: true,
    }))
    const stats: Stat[] = races.stats.map((stat) => ({
      ...stat,
      visible: true,
    }))

    return {
      weapon_skills: weaponSkills,
      stats: stats,
      grouped_stats: {
        stamina: stats.filter((stat) => staminaAttributes.includes(stat.type)),
        agility: stats.filter((stat) => agilityAttributes.includes(stat.type)),
        wisdom: stats.filter(
          (stat) => !staminaAttributes.includes(stat.type) && !agilityAttributes.includes(stat.type),
        ),
      },
      trinket_armor_types: trinketArmorTypes,
      blockable_armor_types: blockableArmorTypes,
      races: races.races.map(
        (race): Race => ({
          ...race,
          type: race.id,
        }),
      ),
    }
  }
}
