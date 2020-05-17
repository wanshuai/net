import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MyDesignModule } from './common/my-design.module';
import { AppComponent } from './app.component';
import { MagicComponent } from './magic/magic.component';
import { SlotComponent } from './magic/slot/slot.component';
import { AddComponent } from './magic/add/add.component';
import { CalendarHeaderComponent } from './magic/add/calendar-header/calendar-header.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BeforeAddComponent } from './magic/before-add/before-add.component';

@NgModule({
  declarations: [
    AppComponent,
    MagicComponent,
    SlotComponent,
    AddComponent,
    CalendarHeaderComponent,
    BeforeAddComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MyDesignModule
  ],
  providers: [
    MatDialog,
    MatSnackBar
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
