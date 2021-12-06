import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PacientesService {

  url = `${environment.base_url}/pacientes`;
  url_catalogo_clue_autocomplet = `${environment.base_url}/busqueda-clues`;
  url_catalogo_diagnostico_autocomplet = `${environment.base_url}/busqueda-diagnosticos`;

  url_filter_catalogs =  `${environment.base_url}/catalogos-filtro-pacientes`;
  url_municipios = `${environment.base_url}/municipios`;

  url_localidades = `${environment.base_url}/localidades`;


  constructor(private http: HttpClient) { }

  getPacientesList(payload):Observable<any> {
    return this.http.get<any>(this.url,{params: payload}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getPacientesFilters(filters):Observable<any> {
    return this.http.get<any>(this.url,{params: filters}).pipe(
      map( response => {
        return response;
      })
    );
  }

  getPaciente(id) {
    return this.http.get<any>(this.url+'/'+id,{}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }

  getFilterCatalogs():Observable<any>{
    return this.http.get<any>(this.url_filter_catalogs).pipe(
      map(response => {
        return response;
      })
    );
  }

  getMunicipios():Observable<any> {
    return this.http.get<any>(this.url_municipios).pipe(
      map( response => {
        return response;
      })
    );
  }

  getLocalidades(id) {
    return this.http.get<any>(this.url_localidades+'/'+id,{}).pipe(
      map( (response: any) => {
        return response;
      }
    ));
  }


  buscarClue(payload):Observable<any>{
    return this.http.get<any>(this.url_catalogo_clue_autocomplet,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  buscarDiagnostico(payload):Observable<any>{
    return this.http.get<any>(this.url_catalogo_diagnostico_autocomplet,{params:payload}).pipe(
      map( response => {
        return response.data;
      })
    );
  };

  updatePaciente(id,payload) {
    return this.http.put<any>(this.url+'/'+id,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  createPaciente(payload) {
    return this.http.post<any>(this.url,payload).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

  deletePaciente(id) {
    return this.http.delete<any>(this.url+'/'+id,{}).pipe(
      map( (response) => {
        return response;
      }
    ));
  }

}
