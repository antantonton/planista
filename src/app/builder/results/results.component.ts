import { DecimalPipe, TitleCasePipe } from '@angular/common'
import { Component, Input, OnInit } from '@angular/core'
import { Attribute, WeaponSkill } from 'src/app/shared/attributes/attributes'
import { AttributesService } from 'src/app/shared/attributes/attributes.service'
import { Race, RACE_MODIFIERS } from 'src/app/shared/race/races'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  races = Object.values(Race)

  @Input() attributes: {[attribute in Attribute]: number}
  @Input() lockedAttribute: Attribute | null
  @Input() weaponType: WeaponSkill
  @Input() level: number

  constructor(
    private _titleCasePipe: TitleCasePipe,
    private _decimalPipe: DecimalPipe,
    private _attributesService: AttributesService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Returns a list of attributes that have a non zero value
   * @returns 
   */
  getDefinedAttributes(): string[] {
    return Object.keys(this.attributes).filter(attribute => this.attributes[attribute])
  }

  /**
   * Returns the allocated points needed to achieve the given attributes for the given race
   * @param attribute 
   * @returns 
   */
  getAllocatedPoints(attribute: Attribute | WeaponSkill, race: Race): number {
    return this.attributes[attribute] / RACE_MODIFIERS[race][attribute]
  }

  /**
   * Returns the tooltip for the titles info hover
   * @returns 
   */
  getRaceInfoTooltip(race: Race): string {
    const modifiers: string[] = Object.keys(this.attributes).map(attribute => {
      return `${this._titleCasePipe.transform(attribute)}: ${this.getFormattedAttributeModifier(attribute, race)}%`
    })
    return modifiers.join('\n')
  }

  /**
   * Returns the formatted attribute modifier
   * @param attribute 
   * @returns 
   */
  getFormattedAttributeModifier(attribute: Attribute | WeaponSkill | string, race: Race): string {
    return this._decimalPipe.transform((1 - RACE_MODIFIERS[race][attribute]) * 100, '1.0-0')
  }

  /**
   * Returns the points after modifiers for the locked attribute
   * @param race 
   * @returns 
   */
  getLockedAttributePoints(race: Race): number {
    const lockedAttribute: Attribute | WeaponSkill = this.lockedAttribute ?? this.weaponType
    return this._attributesService.getRemainingPoints(this.level, race, this.attributes) * RACE_MODIFIERS[race][lockedAttribute]
  }

  /**
   * Returns the color to use for the remaining points
   * @param race 
   * @returns 
   */
  getLockedAttributePointsColor(race: Race): string {
    return this.getLockedAttributePoints(race) < 0 ? 'red' : 'green'
  }

  /**
   * Returns a tooltip for the results title
   * @returns 
   */
  getResultsTooltip(): string {
    return `Displays the resulting attribute points after racial modifiers for the locked attribute`
  }
}
