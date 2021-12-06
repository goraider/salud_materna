import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface FormDialogData {
  datos: any;
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  
  public dialog: MatDialog;
  panelOpenState = false;

  constructor(
    public dialogRef: MatDialogRef<DetailsComponent>,

    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {}

  ngOnInit() {
    //console.log("aca", this.data.datos.seguimientos);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
