import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PlannerComponent } from './planner/planner.component'
import { WeaponComparisonComponent } from './weapon-comparison/weapon-comparison.component'

export enum Route {
  PLANNER = '',
  WEAPON_COMPARISON = 'weapons',
}

const routes: Routes = [
  {
    path: Route.PLANNER,
    component: PlannerComponent,
  },
  {
    path: Route.WEAPON_COMPARISON,
    component: WeaponComparisonComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
