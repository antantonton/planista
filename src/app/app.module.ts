import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { InputNumberModule } from 'primeng/inputnumber'
import { InputTextModule } from 'primeng/inputtext'
import { DividerModule } from 'primeng/divider'
import { ProgressSpinnerModule } from 'primeng/progressspinner'
import { SliderModule } from 'primeng/slider'
import { RadioButtonModule } from 'primeng/radiobutton'
import { ButtonModule } from 'primeng/button'
import { DialogModule } from 'primeng/dialog'
import { ToolbarModule } from 'primeng/toolbar'
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog'
import { TableModule } from 'primeng/table'
import { TooltipModule } from 'primeng/tooltip'
import { DropdownModule } from 'primeng/dropdown'
import { AppComponent } from './app.component'
import { PlannerComponent } from './planner/planner.component'
import { AppRoutingModule } from './app-routing.module'
import { StatInputComponent } from './shared/components/stat-input/stat-input.component'
import { FlexLayoutModule } from '@angular/flex-layout'
import { RouterModule } from '@angular/router'
import { DecimalPipe, TitleCasePipe } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { LabelPipe } from './shared/pipes/label.pipe'
import { LevelToPointsPipe } from './shared/pipes/level-to-points.pipe'
import { DividerHeaderComponent } from './shared/components/divider-header/divider-header.component'
import { ResultsComponent } from './planner/results/results.component'
import { RaceResultComponent } from './planner/results/race-result/race-result.component'
import { InfoButtonComponent } from './shared/components/info-button/info-button.component'
import { EquipmentComponent } from './planner/equipment/equipment.component'
import { EquipmentListComponent } from './equipment-list/equipment-list.component'
import { InfoDialogComponent } from './shared/components/info-dialog/info-dialog.component'

@NgModule({
  declarations: [
    AppComponent,
    PlannerComponent,
    StatInputComponent,
    LabelPipe,
    LevelToPointsPipe,
    DividerHeaderComponent,
    ResultsComponent,
    RaceResultComponent,
    InfoButtonComponent,
    EquipmentComponent,
    EquipmentListComponent,
    InfoDialogComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    ToolbarModule,
    ProgressSpinnerModule,
    TableModule,
    DynamicDialogModule,
    FormsModule,
    DialogModule,
    ReactiveFormsModule,
    TooltipModule,
    AppRoutingModule,
    SliderModule,
    DividerModule,
    InputNumberModule,
    DropdownModule,
    InputTextModule,
    RadioButtonModule,
    ButtonModule,
  ],
  providers: [TitleCasePipe, DecimalPipe, LabelPipe, DialogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
