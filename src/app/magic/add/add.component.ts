import { Component, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { BottomPopService } from '../../service/bottom-pop.service';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as moment from 'moment';

const MY_DATE_FORMATS = {
  parse: {
      dateInput: 'YYYY-MM-DD'
  },
  display: {
      dateInput: 'YYYY-MM-DD',
      dateA11yLabel: 'YYYY-MM-DD',
  }
};

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'zh-CN' }
  ]
})
export class AddComponent {

  @Output() start = new EventEmitter<string>();
  minDate: string = moment().format('YYYY-MM-DD');
  addHeader = CalendarHeaderComponent
  startForm = new FormGroup({
    start: new FormControl(moment(), [Validators.required]),
    loop: new FormControl('2', [Validators.required]),
    used: new FormControl('100', [Validators.required, Validators.min(1), Validators.pattern('[0-9]+')]),
  });

  constructor(
     private bottomPop: BottomPopService,
    ) { }

  onSubmit(): void|boolean {
    let start = this.startForm.value.start.format("YYYY-MM-DD");
    let loop = this.startForm.value.loop;
    let used = this.startForm.value.used;
    if(!/^[0-9]+$/.test(used)){
      this.bottomPop.open("可用时间请只输入数字", 0);
      return false;
    }
    if(used <= 0){
      this.bottomPop.open("可用时间必须大于0分钟", 0);
      return false;
    }

    let time = 0;
    switch(loop){
      case '1': time = 7*24*60;break;
      case '2': time = 14*24*60;break;
      case '3': time = 21*24*60;break;
      case '4': time = (moment().daysInMonth())*24*60;break;
      case '5': time = (moment().daysInMonth() + moment().month(moment().get('month')+1).daysInMonth())*24*60;break;
    }

    if(used > time){
      this.bottomPop.open("可用时间大于循环时间", 2);
      return false;
    }

    this.start.emit("start="+start+"&loop="+loop+"&used="+used)
  }

}