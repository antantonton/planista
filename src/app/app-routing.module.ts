import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PlannerComponent } from './planner/planner.component'

export const ROUTE = {
  PLANNER: '',
}

const routes: Routes = [
  {
    path: ROUTE.PLANNER,
    component: PlannerComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
