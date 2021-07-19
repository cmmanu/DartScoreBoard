import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScoresComponent } from './scores/scores.component';
import { DartersComponent } from './darters/darters.component';
import { SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { A11yModule } from '@angular/cdk/a11y'
import { InjectService } from './inject.service';
import { MatKeyboardModule } from 'angular-onscreen-material-keyboard';


@NgModule({
  declarations: [
    AppComponent,
    ScoresComponent,
    DartersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SplitterModule, 
    MatIconModule,
    A11yModule,
    FormsModule, 
    BrowserAnimationsModule,
    MatKeyboardModule,
  ],
  providers: [InjectService],
  bootstrap: [AppComponent]
})
export class AppModule { }
