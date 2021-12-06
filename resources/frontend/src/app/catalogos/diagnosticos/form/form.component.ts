import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DiagnosticosService } from '../diagnosticos.service';
import { CustomValidator } from '../../../utils/classes/custom-validator';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'form-diagnostico',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(
    private diagnosticoService: DiagnosticosService,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {}

  isLoading:boolean = false;
  diagnostico:any = {};

  provideID:boolean = false;
  
  diagnosticoForm = this.fb.group({
    'nombre': ['',[Validators.required]],
  });

  ngOnInit() {
    let id = this.data.id;
    if(id){
      this.isLoading = true;
      this.diagnosticoService.getDiagnostico(id).subscribe(
        response => {
          this.diagnostico = response.diagnostico;
          this.diagnosticoForm.patchValue(this.diagnostico);
          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });
    }
  }

  saveDiagnostico(){
    this.isLoading = true;
    if(this.diagnostico.id){
      this.diagnosticoService.updateDiagnostico(this.diagnostico.id,this.diagnosticoForm.value).subscribe(
        response =>{
          this.dialogRef.close(true);
          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
      });
    }else{
      this.diagnosticoService.createDiagnostico(this.diagnosticoForm.value).subscribe(
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