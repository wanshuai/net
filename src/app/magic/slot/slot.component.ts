import { Component, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormControl, Validators } from '@angular/forms';

import { Slot, Magic, Res } from '../../common/params';
import { ConjureService } from '../../service/conjure.service';
import { StorageService } from '../../service/storage.service';
import { BottomPopService } from '../../service/bottom-pop.service';
import { DialogService } from '../../service/dialog.service';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  styleUrls: ['./slot.component.scss']
})
export class SlotComponent {

  minutes: number
  next: string
  slots: Slot[]
  newMinutes: number
  selectItem: number;
  tabIndex: number = 0;
  @Output() showAdd = new EventEmitter();
  @ViewChild("loading") loading: TemplateRef<any>;
  @ViewChild("delete") delete: TemplateRef<any>;
  @ViewChild("aae") aae: TemplateRef<any>
  minutesRule = new FormControl('1', [Validators.required, Validators.min(1), Validators.pattern('[0-9]*')])

  constructor(
    private conjureService: ConjureService,
    private storageService: StorageService,
    private dialog: DialogService,
    private bottomPop: BottomPopService
  ) { 
    this.conjureService.data$.subscribe(res => this.dataFunc(res))
  }

  dataFunc(res: Magic): void {
    this.minutes = res['minutes'];
    this.next = res['next'];
    this.slots = res['slot'];
    this.storageService.set("order", this.array_column(this.slots, "item").join(','))
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.slots, event.previousIndex, event.currentIndex);
    this.storageService.set("order", this.array_column(this.slots, "item").join(','))
  }

  array_column(input: Slot[], key: string) {
    return input.map(item => item[key])
  }

  deleteDialogOpen(index: number): void {
    this.selectItem = index;
    this.dialog.open(this.delete, {disableClose: true});
  }

  deleteDialogClose(type: number): void {
    if(type == 1){
      this.dialog.open(this.loading, {disableClose: true});
      this.conjureService.delete("item="+this.selectItem, this.selectItem).subscribe(res=>this.deleteFunc(res))
    }else{
      this.dialog.close()
    }
    this.selectItem = 0
  }

  deleteFunc(res: Res): void {
    this.dialog.closeAll()
    if(res.status != 200){
      this.bottomPop.open(res.msg, 2);
    }
  }

  aaeDialogOpen(index: number): void {
    this.selectItem = index;
    this.dialog.open(this.aae, {disableClose: true})
  }

  aaeDialogClose(index: number): void {
    if(index == 0){
      this.dialog.close()
    }else{
      if(!/^[0-9]+$/.test(this.newMinutes+"")){
        this.bottomPop.open("请只输入数字", 0)
        return;
      }else{
        this.dialog.open(this.loading, {disableClose: true});
        this.conjureService.edit("item="+this.selectItem+"&minutes="+this.newMinutes+"&type="+this.tabIndex, this.selectItem).subscribe(res=>this.aaeFunc(res))
      }
    }
    this.newMinutes = 1;
    this.selectItem = 0
  }

  aaeFunc(res: Res): void {
    this.dialog.closeAll()
    if(res.status != 200){
      this.bottomPop.open(res.msg, 2);
    }
  }

}
