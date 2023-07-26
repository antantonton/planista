import { Component, Input, OnInit, inject } from '@angular/core'
import { PlannerForm } from '../planner.models'
import { ArmorSlot, Config, Equipment } from 'src/app/shared/models/lanista-api.models'
import { LanistaApiService } from 'src/app/shared/services/lanista-api.service'
import { LanistaHelpersService } from 'src/app/shared/services/lanista-helpers.service'
import { groupBy } from 'lodash'

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css'],
})
export class EquipmentComponent implements OnInit {
  private readonly _lanistaApiService = inject(LanistaApiService)
  private readonly _lanistaHelpersService = inject(LanistaHelpersService)

  @Input() plannerForm!: PlannerForm
  @Input() config!: Config

  armorSlots: ArmorSlot[] = []

  armorsByType: { [type: number]: Equipment[] } = {}

  ngOnInit(): void {
    this.armorSlots = this._lanistaHelpersService.getArmorSlotsFromConfig(this.config)

    this._lanistaApiService.getWeapons().then((weapons) => {
      console.log('Weapons from Lanista API: ', weapons)
    })

    this._lanistaApiService.getArmors().then((armors) => {
      console.log('Armors from Lanista API: ', armors)
      this.armorsByType = groupBy(armors, (armor) => armor.type)
    })
  }
}
