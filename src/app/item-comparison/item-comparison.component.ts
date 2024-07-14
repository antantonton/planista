import { Component, inject } from '@angular/core'
import { Config, Equipment } from '../shared/models/lanista-api.models'
import { LanistaHelpersService } from '../shared/services/lanista-helpers.service'
import { TitleCasePipe } from '@angular/common'
import { EquipmentService } from '../shared/services/equipment.service'
import { combineLatest, map } from 'rxjs'
import { ConfigService } from '../shared/services/config.service'
import { sum } from 'lodash'

type ItemDisplayObject = {
  [key: string]: string | number | string[]
}

@Component({
  selector: 'app-item-comparison',
  templateUrl: './item-comparison.component.html',
  styleUrls: ['./item-comparison.component.css'],
})
export class ItemComparisonComponent {
  private readonly _lanistaHelpersService = inject(LanistaHelpersService)
  private readonly _titleCasePipe = inject(TitleCasePipe)
  private readonly _equipmentService = inject(EquipmentService)
  private readonly _configService = inject(ConfigService)
  readonly items$ = combineLatest([this._equipmentService.getTrinkets(), this._configService.getConfig()]).pipe(
    map(([trinkets, config]) => trinkets.map((trinket) => this._mapItemToDisplayObject(trinket, config))),
  )
  readonly raceColumns$ = this._configService.getConfig().pipe(
    map((config) => {
      return config.races.map((race) => {
        return {
          field: `${race.type}`,
          header: this._titleCasePipe.transform(race.name),
        }
      })
    }),
  )
  readonly columns$ = this.raceColumns$.pipe(
    map((raceColumns) => [
      {
        field: 'type',
        header: 'Type',
        filterType: 'text',
      },
      {
        field: 'level',
        header: 'Level',
        filterType: 'numeric',
      },
      {
        field: 'weight',
        header: 'Weight',
        filterType: 'numeric',
      },
      ...raceColumns,
      {
        field: 'modifiers',
        header: 'Modifiers',
        filterType: 'text',
      },
    ]),
  )

  private _mapItemToDisplayObject(item: Equipment, config: Config): ItemDisplayObject {
    return {
      name: item.name,
      type: this._titleCasePipe.transform(item.type_name),
      weight: item.weight,
      level: item.required_level,
      modifiers: this._lanistaHelpersService.getModifiersLabelFromConfig(item.bonuses).join(', '),
      ...config.races.reduce((result, race) => {
        const bonusesAfterRaceModifiers = item.bonuses.map((bonus) => {
          const bonusStat =
            config.stats.find((stat) => stat.name === bonus.type) ??
            config.weapon_skills.find((weaponSkill) => weaponSkill.name === bonus.type)
          if (!bonusStat) {
            return 0
          }

          const raceModifier =
            race.bonuses.stats.find((raceBonus) => raceBonus.type === bonusStat.type) ??
            race.bonuses.weapon_skills.find((raceBonus) => raceBonus.type === bonusStat.type)
          if (!raceModifier) {
            return 0
          }

          if (bonus.additive) {
            return bonus.additive / (raceModifier.value === 0 ? 1 : raceModifier.value)
          } else {
            return 0
          }
        })
        return {
          ...result,
          [race.type]: Math.round(sum(bonusesAfterRaceModifiers) * 100) / 100,
        }
      }, {}),
    }
  }
}
