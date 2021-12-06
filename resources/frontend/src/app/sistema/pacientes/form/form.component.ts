import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PacientesService } from '../pacientes.service';
import { MatSnackBar } from '@angular/material';
import { CustomValidator } from '../../../utils/classes/custom-validator';
import * as moment from 'moment';

export interface FormDialogData {
  id: number;
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor(
    private pacientesService: PacientesService,
    public dialogRef: MatDialogRef<FormComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData
  ) {}

  showSnackBar(message, action, duration){
    this.snackBar.open(message, action,{
      duration: duration
    });
  }

  localidadesIsLoading: boolean = false;
  isLoading:boolean = false;
  paciente:any = {};

  provideID:boolean = false;

  fechaActual:any = '';
  fechaInicial:any = '';
  minDate:any = '';
  maxDate:any = '';
  
  pacienteForm = this.fb.group({

    'id':                       [''],
    'folio_paciente':           [''],
    'clues':                    [''],
    'nombre':                   ['',[Validators.required]],
    'paterno':                  ['',[Validators.required]],
    'materno':                  ['',[Validators.required]],
    'edad':                     ['',[Validators.required]],
    'fecha_nacimiento':         ['',[Validators.required]],
    'fecha_ingreso':            ['',[Validators.required]],
    'hora_ingreso':             ['',[Validators.required]],
    'telefono_contacto':        ['',[Validators.required]],
    'semanasControl':           [''],
    'cluesControl':             [''],
    'curp':                     [''],
    'fecha_puerperio':          [''],
    'clues_puerperio':          [''],
    'esPuerpera':               [''],
    'gestas':                   ['', [Validators.required]],
    'partos':                   ['', [Validators.required]],
    'cesareas':                 ['', [Validators.required]],
    'abortos':                  ['', [Validators.required]],
    'semanas_gestacionales':    [''],
    'estaEmbarazada':           [''],
    'fueReferida':              [''],
    'tieneAlta':                [''],
    'esExtranjero':             [''],
    'paisOrigen':               [''],
    'ultimoEstadoActual':       [''],
    'estado_actual_id':         [''],
    'user_id':                  [''],
    'municipio_id':             ['',[Validators.required]],
    'localidad_id':             ['',[Validators.required]],
    'afiliacion_id':            [''],
    'metodo_gestacional_id':    [''],
    'clues_referencia':         [''],

  });

  catalogo_municipios:any[] = [];
  catalogo_localidades:any[] = [];


  ngOnInit() {
    let id = this.data.id;
    if(id){
      this.isLoading = true;
      this.pacientesService.getPaciente(id).subscribe(
        response => {
          this.paciente = response.paciente;
          this.pacienteForm.patchValue(this.paciente);
          this.getLocalidad(this.pacienteForm.get('municipio_id').value)
          console.log(this.pacienteForm.value);

          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
        });
    }

    this.getLugares();

    moment.locale('es');
    let fecha = new Date();
    this.fechaActual = moment(fecha).format('YYYY-MM-D');

    this.minDate = new Date(2020, 0, 1);
    this.maxDate = fecha;

  }

  savePaciente(){
    this.isLoading = true;
    if(this.paciente.id){
      this.pacientesService.updatePaciente(this.paciente.id,this.pacienteForm.value).subscribe(
        response =>{
          this.dialogRef.close(true);
          console.log(response);
          this.isLoading = false;
        },
        errorResponse => {
          console.log(errorResponse);
          this.isLoading = false;
      });
    }else{
      this.pacientesService.createPaciente(this.pacienteForm.value).subscribe(
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

  getLugares(){
    this.pacientesService.getMunicipios().subscribe(
      response => {
        this.catalogo_municipios = response;
        console.log(this.catalogo_municipios);
        this.localidadesIsLoading = false;
      },
      errorResponse => {
        console.log(errorResponse);
        this.localidadesIsLoading = false;
      });
  }

  getLocalidad(idLocalidad){

    
    this.localidadesIsLoading = true;
    this.pacientesService.getLocalidades(idLocalidad).subscribe(
      response => {
        this.catalogo_localidades = response;
        this.localidadesIsLoading = false;
      },
      errorResponse => {
        console.log(errorResponse);
        this.localidadesIsLoading = false;
      });

  }

  compareMunicipioSelect(op,value){
    return op.id == value.id;
  }

  numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  
  }

  calculateAge() {

      var fecha1 = moment(this.fechaActual);
      var fecha2 = moment(this.pacienteForm.get('fecha_nacimiento').value).format('YYYY-MM-D');
  
      this.pacienteForm.controls['edad'].patchValue(fecha1.diff(fecha2, 'years'));
  
  
      console.log(this.pacienteForm.get('fecha_nacimiento').value);

      console.log("ingreso",this.pacienteForm.get('fecha_ingreso').value);

  }

  calcularGestas(){

    let abortos   = parseInt(this.pacienteForm.get('abortos').value);
    let partos    = parseInt(this.pacienteForm.get('partos').value);
    let cesareas  = parseInt(this.pacienteForm.get('cesareas').value);

    let totalGestas = abortos + partos + cesareas;

    if(this.pacienteForm.get('gestas').value == totalGestas || this.pacienteForm.get('gestas').value == (totalGestas + 1) ){
      
      this.showSnackBar("la sumatoria de abortos, patos y cesarias debe ser igual o mayor a maximo 1 gestación", null, 3000);

    }else{

      this.pacienteForm.get('gestas').patchValue(totalGestas);
      this.showSnackBar("la sumatoria de abortos, patos y cesarias debe ser igual o mayor a maximo 1 gestación", null, 3000);
      
    }


  }


  onNoClick(): void {
    this.dialogRef.close();
  }

}