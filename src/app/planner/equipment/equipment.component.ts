import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core'
import { PlannerForm } from '../planner.models'
import { ArmorSlot, Config, Consumable, Equipment } from 'src/app/shared/models/lanista-api.models'
import { LanistaHelpersService } from 'src/app/shared/services/lanista-helpers.service'
import { groupBy } from 'lodash'
import { Dropdown } from 'primeng/dropdown'
import { InfoDialogService } from 'src/app/shared/components/info-dialog/info-dialog.service'
import { EquipmentService } from 'src/app/shared/services/equipment.service'
import { Subscription } from 'rxjs'
import { ConsumableService } from 'src/app/shared/services/consumable.service'
import { EnchantService } from 'src/app/shared/services/enchant.service'

type EqipmentDisplayObject = Equipment & { modifiers: string[] }
type ConsumableDisplayObject = Consumable & { modifiers: string[] }

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
  private readonly _enchantService = inject(EnchantService)

  @Input() plannerForm!: PlannerForm
  @Input() config!: Config

  armorSlots: ArmorSlot[] = []

  armorsByType: { [type: number]: EqipmentDisplayObject[] } = {}
  mainHandWeapons: EqipmentDisplayObject[] = []
  offHandWeapons: EqipmentDisplayObject[] = []
  consumables: ConsumableDisplayObject[] = []

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

    this._subscriptions.add(
      this._consumableService.getConsumables().subscribe((consumables) => {
        this.consumables = consumables.map((c) => {
          return {
            ...c,
            modifiers: this._lanistaHelpersService.getModifiersLabelFromConfig(c.bonuses),
          }
        })
      }),
    )
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
        modifiers: this._lanistaHelpersService.getModifiersLabelFromConfig(e.bonuses),
      }
    })
  }
}
