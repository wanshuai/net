import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-before-add',
  templateUrl: './before-add.component.html',
  styleUrls: ['./before-add.component.scss']
})
export class BeforeAddComponent {

  @Output() showAdd = new EventEmitter()

}
