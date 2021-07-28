import { Component, Input, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Attribute, WeaponSkill } from 'src/app/shared/attributes/attributes'
import { AttributesService } from 'src/app/shared/attributes/attributes.service'
import { DEFAULT_RACE_DIALOG_CONFIG, RaceDialogComponent } from 'src/app/shared/race/race-dialog/race-dialog.component'
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

  level: number = 25


  constructor(
    private _dialog: MatDialog,
    private _attributesService: AttributesService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Callback function for clicking a race list item
   * @param race 
   */
  onRaceItemClicked(race: Race): void {
    this._dialog.open(
      RaceDialogComponent,
      {
        ...DEFAULT_RACE_DIALOG_CONFIG,
        data: {race: race}
      },
    )
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
