import { Component, ViewChild, TemplateRef } from '@angular/core';
import { DialogService } from '../service/dialog.service';
import { ConjureService } from '../service/conjure.service';
import { BottomPopService } from '../service/bottom-pop.service';
import { StorageService } from '../service/storage.service';
import { Res, Magic, Slot, Minutes, Dialog } from '../common/params';
import { FormControl, Validators } from '@angular/forms';
import { Md5 } from "ts-md5";

@Component({
  selector: 'app-magic',
  templateUrl: './magic.component.html',
  styleUrls: ['./magic.component.scss']
})
export class MagicComponent {
  //流程控制
  showLoading: boolean;
  showSlot: boolean;
  showStart: boolean;
  showAdd: boolean;
  step: string;

  onShowLoading(): void {
    this.showLoading = true;
    this.showSlot = this.showStart = this.showAdd = false;
  }

  onShowStart(): void {
    this.showStart = true;
    this.showLoading = this.showSlot = this.showAdd = false;
    this.title = "打开魔力池";
  }

  onShowAdd(): void {
    this.showAdd = true;
    this.showLoading = this.showSlot = this.showStart = false;
  }

  onShowSlot(): void {
    this.showSlot = true;
    this.showLoading = this.showStart = this.showAdd = false;
    this.title = "魔力池";
  }

  //变量
  title: string;        //标题
  data: Magic           // 数据
  newMinutes: number    //新的时间
  tabIndex: number = 0; //时间修改的方法
  selectItem: number;   //选择的法术位
  slotName: string;     //法术位名称
  account: string = ""; //账号
  pwd: string = "";     //密码
  minutesRule = new FormControl(null, [Validators.required, Validators.min(1), Validators.pattern('[0-9]*')])

  //模板
  @ViewChild("ready") ready: TemplateRef<any>;
  @ViewChild("new") new: TemplateRef<any>;
  @ViewChild("login") login: TemplateRef<any>;
  @ViewChild("delete") delete: TemplateRef<any>;
  @ViewChild("aae") aae: TemplateRef<any>
  
  constructor(
    private conjure: ConjureService,
    private storage: StorageService,
    private dialog: DialogService,
    private bottomPop: BottomPopService
  ) {
    this.onShowLoading()
    this.getSlots()
  }
  
  randomSalt(len: number): string {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let str = '';
    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * 62));
    }
    return str
  }

  getLogin(): string {
    let salt = this.randomSalt(4)
    return "&account="+this.account+"&pwd="+(this.pwd ? (Md5.hashStr(Md5.hashStr(this.pwd)+" "+salt)+"&salt="+salt+this.randomSalt(2)) : "")
  }

  getSlots(): void {
    let data = "order="+this.storage.get("order")+this.getLogin()
    this.conjure.getData(data).subscribe(res => this.dataFunc<Magic>("slots", res));
  }

  getAdd(): void {
    let data = "name="+this.slotName+this.getLogin()
    this.dialog.open(this.ready, {disableClose: true});
    this.conjure.add(data).subscribe(res=>this.dataFunc<Slot>("add", res));
  }

  getDelete(): void {
    let data = "item="+this.selectItem+this.getLogin()
    this.dialog.open(this.ready, {disableClose: true});
    this.conjure.delete(data).subscribe(res=>this.dataFunc<Minutes>("delete", res))
  }

  getStart(data: string): void {
    data += this.getLogin()
    this.dialog.open(this.ready, {disableClose: true})
    this.conjure.start(data).subscribe(res => this.dataFunc<Magic>("start", res));
  }

  getEdit(): void {
    let data = "item="+this.selectItem+"&minutes="+this.newMinutes+"&type="+this.tabIndex+this.getLogin()
    this.dialog.open(this.ready, {disableClose: true});
    this.conjure.edit(data).subscribe(res=>this.dataFunc<Minutes>("aae", res))
  }
  
  dataFunc<T>(name: string, res: Res): void {
    if(res.status != 200){
      this.bottomPop.open(res.msg, 2);
      if(res.status == 100){
        this.step = name
        this.onDialogOpen({name: "login"})
      }
    }else{
      this.account = this.pwd = ""
      this[name+"Func"](<T>res.data)
      this.dialog.closeAll();
    } 
  }

  slotsFunc(data: Magic) {
    this.data = data
    if(Object.keys(data).length == 0){
      this.onShowStart()
    }else{
      this.onShowSlot()
    }
  }

  addFunc(data: Slot): void {
    this.slotName = ""
    this.data.slot.unshift(data)
  }

  deleteFunc(data: Minutes): void {
    this.data.slot = this.data.slot.filter(list=>list.item!=this.selectItem)
    this.data.minutes = data.total
  }

  startFunc(data: Magic) {
    this.data = data
    this.onShowSlot()
  }

  aaeFunc(data: Minutes): void {
    this.minutesRule.reset()
    let item = this.data.slot.findIndex((val)=>{return val.item==this.selectItem})
    this.data.minutes = data.total
    this.data.slot[item].minutes = data.new
  }

  onDialogOpen(data: Dialog){
    this.dialog.open(this[data['name']], { disableClose: true })
    this.selectItem = data['key']
  }
  
  dialogClose(data: Dialog): void {
    if(data['key'] == 0){
      this.dialog.closeAll();
    }else{
      this[data['name']+"Close"]()
    }
  }

  newClose(): void {
    if(this.slotName){
      this.getAdd()
    }else{
      this.bottomPop.open("请输入法术位名称", 0)
    }
  }

  loginClose(): void {
    this.dialog.closeAll();
    this["get"+this.step.replace(this.step[0],this.step[0].toUpperCase())]()
  }

  deleteClose(): void {
    this.getDelete()
  }  

  aaeClose(): void {
    if(!/^[0-9]+$/.test(this.newMinutes+"")){
      this.bottomPop.open("请只输入数字", 0)
    }else{
      this.getEdit()
    }
  }

}
