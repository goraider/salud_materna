import { LOGOS } from "../../logos";

export class ReporteAltas { 

    getDocumentDefinition(reportData:any) {
        console.log("shiiit",reportData.items);
        let contadorLineasHorizontalesV = 0;
        //let fecha_hoy =  Date.now();
      //console.log(LOGOS);
        let datos = {
          pageOrientation: 'landscape',
          pageSize: 'LEGAL',
          /*pageSize: {
            width: 612,
            height: 396
          },*/
          pageMargins: [ 40, 60, 40, 60 ],
          header: {
            margin: [30, 20, 30, 0],
            columns: [
                {
                    image: LOGOS[0].LOGO_FEDERAL,
                    width: 80
                },
                {
                    margin: [10, 0, 0, 0],
                    text: 'SECRETARÍA DE SALUD\n'+'COORDINACIÓN DE LA ESTRATEGIA PARA LA CONTENCIÓN DE LA MORTALIDAD MATERNA - '+' '+reportData.config.title+' ',
                    bold: true,
                    fontSize: 12,
                    alignment: 'center'
                },
                {
                  image: LOGOS[1].LOGO_ESTATAL,
                  width: 60
              }
            ]
          },
          footer: function(currentPage, pageCount) { 
            //return 'Página ' + currentPage.toString() + ' de ' + pageCount; 
            return {
              margin: [30, 20, 30, 0],
              columns: [
                  {
                      text:'http://salud-materna.saludchiapas.gob.mx/',
                      alignment:'left',
                      fontSize: 8,
                  },
                  {
                      margin: [10, 0, 0, 0],
                      text: 'Página ' + currentPage.toString() + ' de ' + pageCount,
                      fontSize: 8,
                      alignment: 'center'
                  },
                  {
                    text:new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date()),
                    alignment:'right',
                    fontSize: 8,
                }
              ]
            }
          },
          content: [],
            styles: {
              cabecera: {
                fontSize: 8,
                bold: true,
                fillColor:"#890000",
                color: "white",
                alignment:"center"
              },
              subcabecera:{
                fontSize: 5,
                bold:true,
                fillColor:"#DEDEDE",
                alignment:"center"
              },
              datos:
              {
                fontSize: 10
              },
              tabla_datos:
              {
                fontSize: 8,
                alignment:"center"
              },
              campos_izquierda:
              {
                fontSize: 7,
                alignment:"left"
              },
            }
        };

        let tabla_vacia = {
          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [ 15, 'auto', 60, 80, 50, 60, 60, 50, 80, 60, 60, 60, 60, 75],
            //40, 70, 20, 30, 30, 30, 'auto'
            margin: [0,0,0,0],
            body: [
              [
                {text: "N°", style: 'cabecera'},
                {text: "DISTRITO", style: 'cabecera'},
                {text: "HOSPITAL", style: 'cabecera'},
                {text: "NOMBRE", style: 'cabecera'},
                {text: "EDAD", style: 'cabecera'},
                {text: "MUNICIPIO", style: 'cabecera'},
                {text: "LOCALIDAD", style: 'cabecera'},
                {text: "FECHA DE ALTA/EGRESO", style: 'cabecera'},
                {text: "DIAGNOSTICO(S) DE ALTA/EGRESO", style: 'cabecera'},
                {text: "ESTADO DEL ALTA/EGRESO", style: 'cabecera'},
                {text: "MOTIVO DE EGRESO", style: 'cabecera'},
                {text: "CONDICIONES DE EGRESO", style: 'cabecera'},
                {text: "APEO", style: 'cabecera'},
                {text: "OBSERVACIONES DE EGRESO", style: 'cabecera'},
              ],

            ]
          }
        };
        
        datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));
      
        //console.log(datos.content[0].table.body);
        //console.log(data);
        let clues = '';
        let indice_actual;//(datos.content.length -1);
        let diagnosticos_alta = "";

        //console.log('for(let i = 0; i < ; i++){');
        for(let i = 0; i < reportData.items.length; i++){
          //console.log("iiiii", reportData.items.length);
          let paciente = reportData.items[i];
          let alta     = paciente.alta;

          let fecha_egreso     =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date(paciente.alta.fecha_alta));


          if(paciente.estaEmbarazada == 1 || paciente.fueReferida == 1 || paciente.tieneAlta == 1 || paciente.esExtranjero == 1){

            paciente.estaEmbarazada   = "Si";
            paciente.fueReferida      = "Si";
            paciente.tieneAlta        = "Si";
            paciente.esExtranjero     = "Si";

          }else{
            paciente.estaEmbarazada   = "No";
            paciente.fueReferida      = "No";
            paciente.tieneAlta        = "No";
            paciente.esExtranjero     = "No";
          }

          if(paciente.municipio_id == null ){

            paciente.municipio_id = "n/a"; 

          }
          else{
            paciente.municipio_id = paciente.municipio.nombre;
          }

          if(paciente.localidad_id == null ){

            paciente.localidad_id = "n/a"; 

          }
          else{
            paciente.localidad_id = paciente.localidad.nombre;
          }

          if(alta.diagnosticos.length == 0){

            diagnosticos_alta = "NO SE REGISTRÓ NINGÚN DIAGNOSTICO";

          }else{
              for (let indice in alta.diagnosticos){

                let index = parseInt(indice)+1;

                if (diagnosticos_alta!=="")
                diagnosticos_alta += ".\n";
                diagnosticos_alta += `${index}: ${alta.diagnosticos[indice].nombre}`;

              }
          }

          if(alta.estado_actual_id == null ){

            alta.estado_actual_id = "NO SE REGISTRÓ"; 

          }
          else{
            alta.estado_actual_id = alta.estado_actual.nombre;
          }

          //MOTIVO EGRESO
          if(alta.motivo_egreso_id == null ){

            alta.motivo_egreso_id = "NO SE REGISTRÓ"; 

          }
          else{
            alta.motivo_egreso_id = alta.motivo_egreso.nombre;
          }

          //CONDICION DE EGRESO
          if(alta.condicion_egreso_id == null ){

            alta.condicion_egreso_id = "NO SE REGISTRÓ"; 

          }
          else{
            alta.condicion_egreso_id = alta.condicion_egreso.nombre;
          }

          //ANTICONCEPTIVO
          if(alta.metodo_anticonceptivo_id == null ){

            alta.metodo_anticonceptivo_id = "NO SE REGISTRÓ"; 

          }
          else{
            alta.metodo_anticonceptivo_id = alta.metodo_anticonceptivo.nombre;
          }


              
 

              indice_actual = datos.content.length -1;
            // datos.content[indice_actual].table.body.push(
            //   [{text: "["+empleado.cr_id+"] "+empleado.cr_descripcion, colSpan: 12, style: 'subcabecera'},{},{},{},{},{},{},{},{},{},{},{}],
            // );
          

              datos.content[indice_actual].table.body.push([

                { text: i+1, style: 'tabla_datos' },
                { text: paciente.clues.distrito.clave, style: 'tabla_datos' }, 
                { text: paciente.clues.nombre, style: 'tabla_datos' },
                { text: paciente.nombre + ' '+ paciente.paterno + ' '+ paciente.materno , style: 'tabla_datos'},
                { text: paciente.edad +' Años', style: 'tabla_datos'},
                { text: paciente.municipio_id , style: 'tabla_datos'},
                { text: paciente.localidad_id , style: 'tabla_datos'},
                { text: fecha_egreso, style: "tabla_datos"},
                { text: diagnosticos_alta, style: 'campos_izquierda'},
                { text: alta.estado_actual_id, style: "tabla_datos"},
                { text: alta.motivo_egreso_id, style: "tabla_datos"},

                { text: alta.condicion_egreso_id, style: "tabla_datos"},
                { text: alta.metodo_anticonceptivo_id, style: "tabla_datos"},
                { text: alta.observaciones, style: "tabla_datos"},

              ]);
              diagnosticos_alta = "";
        }

        return datos;
      }
}