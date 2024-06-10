import { Component, inject } from '@angular/core'
import { Location } from '@angular/common'
import { Route } from 'src/app/app-routing.module'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {
  private readonly _location = inject(Location)
  readonly githubLink = 'https://github.com/antantonton/planista'
  readonly Route = Route
  readonly url = this._location.path(false).slice(1)
}
