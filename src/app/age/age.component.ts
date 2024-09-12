import { Component } from '@angular/core'
import { Age, AgeRace, RACE_AGE_LIMIT } from './age.models'
import { FormControl, FormGroup } from '@angular/forms'
import { map, Observable, startWith } from 'rxjs'
import { mapValues } from 'lodash'
import { addDays } from 'date-fns'

type AgeResult = {
  [race in AgeRace]: {
    [age in Age]: Date | null
  }
}

@Component({
  selector: 'app-age',
  templateUrl: './age.component.html',
  styleUrls: ['./age.component.css'],
})
export class AgeComponent {
  readonly races = Object.values(AgeRace)
  readonly ages = Object.values(Age)
  readonly timeOptions = [
    { label: 'Before 12:00', value: false },
    { label: 'After 12:00', value: true },
  ]
  readonly dateForm = new FormGroup({
    date: new FormControl<Date>(new Date()),
    afterNoon: new FormControl<boolean>(true),
  })
  readonly ageResult$: Observable<AgeResult> = this.dateForm.valueChanges.pipe(
    startWith(this.dateForm.value),
    map(({ date, afterNoon }) => {
      const result: AgeResult = mapValues(RACE_AGE_LIMIT, (ageLimits) =>
        mapValues(ageLimits, (limit) => {
          if (!limit || !date) {
            return null
          }

          if (afterNoon) {
            const agingDate = addDays(date, limit + 1)
            agingDate.setHours(0, 0, 0, 0)
            return agingDate
          } else {
            const agingDate = addDays(date, limit)
            agingDate.setHours(12, 0, 0, 0)
            return agingDate
          }
        }),
      )
      return result
    }),
  )
}
