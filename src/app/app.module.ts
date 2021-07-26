import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlexLayoutModule } from '@angular/flex-layout'
import { HttpClientModule } from '@angular/common/http'

import { ReactiveFormsModule } from '@angular/forms'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatStepperModule } from '@angular/material/stepper'
import { MatRadioModule } from '@angular/material/radio'
import { MatSelectModule } from '@angular/material/select'
import { MatSliderModule } from '@angular/material/slider'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatDividerModule } from '@angular/material/divider'
import { MatBottomSheetModule } from '@angular/material/bottom-sheet'
import { MatBadgeModule } from '@angular/material/badge'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatCardModule } from '@angular/material/card'
import { MatRippleModule } from '@angular/material/core'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatDialogModule } from '@angular/material/dialog'
import { MatMenuModule } from '@angular/material/menu'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BuilderComponent } from './builder/builder.component';
import { RaceDialogComponent } from './shared/race/race-dialog/race-dialog.component'

@NgModule({
  declarations: [
    AppComponent,
    BuilderComponent,
    RaceDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatStepperModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatBottomSheetModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatCardModule,
    MatRippleModule,
    MatGridListModule,
    MatDialogModule,
    MatMenuModule,
    MatSlideToggleModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
