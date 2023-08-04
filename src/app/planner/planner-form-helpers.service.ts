import { Injectable, inject } from '@angular/core'
import { LabelPipe } from '../shared/pipes/label.pipe'
import { DecimalPipe } from '@angular/common'
import { AttributeType, EquipmentBonus, Race } from '../shared/models/lanista-api.models'
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
    for (const form of [...plannerForm.controls.staminaStats.controls, ...plannerForm.controls.agilityStats.controls]) {
      const nameLabel = this._labelPipe.transform(form.controls.name.value)
      const isSelected =
        plannerForm.controls.selectedAttribute.controls.attributeType.value === AttributeType.STAT &&
        plannerForm.controls.selectedAttribute.controls.type.value === form.controls.type.value
      const desiredPoints = form.controls.value.value ?? 0
      const additiveFromEquipment = this._getAdditiveFromEquipment(form.controls.name.value, plannerForm)
      const multiplierFromEquipment = this._getMultiplierFromEquipment(form.controls.name.value, plannerForm)
      const modifier =
        race.bonuses.stats.find((statModifier) => statModifier.type === form.controls.type.value)?.value ?? 1
      const points = isSelected
        ? this._getRemainingPoints(race, plannerForm)
        : this._getPointsToAllocate(desiredPoints, modifier, additiveFromEquipment, multiplierFromEquipment)
      const pointsLabel = this._decimalPipe.transform(points, '1.0-0')
      pointsLabels.push(`${nameLabel}: ${pointsLabel}`)
    }

    // Add empty character between sections
    pointsLabels.push('‎')

    // Weapon skills
    for (const form of plannerForm.controls.weaponSkills.controls) {
      const nameLabel = this._labelPipe.transform(form.controls.name.value)
      const isSelected =
        plannerForm.controls.selectedAttribute.controls.attributeType.value === AttributeType.WEAPON_SKILL &&
        plannerForm.controls.selectedAttribute.controls.type.value === form.controls.type.value
      const desiredPoints = form.controls.value.value ?? 0
      const additiveFromEquipment = this._getAdditiveFromEquipment(form.controls.name.value, plannerForm)
      const multiplierFromEquipment = this._getMultiplierFromEquipment(form.controls.name.value, plannerForm)
      const modifier =
        race.bonuses.weapon_skills.find((statModifier) => statModifier.type === form.controls.type.value)?.value ?? 1
      const points = isSelected
        ? this._getRemainingPoints(race, plannerForm)
        : this._getPointsToAllocate(desiredPoints, modifier, additiveFromEquipment, multiplierFromEquipment)
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
    const additiveFromEquipment = this._getAdditiveFromEquipment(
      plannerForm.controls.selectedAttribute.controls.name.value,
      plannerForm,
    )
    const multiplierFromEquipment = this._getMultiplierFromEquipment(
      plannerForm.controls.selectedAttribute.controls.name.value,
      plannerForm,
    )
    console.log('this._getRemainingPoints(race, plannerForm): ', this._getRemainingPoints(race, plannerForm))
    console.log('modifier', modifier)
    console.log('additiveFromEquipment', additiveFromEquipment)
    console.log('multiplierFromEquipment', multiplierFromEquipment)
    return this._getActualPoints(
      this._getRemainingPoints(race, plannerForm),
      modifier,
      additiveFromEquipment,
      multiplierFromEquipment,
    )
  }

  private _getRemainingPoints(race: Race, plannerForm: PlannerForm): number {
    // Get the total number of points that can be allocated
    const totalPoints: number = this._lanistaHelpersService.getPointsForLevel(plannerForm.controls.level.value)

    // Calculate how many points have to be sent to achieve the given attribute allocation
    let spentPoints: number = 0

    // Stats
    for (const form of [...plannerForm.controls.staminaStats.controls, ...plannerForm.controls.agilityStats.controls]) {
      const isSelected =
        plannerForm.controls.selectedAttribute.controls.attributeType.value === AttributeType.STAT &&
        plannerForm.controls.selectedAttribute.controls.type.value === form.controls.type.value
      if (isSelected) {
        continue
      }
      const desiredPoints = form.controls.value.value ?? 0
      const additiveFromEquipment = this._getAdditiveFromEquipment(form.controls.name.value, plannerForm)
      const multiplierFromEquipment = this._getMultiplierFromEquipment(form.controls.name.value, plannerForm)
      const modifier =
        race.bonuses.stats.find((statModifier) => statModifier.type === form.controls.type.value)?.value ?? 1
      spentPoints =
        spentPoints + this._getPointsToAllocate(desiredPoints, modifier, additiveFromEquipment, multiplierFromEquipment)
    }

    // Weapon skills
    for (const form of plannerForm.controls.weaponSkills.controls) {
      const isSelected =
        plannerForm.controls.selectedAttribute.controls.attributeType.value === AttributeType.WEAPON_SKILL &&
        plannerForm.controls.selectedAttribute.controls.type.value === form.controls.type.value
      if (isSelected) {
        continue
      }
      const desiredPoints = form.controls.value.value ?? 0
      const additiveFromEquipment = this._getAdditiveFromEquipment(form.controls.name.value, plannerForm)
      const multiplierFromEquipment = this._getMultiplierFromEquipment(form.controls.name.value, plannerForm)
      const modifier =
        race.bonuses.weapon_skills.find((statModifier) => statModifier.type === form.controls.type.value)?.value ?? 1
      spentPoints =
        spentPoints + this._getPointsToAllocate(desiredPoints, modifier, additiveFromEquipment, multiplierFromEquipment)
    }

    // Return the difference between total and spent points
    return totalPoints - spentPoints
  }

  private _getAdditiveFromEquipment(statName: string, plannerForm: PlannerForm): number {
    let additiveFromEquipment = 0
    const allEquipmentBonuses = this._getAllEquipmentBonuses(plannerForm)
    for (const bonus of allEquipmentBonuses) {
      if (bonus.type === statName && bonus.additive) {
        additiveFromEquipment = additiveFromEquipment + bonus.additive
      }
    }
    return additiveFromEquipment
  }

  private _getMultiplierFromEquipment(statName: string, plannerForm: PlannerForm): number {
    let multiplierFromEquipment = 1
    const allEquipmentBonuses = this._getAllEquipmentBonuses(plannerForm)
    for (const bonus of allEquipmentBonuses) {
      if (bonus.type === statName && bonus.multiplier) {
        multiplierFromEquipment = multiplierFromEquipment * bonus.multiplier
      }
    }
    return multiplierFromEquipment
  }

  private _getAllEquipmentBonuses(plannerForm: PlannerForm): EquipmentBonus[] {
    return [
      ...(plannerForm.controls.mainHand.value?.bonuses ?? []),
      ...(plannerForm.controls.offHand.value?.bonuses ?? []),
      ...plannerForm.controls.armors.controls.flatMap((form) => form.value.equipment?.bonuses ?? []),
      ...plannerForm.controls.trinkets.controls.flatMap((form) => form.value.equipment?.bonuses ?? []),
    ]
  }

  private _getPointsToAllocate(
    desiredPoints: number,
    raceModifier: number,
    equipmentAdditive: number,
    equipmentMultiplier: number,
  ): number {
    if (desiredPoints === 0) {
      return 0
    }
    const pointsBeforeAdditive = desiredPoints - equipmentAdditive
    const pointsBeforeMultiplier = pointsBeforeAdditive / equipmentMultiplier
    const pointsBeforeModifier = pointsBeforeMultiplier / raceModifier
    return Math.max(Math.ceil(pointsBeforeModifier), 0)
  }

  private _getActualPoints(
    allocatedPoints: number,
    raceModifier: number,
    equipmentAdditive: number,
    equipmentMultiplier: number,
  ): number {
    const pointsAfterModifier = allocatedPoints * raceModifier
    const pointsAfterMultiplier = pointsAfterModifier * equipmentMultiplier
    const pointsAfterAdditive = pointsAfterMultiplier + equipmentAdditive
    return pointsAfterAdditive
  }
}
