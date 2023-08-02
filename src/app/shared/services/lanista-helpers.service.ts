import { Injectable, inject } from '@angular/core'
import {
  ArmorSlot,
  AttributeType,
  Config,
  Equipment,
  POINTS_PER_LEVEL,
  Race,
  STARTING_POINTS,
  Stat,
  WeaponSkill,
} from '../models/lanista-api.models'
import { sortBy } from 'lodash'
import { LabelPipe } from '../pipes/label.pipe'
import { DecimalPipe } from '@angular/common'

@Injectable({
  providedIn: 'root',
})
export class LanistaHelpersService {
  private readonly _labelPipe = inject(LabelPipe)
  private readonly _decimalPipe = inject(DecimalPipe)

  constructor() {}

  getStaminaStatsFromConfig(config: Config): Stat[] {
    return sortBy(
      config.grouped_stats.stamina.filter((stat) => stat.visible),
      (stat) => stat.type,
    )
  }

  getAgilityStatsFromConfig(config: Config): Stat[] {
    return sortBy(
      config.grouped_stats.agility.filter((stat) => stat.visible),
      (stat) => stat.type,
    )
  }

  getWeaponSkillsFromConfig(config: Config): WeaponSkill[] {
    return sortBy(
      config.weapon_skills.filter((weaponSkill) => weaponSkill.visible),
      (weaponSkill) => weaponSkill.type,
    )
  }

  getRacesFromConfig(config: Config): Race[] {
    return sortBy(config.races, (race) => race.type)
  }

  getArmorSlotsFromConfig(config: Config): ArmorSlot[] {
    return sortBy(
      Object.entries(config.blockable_armor_types).map(([key, value]) => {
        return { name: key, type: value }
      }),
      (slot) => slot.type,
    )
  }

  getMainHandWeaponsFromWeapons(weapons: Equipment[]): Equipment[] {
    return sortBy(
      weapons.filter((weapon) => {
        if (weapon.is_shield) {
          return false
        } else if (weapon.is_ranged) {
          return false
        } else if (weapon.is_weapon) {
          return true
        } else {
          return false
        }
      }),
      (weapon) => weapon.type,
    )
  }

  getOffHandWeaponsFromWeapons(weapons: Equipment[]): Equipment[] {
    return sortBy(
      weapons.filter((weapon) => {
        if (weapon.is_shield) {
          return true
        } else if (weapon.is_ranged) {
          return false
        } else if (weapon.is_two_handed) {
          return false
        } else if (weapon.is_weapon && weapon.can_dual_wield) {
          return true
        } else {
          return false
        }
      }),
      (weapon) => weapon.type,
    )
  }

  getTrinketSlotsFromConfig(config: Config): ArmorSlot[] {
    return sortBy(
      Object.entries(config.trinket_armor_types).map(([key, value]) => {
        return { name: key, type: value }
      }),
      (slot) => slot.type,
    )
  }

  getPointsForLevel(level: number): number {
    return STARTING_POINTS + POINTS_PER_LEVEL * (level - 1)
  }

  getNameForAttribute(attributeType: AttributeType, type: number, config: Config): string {
    if (attributeType === AttributeType.STAT) {
      return (
        [...this.getStaminaStatsFromConfig(config), ...this.getAgilityStatsFromConfig(config)].find(
          (stat) => stat.type === type,
        )?.name ?? ''
      )
    } else if (attributeType === AttributeType.WEAPON_SKILL) {
      return this.getWeaponSkillsFromConfig(config).find((stat) => stat.type === type)?.name ?? ''
    } else {
      return ''
    }
  }

  getModifiersLabelForRaceFromConfig(race: Race, config: Config): string[] {
    const modifierLabels: string[] = []

    // Stats
    const stats = [...this.getStaminaStatsFromConfig(config), ...this.getAgilityStatsFromConfig(config)]
    for (const stat of stats) {
      const statModifier = race.bonuses.stats.find((statModifier) => statModifier.type === stat.type)
      const nameLabel = this._labelPipe.transform(stat.name)
      const modifierLabel = this._getModifierLabel(statModifier?.value ?? 0)
      modifierLabels.push(`${nameLabel}: ${modifierLabel}`)
    }

    // Add empty character between sections
    modifierLabels.push('‎')

    // Weapon Skills
    const weaponSkills = this.getWeaponSkillsFromConfig(config)
    for (const weaponSkill of weaponSkills) {
      const statModifier = race.bonuses.weapon_skills.find((statModifier) => statModifier.type === weaponSkill.type)
      const nameLabel = this._labelPipe.transform(weaponSkill.name)
      const modifierLabel = this._getModifierLabel(statModifier?.value ?? 0)
      modifierLabels.push(`${nameLabel}: ${modifierLabel}`)
    }

    return modifierLabels
  }

  getModifiersLabelForEquipmentFromConfig(equipment: Equipment, config: Config): string[] {
    const modifierLabels: string[] = ['TODO']
    return modifierLabels
  }

  private _getModifierLabel(modifier: number): string {
    const percentage = this._decimalPipe.transform((modifier - 1) * 100, '1.0-0') + '%'
    if (modifier > 1) {
      return `+${percentage}`
    } else {
      return `${percentage}`
    }
  }
}
