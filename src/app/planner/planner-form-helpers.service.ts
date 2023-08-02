import { Injectable, inject } from '@angular/core'
import { LabelPipe } from '../shared/pipes/label.pipe'
import { DecimalPipe } from '@angular/common'
import { AttributeType, Race } from '../shared/models/lanista-api.models'
import { PlannerForm } from './planner.models'
import { LanistaHelpersService } from '../shared/services/lanista-helpers.service'

@Injectable({
  providedIn: 'root',
})
export class PlannerFormHelpersService {
  private readonly _labelPipe = inject(LabelPipe)
  private readonly _decimalPipe = inject(DecimalPipe)
  private readonly _lanistaHelpersService = inject(LanistaHelpersService)

  getAllocatedPointsLabelForRace(race: Race, plannerForm: PlannerForm): string[] {
    const pointsLabels: string[] = []

    // Stats
    for (const statForm of [
      ...plannerForm.controls.staminaStats.controls,
      ...plannerForm.controls.agilityStats.controls,
    ]) {
      const modifier =
        race.bonuses.stats.find((statModifier) => statModifier.type === statForm.controls.type.value)?.value ?? 1

      const nameLabel = this._labelPipe.transform(statForm.controls.name.value)
      const desiredPoints = statForm.controls.value.value ?? 0
      const isSelected = plannerForm.controls.selectedAttribute.controls.type.value === statForm.controls.type.value
      const points = isSelected ? this._getRemainingPoints(race, plannerForm) : Math.ceil(desiredPoints / modifier)
      const pointsLabel = this._decimalPipe.transform(points, '1.0-0')
      pointsLabels.push(`${nameLabel}: ${pointsLabel}`)
    }

    // Add empty character between sections
    pointsLabels.push('‎')

    // Weapon skills
    for (const statForm of plannerForm.controls.weaponSkills.controls) {
      const modifier =
        race.bonuses.weapon_skills.find((statModifier) => statModifier.type === statForm.controls.type.value)?.value ??
        1

      const nameLabel = this._labelPipe.transform(statForm.controls.name.value)
      const desiredPoints = statForm.controls.value.value ?? 0
      const isSelected = plannerForm.controls.selectedAttribute.controls.type.value === statForm.controls.type.value
      const points = isSelected ? this._getRemainingPoints(race, plannerForm) : Math.ceil(desiredPoints / modifier)
      const pointsLabel = this._decimalPipe.transform(points, '1.0-0')
      pointsLabels.push(`${nameLabel}: ${pointsLabel}`)
    }

    return pointsLabels
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
    const totalPoints: number = this._lanistaHelpersService.getPointsForLevel(plannerForm.controls.level.value)

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
      spentPoints = spentPoints + Math.ceil(points / modifier)
    }

    // Weapon skills
    for (const weaponSkillForm of plannerForm.controls.weaponSkills.controls) {
      const modifier =
        race.bonuses.weapon_skills.find((statModifier) => statModifier.type === weaponSkillForm.controls.type.value)
          ?.value ?? 1
      const points = weaponSkillForm.controls.value.value ?? 0
      spentPoints = spentPoints + Math.ceil(points / modifier)
    }

    // Return the difference between total and spent points
    return totalPoints - spentPoints
  }
}
