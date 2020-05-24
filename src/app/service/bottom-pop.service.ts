import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class BottomPopService {

  duration: number = 2000
  level: string[] = ["提示", "警告", "错误"]

  constructor(private snackBar: MatSnackBar){}

  open(message: string, level: string|number, time?: number|{}, config?: {}): void{
    let options = {}
    if(!message) message = "没有定义message参数"
    if(typeof level === "number") level = this.level.find((item: string, index: number) => {return index===level})
    if(typeof time === "number" && time > 0) this.duration = time
    else if(typeof time !== "undefined" && Object.keys(time).length > 0) options = time
    if(typeof config !== "undefined" && Object.keys(config).length > 0) Object.assign(options, config)

    options["duration"] = this.duration
    options["panelClass"] = "text-center"
    this.snackBar.open(message, level, options)
  }
}
