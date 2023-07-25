import { Component, Input, OnInit, inject } from '@angular/core'
import { PlannerForm } from '../planner.models'
import { Config, Race } from 'src/app/shared/models/lanista-api.models'
import { LanistaHelpersService } from 'src/app/shared/services/lanista-helpers.service'

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  private readonly _lanistaHelpersService = inject(LanistaHelpersService)
  @Input() plannerForm!: PlannerForm
  @Input() config!: Config

  races: Race[] = []

  ngOnInit(): void {
    this.races = this._lanistaHelpersService.getRacesFromConfig(this.config)
  }
}
