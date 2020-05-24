import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { StorageService } from '../../service/storage.service';
import { Slot} from '../../common/params';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss']
})
export class SlotComponent {

  @Input() minutes: number
  @Input() next: string
  @Input() slots: Slot[]
  @Output() showAdd = new EventEmitter<{}>();
  @Output() dialog = new EventEmitter<{}>();

  constructor( private storage: StorageService ){ }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.slots, event.previousIndex, event.currentIndex);
    this.storage.set("order", this.array_column(this.slots, "item").join(','))
  }

  array_column(input: Slot[], key: string) {
    return input.map(item => item[key])
  }

}
