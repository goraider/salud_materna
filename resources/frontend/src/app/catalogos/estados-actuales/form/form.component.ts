import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { EstadosActualesService } from '../estados-actuales.service';
import { CustomValidator } from '../../../utils/classes/custom-validator';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'form-estado-actual',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(
    private estadosActualesService: EstadosActualesService,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {}

  isLoading:boolean = false;
  estados_actuales:any = {};

  provideID:boolean = false;
  
  estadoActualForm = this.fb.group({
    'nombre': ['',[Validators.required]],
  });

  ngOnInit() {

    let id = this.data.id;
    if(id){
      this.isLoading = true;
      this.estadosActualesService.getEstadoActual(id).subscribe(
        response => {
          this.estados_actuales = response.estado_actual;
          this.estadoActualForm.patchValue(this.estados_actuales);
          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });
    }
  }

  saveEstadoActual(){
    this.isLoading = true;
    if(this.estados_actuales.id){
      this.estadosActualesService.updateEstadoActual(this.estados_actuales.id,this.estadoActualForm.value).subscribe(
        response =>{
          this.dialogRef.close(true);
          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
      });
    }else{
      this.estadosActualesService.createEstadoActual(this.estadoActualForm.value).subscribe(
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