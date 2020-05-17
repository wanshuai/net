import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogRef: MatDialogRef<any>[] = []

  constructor(
    private dialog: MatDialog,
  ) { }

  open<T, D = any>(templateRef: TemplateRef<T>, config: MatDialogConfig<D>): MatDialogRef<T> {
    let dialog = this.dialog.open(templateRef, config);

    this.dialogRef.push(dialog)
    // console.log(this.dialogRef)
    return dialog
  }

  close(): void {
    this.dialogRef[this.dialogRef.length - 1].close()
    this.dialogRef.pop()
    // console.log(this.dialogRef)
  }

  closeAll(): void {
    for(let dialog of this.dialogRef.reverse()) dialog.close()
    this.dialogRef = []
    // console.log(this.dialogRef)
  }
}
