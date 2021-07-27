import { Injectable } from '@angular/core'
import { Race, RACE_BONUSES } from '../race/races'
import { Attribute, POINT_PER_LEVEL, STARTING_POINTS } from './attributes'

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  constructor() { }

  /**
   * Returns the number of points a character may allocated (in total) for a given level
   * @param level 
   */
  getPointsByLevel(level: number): number {
    return STARTING_POINTS + (POINT_PER_LEVEL * (level - 1))
  }

  /**
   * Returns the number of remaining points after allocating according to the given attribute object
   * Takes into account race-attribute factors
   * @param level 
   * @param race 
   * @param attributes 
   * @returns 
   */
  getRemainingPoints(level: number, race: Race, attributes: {[attribute in Attribute]: number}): number {
    // Get the total number of points that can be allocated
    const totalPoints: number = this.getPointsByLevel(level)

    // Calculate how many points haev to be sent to achieve the given attribute allocation
    let spentPoints: number = 0
    for (let [attribute, points] of Object.entries(attributes)) {
      // Take the points and divide if with the corresponding race-attribute factor
      spentPoints += points / RACE_BONUSES[race][attribute]
    }

    // Return the difference between total and spent points
    return totalPoints - spentPoints
  }

}
