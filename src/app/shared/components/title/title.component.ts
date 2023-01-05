import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss'],
})
export class TitleComponent implements OnInit {
  @Input() title: string = ''
  @Input() info: string = ''
  @Input() level: number = 1
  @Input() infoPosition: 'before' | 'after' = 'after'

  titleClass: { [level: number]: string } = {
    1: 'mat-headline',
    2: 'mat-title',
    3: 'mat-subheading-2',
    4: 'mat-subheading-1',
    5: 'mat-h5',
    6: 'mat-h6',
  }

  constructor() {}

  ngOnInit(): void {}
}
