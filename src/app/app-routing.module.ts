import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PlannerComponent } from './planner/planner.component'
import { WeaponComparisonComponent } from './weapon-comparison/weapon-comparison.component'
import { ItemComparisonComponent } from './item-comparison/item-comparison.component'
import { EquipmentComparisonComponent } from './equipment-comparison/equipment-comparison.component'

export enum Route {
  PLANNER = '',
  EQUIPMENT = 'equipment',
  WEAPON_COMPARISON = 'weapons',
  ITEM_COMPARISON = 'items',
}

const routes: Routes = [
  {
    path: Route.PLANNER,
    component: PlannerComponent,
  },
  {
    path: Route.ITEM_COMPARISON,
    component: ItemComparisonComponent,
  },
  {
    path: Route.WEAPON_COMPARISON,
    component: WeaponComparisonComponent,
  },
  {
    path: Route.EQUIPMENT,
    component: EquipmentComparisonComponent,
    children: [
      {
        path: Route.WEAPON_COMPARISON,
        component: WeaponComparisonComponent,
      },
      {
        path: Route.ITEM_COMPARISON,
        component: ItemComparisonComponent,
      },
      {
        path: '**',
        redirectTo: Route.WEAPON_COMPARISON,
      },
    ],
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
