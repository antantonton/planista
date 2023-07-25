import { Injectable, inject } from '@angular/core'
import {
  AttributeType,
  Config,
  POINTS_PER_LEVEL,
  Race,
  STARTING_POINTS,
  Stat,
  WeaponSkill,
} from '../models/lanista-api.models'
import { sortBy } from 'lodash'
import { LabelPipe } from '../pipes/label.pipe'
import { DecimalPipe } from '@angular/common'
import { PlannerForm } from 'src/app/planner/planner.models'

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

  getAllocatedPointsLabelforRace(race: Race, plannerForm: PlannerForm): string[] {
    const pointsLabels: string[] = []

    // Stats
    for (const statForm of [
      ...plannerForm.controls.staminaStats.controls,
      ...plannerForm.controls.agilityStats.controls,
    ]) {
      const modifier =
        race.bonuses.stats.find((statModifier) => statModifier.type === statForm.controls.type.value)?.value ?? 1
      const points = statForm.controls.value.value ?? 0
      const nameLabel = this._labelPipe.transform(statForm.controls.name.value)
      const pointsLabel = this._decimalPipe.transform(points / modifier, '1.0-0')
      pointsLabels.push(`${nameLabel}: ${pointsLabel}`)
    }

    // Add empty character between sections
    pointsLabels.push('‎')

    // Weapon skills
    for (const weaponSkillForm of plannerForm.controls.weaponSkills.controls) {
      const modifier =
        race.bonuses.weapon_skills.find((statModifier) => statModifier.type === weaponSkillForm.controls.type.value)
          ?.value ?? 1
      const points = weaponSkillForm.controls.value.value ?? 0
      const nameLabel = this._labelPipe.transform(weaponSkillForm.controls.name.value)
      const pointsLabel = this._decimalPipe.transform(points / modifier, '1.0-0')
      pointsLabels.push(`${nameLabel}: ${pointsLabel}`)
    }

    return pointsLabels
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

  getModifiedPointsInSelectedAttribute(race: Race, plannerForm: PlannerForm): number {
    let modifier = 1
    if (plannerForm.controls.selectedAttribute.controls.attributeType.value === AttributeType.STAT) {
      modifier =
        race.bonuses.stats.find(
          (statModifier) => statModifier.type === plannerForm.controls.selectedAttribute.controls.type.value,
        )?.value ?? 1
    } else if (plannerForm.controls.selectedAttribute.controls.attributeType.value === AttributeType.WEAPON_SKILL) {
      modifier =
        race.bonuses.weapon_skills.find(
          (statModifier) => statModifier.type === plannerForm.controls.selectedAttribute.controls.type.value,
        )?.value ?? 1
    }
    return this._getRemainingPoints(race, plannerForm) * modifier
  }

  private _getRemainingPoints(race: Race, plannerForm: PlannerForm): number {
    // Get the total number of points that can be allocated
    const totalPoints: number = this.getPointsForLevel(plannerForm.controls.level.value)

    // Calculate how many points have to be sent to achieve the given attribute allocation
    let spentPoints: number = 0

    // Stats
    for (const statForm of [
      ...plannerForm.controls.staminaStats.controls,
      ...plannerForm.controls.agilityStats.controls,
    ]) {
      const modifier =
        race.bonuses.stats.find((statModifier) => statModifier.type === statForm.controls.type.value)?.value ?? 1
      const points = statForm.controls.value.value ?? 0
      spentPoints = spentPoints + points / modifier
    }

    // Weapon skills
    for (const weaponSkillForm of plannerForm.controls.weaponSkills.controls) {
      const modifier =
        race.bonuses.weapon_skills.find((statModifier) => statModifier.type === weaponSkillForm.controls.type.value)
          ?.value ?? 1
      const points = weaponSkillForm.controls.value.value ?? 0
      spentPoints = spentPoints + points / modifier
    }

    // Return the difference between total and spent points
    return totalPoints - spentPoints
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
