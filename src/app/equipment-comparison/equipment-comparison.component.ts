import { Component, inject } from '@angular/core'
import { Location } from '@angular/common'
import { Route } from '../app-routing.module'
import { NavigationEnd, Router } from '@angular/router'
import { filter, map, startWith } from 'rxjs'

@Component({
  selector: 'app-equipment-comparison',
  templateUrl: './equipment-comparison.component.html',
  styleUrls: ['./equipment-comparison.component.css'],
})
export class EquipmentComparisonComponent {
  private readonly _location = inject(Location)
  readonly Route = Route
  readonly url = this._location.path(false).slice(1)
  readonly router = inject(Router)
  readonly url$ = this.router.events.pipe(
    filter((event: any) => event instanceof NavigationEnd),
    map((event: NavigationEnd) => event.url),
    startWith(this._location.path(false)),
  )
}
