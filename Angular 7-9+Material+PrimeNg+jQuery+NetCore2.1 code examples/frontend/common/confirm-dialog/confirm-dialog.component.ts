import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogDataArg } from '../../_models/data.model';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  dialogData: ConfirmDialogDataArg = new ConfirmDialogDataArg();

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.dialogData.title = data.title || this.dialogData.title;
      this.dialogData.txt = data.txt || this.dialogData.txt;
      this.dialogData.okBtnTxt = data.okBtnTxt || this.dialogData.okBtnTxt;
      this.dialogData.cancelBtnTxt = data.cancelBtnTxt || this.dialogData.cancelBtnTxt;
      this.dialogData.isCancelBtn = data.isCancelBtn || this.dialogData.isCancelBtn;
    }
  }

  ngOnInit() {
  }

  onCanselClick(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.dialogRef.close(true);
  }

}
