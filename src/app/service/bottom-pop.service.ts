import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class BottomPopService {

  level: string[] = ["提示", "警告", "错误"]

  constructor(private snackBar: MatSnackBar){}

  open(message: string, level?: string|number, time?: number): void{
    if(typeof level === "number") level = this.level.find((item: string, index: number) => {return index===level})
    if(!message) message = "没有定义message参数"
    if(typeof time === null || time <= 0) time = 2000;

    this.snackBar.open(message, level, {duration: time})
  }
}
