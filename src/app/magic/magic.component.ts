import { Component, ViewChild, TemplateRef } from '@angular/core';
import { DialogService } from '../service/dialog.service';
import { ConjureService } from '../service/conjure.service';
import { BottomPopService } from '../service/bottom-pop.service';
import { Res } from '../common/params';

@Component({
  selector: 'app-magic',
  templateUrl: './magic.component.html',
  styleUrls: ['./magic.component.scss']
})
export class MagicComponent{

  length: number;
  showLoading: boolean;
  showSlot: boolean;
  showBeforeAdd: boolean;
  showAdd: boolean;
  title: string;
  slotName: string; //法术位名称
  @ViewChild("loading") loading: TemplateRef<any>;
  @ViewChild("new") new: TemplateRef<any>;

  constructor(
    private conjureService: ConjureService,
    private dialog: DialogService,
    private bottomPop: BottomPopService
  ) {
    this.showLoading = true;
    this.showSlot = false;
    this.showBeforeAdd = false;
    this.showAdd = false;
    this.getSlots()
    this.conjureService.data$.subscribe(res=>{if(res.slot){this.length=res.slot.length}else{this.length=0}})
  }

  getSlots(): void {
    this.conjureService.getData().subscribe(res => this.dataFunc(res));
  }

  dataFunc(res: Res): void {
    if(res.status != 200){
      this.bottomPop.open(res.msg, 2);
    }else if(Object.keys(res.data).length == 0){
      this.showLoading = false;
      this.showSlot = false;
      this.showBeforeAdd = true;
      this.showAdd = false;
      this.title = "打开魔力池";
    }else{
      this.onShowSlot()
    }
  }

  onShowAdd(): void {
    this.showLoading = false;
    this.showSlot = false;
    this.showBeforeAdd = false;
    this.showAdd = true;
  }

  onShowSlot(): void {
    this.showLoading = false;
    this.showSlot = true;
    this.showBeforeAdd = false;
    this.showAdd = false;
    this.title = "魔力池";
  }

  dialogOpen(): void {
    this.dialog.open(this.new, { disableClose: true });
  }

  dialogClose(type: number): void {
    if(type == 0){
      this.dialog.close();
    }else{
      if(this.slotName){
        this.dialog.open(this.loading, {disableClose: true});
        this.conjureService.add("name="+this.slotName).subscribe(res=>this.addFunc(res));
      }else{
        this.bottomPop.open("请输入法术位名称", 0)
      }
    }
    this.slotName = "";
  }

  addFunc(res: Res): void {
    this.dialog.closeAll()
    if(res.status != 200){
      this.bottomPop.open(res.msg, 2);
    }
  }

}
