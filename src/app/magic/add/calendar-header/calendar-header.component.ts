import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarHeaderComponent implements OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    private _calendar: MatCalendar<moment.Moment>,
    cdr: ChangeDetectorRef
  ) {
    _calendar.stateChanges
    .pipe(takeUntil(this._destroyed))
    .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return moment(this._calendar.activeDate).format('YYYY-MM');
  }

  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
      moment(this._calendar.activeDate).add(1, 'months') :
      moment(this._calendar.activeDate).add(1, 'year');
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
      moment(this._calendar.activeDate).add(-1, 'months') :
      moment(this._calendar.activeDate).add(-1, 'year');
  }
}
