import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { PacientesService } from '../pacientes.service';
import { FormComponent } from '../form/form.component';
import { DetailsComponent } from '../details/details.component';
import { MatTable, MatExpansionPanel } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, map, startWith,  } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import {Observable} from 'rxjs';
import { MediaObserver } from '@angular/flex-layout';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';

import { ReportWorker } from '../../../web-workers/report-worker';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';


import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [
    trigger('buttonInOut', [
        transition('void => *', [
            style({opacity: '1'}),
            animate(200)
        ]),
        transition('* => void', [
            animate(200, style({opacity: '0'}))
        ])
    ])
  ],
  providers:[
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false, showError: true } }
  ]
})
export class ListComponent implements OnInit {

  isLoading: boolean = false;
  isLoadingPDF: boolean = false;
  isLoadingPDFArea: boolean = false;
  isLoadingAgent: boolean = false;
  mediaSize: string;

  puedeFinalizar: boolean = false;
  capturaFinalizada: boolean = false;
  countPersonalActivo: number = 0;
  countPersonalValidado: number = 0;
  percentPersonalValidado: number = 0;

  showMyStepper:boolean = false;
  showReportForm:boolean = false;
  stepperConfig:any = {};
  reportTitle:string;
  reportIncludeSigns:boolean = false;
 
  searchQuery: string = '';

  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  statusIcon:any = {
    '1-0':'help', //activo
    '1-1':'verified_user', //activo verificado 
    '2':'remove_circle', //baja
    '3':'warning', // No identificado
    '4':'swap_horizontal_circle' //en transferencia
  };

  displayedColumns: string[] = ['clues','nombre','edad', 'fecha_ingreso', 'hora_ingreso', 'details', 'actions'];
  dataSource: any = [];
  dataSourceFilters: any = [];

  isLoadingEstadosActuales:boolean = false;
  estadosActuales:any[] = [];

  filterChips:any = []; //{id:'field_name',tag:'description',tooltip:'long_description'}
  
  filterCatalogs:any = {};
  filteredCatalogs:any = {};

  filterForm = this.fb.group({

    'nombre'            :[undefined],
    'clues'             :[undefined],
    'diagnosticos'      :[undefined],
    'estados_actuales'  :[undefined],
    'altas'             :[undefined],
    'fecha_inicio'      :[undefined],
    'fecha_fin'         :[undefined]

  });
  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;


  constructor(private sharedService: SharedService, private pacientesService: PacientesService, private fb: FormBuilder, public dialog: MatDialog, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatTable, {static:false}) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel, {static:false}) advancedFilter: MatExpansionPanel;

  ngOnInit() {
    this.mediaObserver.media$.subscribe(
      response => {
        this.mediaSize = response.mqAlias;
    });

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','paginator','filter']);
    console.log(appStoredData);

    if(appStoredData['searchQuery']){
      this.searchQuery = appStoredData['searchQuery'];
    }

    let event = null
    if(appStoredData['paginator']){
      this.currentPage = appStoredData['paginator'].pageIndex;
      this.pageSize = appStoredData['paginator'].pageSize;
      event = appStoredData['paginator'];

      if(event.selectedIndex >= 0){
        console.log("siguiente", event);
        this.selectedItemIndex = event.selectedIndex;
      }
    }else{
      let dummyPaginator = {
        length: 0,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        previousPageIndex: (this.currentPage > 0)?this.currentPage-1:0
       };
      this.sharedService.setDataToCurrentApp('paginator', dummyPaginator);
    }

    if(appStoredData['filter']){
      this.filterForm.patchValue(appStoredData['filter']);
    }

    let fecha = new Date();
    this.fechaActual = moment(fecha).format('YYYY-MM-D');
    this.maxDate = fecha;

    let fecha_inicio = new Date(2020, 0, 1);
    this.minDate = fecha_inicio;

    this.loadPacientesData(event);
    this.loadFilterCatalogs();
    //console.log(this.filteredDiagnosticos);
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  applyFilter(){
    console.log("aca",this.filterForm.value);
    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadPacientesData(null);
  }

  cleanFilter(filter){
    filter.value = '';
    //filter.closePanel();
  }

  cleanSearch(){
    this.searchQuery = '';
    //this.paginator.pageIndex = 0;
    //this.loadEmpleadosData(null);
  }

  toggleAdvancedFilter(status){
    if(status){
      this.advancedFilter.open();
    }else{
      this.advancedFilter.close();
    }
  }


  // autocompletClues(){

  //   this.controlClues.valueChanges
  //   .pipe(
  //     debounceTime(300),
  //     tap( () => {
  //       this.cluesIsLoading = true;
  //     } ),
  //     switchMap(value => {
  //         if(!(typeof value === 'object')){
  //           return this.pacientesService.buscarClue({query:value}).pipe(
  //             finalize(() => this.cluesIsLoading = false )
  //           );
  //         }else{
  //           this.cluesIsLoading = false;
  //           return [];
  //         }
  //       }
  //     ),
  //   ).subscribe(items => this.filteredClues = items);

  // }

  // autocompletDiagnosticos(){

  //   this.controlDiagnosticos.valueChanges
  //   .pipe(
  //     debounceTime(300),
  //     tap( () => {
  //       this.diagnosticosIsLoading = true;
  //     } ),
  //     switchMap(value => {
  //         if(!(typeof value === 'object')){
  //           return this.pacientesService.buscarDiagnostico({query:value}).pipe(
  //             finalize(() => this.diagnosticosIsLoading = false )
  //           );
  //         }else{
  //           this.diagnosticosIsLoading = false;
  //           return [];
  //         }
  //       }
  //     ),
  //   ).subscribe(items => this.filteredDiagnosticos = items);

  // }
  public loadFilterCatalogs(){
    this.pacientesService.getFilterCatalogs().subscribe(
      response => {
        this.filterCatalogs = {
          'clues': response.data.clues,
          'diagnosticos': response.data.diagnosticos,
          'estados_actuales': response.data.estados_actuales
        };

        this.filteredCatalogs['clues']            = this.filterForm.controls['clues'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'clues','nombre')));
        this.filteredCatalogs['diagnosticos']     = this.filterForm.controls['diagnosticos'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'diagnosticos','nombre')));
        //this.filteredCatalogs['estados_actuales'] = this.filterForm.controls['estados_actuales'].valueChanges.pipe(startWith(''),map(value => this._filter(value,'id','nombre')));
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
      }
    );
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    let filterValue = '';
    if(value){
      if(typeof(value) == 'object'){
        filterValue = value[valueField].toLowerCase();
      }else{
        filterValue = value.toLowerCase();
      }
    }
    return this.filterCatalogs[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
  }

  loadFilterChips(data){
    this.filterChips = [];
    for(let i in data){
      if(data[i]){
        let item = {
          id: i,
          tag: '',
          tooltip: i.toUpperCase() + ': ',
          active: true
        };
        if(i == 'clues'){
          item.tag = data[i].id;
          item.tooltip += data[i].nombre;
          if(item.tooltip.length > 30){
            item.tag.slice(0,27) + '...';
            item.tooltip;
          }else{
            item.tag = data[i].nombre;
            item.tooltip = i.toUpperCase();
          }
        }else if(i == 'diagnosticos'){
          item.tag = data[i].nombre;
          item.tooltip += data[i].nombre;
        }else if(i == 'estados_actuales'){
          item.tag = data[i].nombre;
        }
        else if(i == 'altas'){
          if(this.filterForm.controls.altas.value == 1){
            item.tag = 'Dadas de Alta';
          }else{
            item.tag = 'Hospitalizadas ó en Atención';
          }
        }
        else if (i == 'fecha_inicio') {
          var desde = moment(this.filterForm.value.fecha_inicio).format('DD/MM/YYYY'); 
          item.tag = desde;
          item.tooltip = "Fecha de Ingreso (Desde): " + desde;
        }
        else if (i == 'fecha_fin') {
          var hasta = moment(this.filterForm.value.fecha_fin).format('DD/MM/YYYY')
          item.tag = hasta;
          item.tooltip = "Fecha de Ingreso (Hasta): " + hasta;
        }
        else{
          item.tag = this.filterForm.value.nombre
        }
        
        this.filterChips.push(item);
      }
    }
  }

  public loadPacientesData(event?:PageEvent){

    this.isLoading = true;
    let params:any;
    if(!event){
      params = { page: 1, per_page: this.pageSize }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize
      };
    }

    if(event && !event.hasOwnProperty('selectedIndex')){
      this.selectedItemIndex = -1;
    }
    
    params.query = this.searchQuery;

    let filterFormValues = this.filterForm.value;
    let countFilter = 0;

    this.loadFilterChips(filterFormValues);

    for(let i in filterFormValues){

      if(filterFormValues[i]){
        if(i == 'clues'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'diagnosticos'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'estados_actuales'){
          params[i] = filterFormValues[i].id;
        }else if(i == 'altas'){
          params[i] = this.filterForm.value.altas;
        }
        else if (i == 'fecha_inicio') {
          var desde = moment(this.filterForm.value.fecha_inicio).format('YYYY-MM-DD');
          params[i] = desde;
        }
        else if (i == 'fecha_fin') {
          var hasta = moment(this.filterForm.value.fecha_fin).format('YYYY-MM-DD');
          params[i] = hasta;
        }
        else{ //nombre
          params[i] = this.filterForm.value.nombre;
        }
        countFilter++;
      }
    }

    if(countFilter > 0){
      params.active_filter = true;
    }

    if(event){
      this.sharedService.setDataToCurrentApp('paginator',event);
    }

    this.sharedService.setDataToCurrentApp('searchQuery',this.searchQuery);
    this.sharedService.setDataToCurrentApp('filter',filterFormValues);

    this.pacientesService.getPacientesList(params).subscribe(
      response =>{
        if(response.error) {
          let errorMessage = response.error.message;
          this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
          if(response.data.total > 0){
            this.dataSource = response.data.data;
            this.resultsLength = response.data.total;
          }else{
            this.dataSource = [];
            this.resultsLength = 0;
          }
        }
        this.isLoading = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
    return event;
  }
  


  compareEstadoActualSelect(op,value){
    return op.id == value.id;
  }


  openDialogForm(id:number = 0){
    const dialogRef = this.dialog.open(FormComponent, {
      width: '1000px',
      data: {id: id}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.applyFilter();
      }
    });
  }

  openDialogDetails(datos:string = ''){
    console.log(datos);
    const dialogRef = this.dialog.open(DetailsComponent, {
      width: '1000px',
      data: {datos: datos}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.applyFilter();
      }
    });
  }

  removeFilterChip(item,index){
    this.filterForm.get(item.id).reset();
    this.filterChips[index].active = false;
  }


  confirmDeletePaciente(id:string = ''){
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data: {dialogTitle:'Eliminar Paciente',dialogMessage:'Esta seguro de eliminar este Paciente?',btnColor:'warn',btnText:'Eliminar'}
    });

    dialogRef.afterClosed().subscribe(reponse => {
      if(reponse){
        this.pacientesService.deletePaciente(id).subscribe(
          response => {
            console.log(response);
            this.loadPacientesData(null);
          }
        );
      }
    });
  }

  toggleReportPanel(){
    this.reportIncludeSigns = false;
    this.reportTitle = 'PACIENTES EMBARAZADAS';

    this.stepperConfig = {
      steps:[
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Cargar Datos', active: 'Cargando Datos', done: 'Datos Cargados' },
          icon: 'settings_remote',
          errorMessage: '',
        },
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Generar PDF', active: 'Generando PDF', done: 'PDF Generado' },
          icon: 'settings_applications',
          errorMessage: '',
        },
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Descargar Archivo', active: 'Descargando Archivo', done: 'Archivo Descargado' },
          icon: 'save_alt',
          errorMessage: '',
        },
      ],
      currentIndex: 0
    }

    this.showReportForm = !this.showReportForm;
    if(this.showReportForm){
      this.showMyStepper = false;
    }
    //this.showMyStepper = !this.showMyStepper;
  }

  reportePacientes(){
    //this.showMyStepper = true;
    this.isLoadingPDF = true;
    this.showMyStepper = true;
    this.showReportForm = false;

    let params:any = {};
    let countFilter = 0;

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
    console.log(appStoredData);

    params.reporte = 'pacientes';

    if(appStoredData['searchQuery']){
      params.query = appStoredData['searchQuery'];
    }

    for(let i in appStoredData['filter']){

      if(appStoredData['filter'][i]){
        if(i == 'clues'){
          params[i] = appStoredData['filter'][i].id;
        }else if(i == 'diagnosticos'){
          params[i] = appStoredData['filter'][i].id;
        }else if(i == 'estados_actuales'){
          params[i] = appStoredData['filter'][i].id;
        }else if(i == 'altas'){
          params[i] = this.filterForm.value.altas;
        }
        else if(i == 'fecha_inicio'){
          var desde = moment(this.filterForm.value.fecha_inicio).format('YYYY-MM-DD');
          params[i] = desde;
        }
        else if (i == 'fecha_fin') {
          var hasta = moment(this.filterForm.value.fecha_fin).format('YYYY-MM-DD');
          params[i] = hasta;
        }
        else{ //nombre
          params[i] = this.filterForm.value.nombre;
        }
        countFilter++;
      }

    }

    if(countFilter > 0){
      params.active_filter = true;
    }
    
    this.stepperConfig.steps[0].status = 2;

    this.pacientesService.getPacientesList(params).subscribe(
      response =>{
        console.log("zxczxc",response);
        if(response.error) {
          let errorMessage = response.error.message;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
          this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
          this.isLoading = false;
          //this.sharedService.showSnackBar(errorMessage, null, 3000);
        } else {
            this.stepperConfig.steps[0].status = 3;
            this.stepperConfig.steps[1].status = 2;
            this.stepperConfig.currentIndex = 1;

            const reportWorker = new ReportWorker();
            reportWorker.onmessage().subscribe(
              data => {
                this.stepperConfig.steps[1].status = 3;
                this.stepperConfig.steps[2].status = 2;
                this.stepperConfig.currentIndex = 2;

                console.log("deitaa",data);
                FileSaver.saveAs(data.data,'Pacientes');
                reportWorker.terminate();

                this.stepperConfig.steps[2].status = 3;
                this.isLoadingPDF = false;
                this.showMyStepper = false;
            });

            reportWorker.onerror().subscribe(
              (data) => {
                //this.sharedService.showSnackBar('Error: ' + data.message,null, 3000);
                this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
                this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = data.message;
                this.isLoadingPDF = false;
                //console.log(data);
                reportWorker.terminate();
              }
            );
            
            let config = {
              title: this.reportTitle,
              showSigns: this.reportIncludeSigns, 
            };
            console.log("titulo", config);
            reportWorker.postMessage({data:{items: response.data, config:config},reporte:'/pacientes'});
        }
        this.isLoading = false;
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
        this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = errorMessage;
        //this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
        
      }
    );


    /*this.empleadosService.reporteEmpleados().subscribe(
      response =>{
        const reportWorker = new ReportWorker();
        reportWorker.onmessage().subscribe(
          data => {
            this.isLoadingPDF = false;
            console.log(data);
            FileSaver.saveAs(data.data,'PersonalActivo');
        });
        reportWorker.postMessage({data:response,reporte:'empleados/personal-activo'});
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );*/
  }

  fichaInformativa (obj){
    console.log("DATOS AL WORKER",obj);
    //this.showMyStepper = true;
    this.isLoadingPDF = true;
    this.showMyStepper = true;
    this.showReportForm = false;

    let params:any = {};
    let countFilter = 0;
    let fecha_reporte = new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'numeric', day: '2-digit'}).format(new Date());

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','filter']);
    
    params.reporte = 'personal-activo';
    if(appStoredData['searchQuery']){
      params.query = appStoredData['searchQuery'];
    }
    this.stepperConfig = {
      steps:[
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Cargar Datos', active: 'Cargando Datos', done: 'Datos Cargados' },
          icon: 'settings_remote',
          errorMessage: '',
        },
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Generar PDF', active: 'Generando PDF', done: 'PDF Generado' },
          icon: 'settings_applications',
          errorMessage: '',
        },
        {
          status: 1, //1:standBy, 2:active, 3:done, 0:error
          label: { standBy: 'Descargar Archivo', active: 'Descargando Archivo', done: 'Archivo Descargado' },
          icon: 'save_alt',
          errorMessage: '',
        },
      ],
      currentIndex: 0
    }


    this.stepperConfig.steps[0].status = 2;


            this.stepperConfig.steps[0].status = 3;
            this.stepperConfig.steps[1].status = 2;
            this.stepperConfig.currentIndex = 1;

            const reportWorker = new ReportWorker();
            reportWorker.onmessage().subscribe(
              data => {
                this.stepperConfig.steps[1].status = 3;
                this.stepperConfig.steps[2].status = 2;
                this.stepperConfig.currentIndex = 2;

                FileSaver.saveAs(data.data,'Ficha-Informativa '+'('+fecha_reporte+')');
                reportWorker.terminate();

                this.stepperConfig.steps[2].status = 3;
                this.isLoadingPDF = false;
                this.showMyStepper = false;
            });

            reportWorker.onerror().subscribe(
              (data) => {
                this.stepperConfig.steps[this.stepperConfig.currentIndex].status = 0;
                this.stepperConfig.steps[this.stepperConfig.currentIndex].errorMessage = data.message;
                this.isLoadingPDF = false;
                reportWorker.terminate();
              }
            );
            
            let config = {
              title: "TARJETA INFORMATIVA",
              showSigns: this.reportIncludeSigns, 
            };
            reportWorker.postMessage({data:{items: obj, config:config},reporte:'/ficha-informativa'});
            this.isLoading = false;
  }

}
