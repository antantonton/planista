import { Component } from '@angular/core'
import { MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [
    {provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: {showDelay: 500}}
  ]
})
export class AppComponent {
  title = 'planista'
}
