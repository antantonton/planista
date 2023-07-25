import { TitleCasePipe } from '@angular/common'
import { Pipe, PipeTransform, inject } from '@angular/core'

@Pipe({
  name: 'label',
})
export class LabelPipe implements PipeTransform {
  private readonly _titleCasePipe = inject(TitleCasePipe)
  transform(value: string | undefined | null): string {
    return value ? this._titleCasePipe.transform(value.replaceAll('_', ' ')) : ''
  }
}
