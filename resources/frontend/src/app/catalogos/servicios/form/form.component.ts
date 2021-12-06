import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ServiciosService } from '../servicios.service';
import { CustomValidator } from '../../../utils/classes/custom-validator';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'form-servicio',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(
    private servicioService: ServiciosService,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {}

  isLoading:boolean = false;
  servicios:any = {};

  provideID:boolean = false;
  
  servicioForm = this.fb.group({
    'nombre': ['',[Validators.required]],
  });

  ngOnInit() {

    let id = this.data.id;
    if(id){
      this.isLoading = true;
      this.servicioService.getServicio(id).subscribe(
        response => {
          this.servicios = response.servicio;
          this.servicioForm.patchValue(this.servicios);
          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });
    }
  }

  saveServicio(){
    this.isLoading = true;
    if(this.servicios.id){
      this.servicioService.updateServicio(this.servicios.id,this.servicioForm.value).subscribe(
        response =>{
          this.dialogRef.close(true);
          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
      });
    }else{
      this.servicioService.createServicio(this.servicioForm.value).subscribe(
        response =>{
          this.dialogRef.close(true);
          console.log(response);
          this.isLoading = false;
      },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }



}