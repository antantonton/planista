import { Component, Input, OnDestroy, OnInit, TemplateRef, inject } from '@angular/core'
import { PlannerForm } from '../planner.models'
import { ArmorSlot, Config, Equipment } from 'src/app/shared/models/lanista-api.models'
import { LanistaHelpersService } from 'src/app/shared/services/lanista-helpers.service'
import { groupBy } from 'lodash'
import { Dropdown } from 'primeng/dropdown'
import { InfoDialogService } from 'src/app/shared/components/info-dialog/info-dialog.service'
import { EquipmentService } from 'src/app/shared/services/equipment.service'
import { Subscription } from 'rxjs'
import { ConsumableService } from 'src/app/shared/services/consumable.service'

type EqipmentDisplayObject = Equipment & { modifiers: string[] }

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css'],
})
export class EquipmentComponent implements OnInit, OnDestroy {
  private readonly _subscriptions = new Subscription()
  private readonly _infoDialogService = inject(InfoDialogService)
  private readonly _equipmentService = inject(EquipmentService)
  private readonly _lanistaHelpersService = inject(LanistaHelpersService)
  private readonly _consumableService = inject(ConsumableService)

  @Input() plannerForm!: PlannerForm
  @Input() config!: Config

  armorSlots: ArmorSlot[] = []

  armorsByType: { [type: number]: EqipmentDisplayObject[] } = {}
  mainHandWeapons: EqipmentDisplayObject[] = []
  offHandWeapons: EqipmentDisplayObject[] = []

  ngOnInit(): void {
    this.armorSlots = this._lanistaHelpersService.getArmorSlotsFromConfig(this.config)

    this._subscriptions.add(
      this._equipmentService.getWeapons().subscribe((weapons) => {
        this.mainHandWeapons = this._mapEquipmentToDisplayObject(
          this._lanistaHelpersService.getMainHandWeaponsFromWeapons(weapons),
        )
        this.offHandWeapons = this._mapEquipmentToDisplayObject(
          this._lanistaHelpersService.getOffHandWeaponsFromWeapons(weapons),
        )
      }),
    )

    this._subscriptions.add(
      this._equipmentService.getArmors().subscribe((armors) => {
        this.armorsByType = groupBy(this._mapEquipmentToDisplayObject(armors), (armor) => armor.type)
      }),
    )

    // this._lanistaApiService.getConsumables().then((consumables) => {
    //   console.log('Consumables from Lanista API: ', consumables)
    // })
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe()
  }

  onEquipmentClear(dropdown: Dropdown): void {
    dropdown.resetFilter()
  }

  async onInfoClick(item: EqipmentDisplayObject, dropdown?: Dropdown): Promise<void> {
    setTimeout(() => {
      dropdown?.hide()
    }, 0)
    await this._infoDialogService.open(item.name, item.modifiers)
    dropdown?.show()
  }

  private _mapEquipmentToDisplayObject(equipment: Equipment[]): EqipmentDisplayObject[] {
    return equipment.map((e) => {
      return {
        ...e,
        modifiers: this._lanistaHelpersService.getModifiersLabelForEquipmentFromConfig(e),
      }
    })
  }
}
