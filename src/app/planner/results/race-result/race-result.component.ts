import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core'
import { Config, Race } from 'src/app/shared/models/lanista-api.models'
import { PlannerForm } from '../../planner.models'
import { LabelPipe } from 'src/app/shared/pipes/label.pipe'
import { LanistaHelpersService } from 'src/app/shared/services/lanista-helpers.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-race-result',
  templateUrl: './race-result.component.html',
  styleUrls: ['./race-result.component.css'],
})
export class RaceResultComponent implements OnInit, OnDestroy {
  private readonly _subscriptions = new Subscription()
  private readonly _labelPipe = inject(LabelPipe)
  private readonly _lanistaHelpersService = inject(LanistaHelpersService)

  @Input() config!: Config
  @Input() race!: Race
  @Input() plannerForm!: PlannerForm

  raceLabel = ''
  modifiersText: string[] = []
  allocatedPointsText: string[] = []
  selectedAttributePoints = 0
  selectedAttributeName = ''

  ngOnInit(): void {
    this._refreshDisplayData()

    this._subscriptions.add(
      this.plannerForm.valueChanges.subscribe(() => {
        this._refreshDisplayData()
      }),
    )
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe()
  }

  private _refreshDisplayData(): void {
    this.raceLabel = this._labelPipe.transform(this.race.name)
    this.modifiersText = this._lanistaHelpersService.getModifiersLabelForRaceFromConfig(this.race, this.config)
    this.allocatedPointsText = this._lanistaHelpersService.getAllocatedPointsLabelforRace(this.race, this.plannerForm)
    this.selectedAttributeName = this._lanistaHelpersService.getNameForAttribute(
      this.plannerForm.controls.selectedAttribute.controls.attributeType.value,
      this.plannerForm.controls.selectedAttribute.controls.type.value,
      this.config,
    )
    this.selectedAttributePoints = this._lanistaHelpersService.getModifiedPointsInSelectedAttribute(
      this.race,
      this.plannerForm,
    )
  }
}
