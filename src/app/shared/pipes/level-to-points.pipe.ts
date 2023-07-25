import { Pipe, PipeTransform, inject } from '@angular/core'
import { LanistaHelpersService } from '../services/lanista-helpers.service'

@Pipe({
  name: 'levelToPoints',
})
export class LevelToPointsPipe implements PipeTransform {
  private readonly _lanistaHelpersService = inject(LanistaHelpersService)

  transform(level: number): number {
    return this._lanistaHelpersService.getPointsForLevel(level)
  }
}
