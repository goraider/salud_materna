import { LOGOS } from "../../logos";

export class ReportePacientes {

    getDocumentDefinition(reportData:any) {
        //console.log("shiiit",reportData.items);
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
                    text: 'SECRETARÍA DE SALUD\n'+'COORDINACIÓN DE LA ESTRATEGIA PARA LA CONTENCIÓN DE LA MORTALIDAD MATERNA - '+' '+reportData.config.title+'.',
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
              tabla_datos_centrar:
              {
                fontSize: 9,
                alignment:"center",
                bold: true,

              },
              tabla_datos_estados_actuales:
              {

                fontSize: 9,
                alignment:"center",
                bold:true,

              },
              tabla_datos_titulo:
              {
                fontSize: 9,
                alignment:"center"
              },
            }
        };

        let tabla_vacia = {

          table: {
            headerRows:1,
            dontBreakRows: true,
            keepWithHeaderRows: 1,
            widths: [30, 70, 80, 80, 70, 40, 50, 50, 60 , 55, 45, 55, 60, 60, 60 ],
            margin: [0,0,0,0],
            body: [
              //[{text: "["+empleado.clues+"] "+empleado.clues_descripcion, colSpan: 12, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{}],
              [
                {text: "N°", style: 'cabecera'},
                {text: "UNIDAD MEDICA", style: 'cabecera'},
                {text: "CURP", style: 'cabecera'},
                {text: "NOMBRE", style: 'cabecera'},
                {text: "TELÉFONO DE CONTACTO", style: 'cabecera'},
                {text: "EDAD", style: 'cabecera'},
                {text: "FECHA DE INGRESO", style: 'cabecera'},
                {text: "ESTADO ACTUAL", style: 'cabecera'},
                {text: "S. GESTACIONALES", style: 'cabecera'},
                {text: "EMBARAZADA", style: 'cabecera'},
                {text: "REFERIDA", style: 'cabecera'},
                {text: "EXTRANJERO", style: 'cabecera'},
                {text: "MUNICIPIO", style: 'cabecera'},
                {text: "LOCALIDAD", style: 'cabecera'}
                //{text: "AFILIACIÓN", style: 'cabecera'}
              ]
            ]
          }

        };

        datos.content.push(JSON.parse(JSON.stringify(tabla_vacia)));
      
        let indice_actual;//(datos.content.length -1);

        //EDADES
        let menores_igual_19 = 0;
        let mayores_igual_20 = 0;
        let total_pacientes = 0;

        let muy_graves_embarazadas = 0;
        let muy_graves_puerperas = 0;
        let total_muy_graves = 0;

        let graves_embarazadas = 0;
        let graves_puerperas = 0;
        let total_graves = 0;

        let delicadas_embarazadas = 0;
        let delicadas_puerperas = 0;
        let total_delicadas = 0;

        let estables_embarazadas = 0;
        let estables_puerperas = 0;
        let total_estables = 0;

        let total_estados_actuales = 0;
        let total_embarazadas_estados_actuales = 0;
        let total_puerperas_estados_actuales = 0;

        let embarazadas = 0;
        let puerperas = 0;
        let pintar_estado_actual = {};
        //console.log('for(let i = 0; i < ; i++){');
        for(let i = 0; i < reportData.items.length; i++){
          //console.log("iiiii", reportData.items.length);
          let paciente = reportData.items[i];
          let fecha_ingreso     =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'numeric', day: '2-digit'}).format(new Date(paciente.fecha_ingreso));

          if(paciente.edad <= 19){
            menores_igual_19 ++;
          }

          if(paciente.edad >= 20){
            mayores_igual_20 ++;
          }

          total_pacientes = reportData.items.length;

          switch (paciente.ultimoEstadoActual) {

            case 'Muy Grave':
              pintar_estado_actual = { text: paciente.ultimoEstadoActual, style: "tabla_datos_estados_actuales", fillColor:"#FF0000", color: "black"};
              break;
            case 'Grave':
              pintar_estado_actual = { text: paciente.ultimoEstadoActual, style: "tabla_datos_estados_actuales", fillColor:"#FFA500", color: "black",};
              break;
            case 'Delicada':
              pintar_estado_actual = { text: paciente.ultimoEstadoActual, style: "tabla_datos_estados_actuales", fillColor:"#FFFF00", color: "black"};
              break;
            case 'Estable':
              pintar_estado_actual = { text: paciente.ultimoEstadoActual, style: "tabla_datos_estados_actuales", fillColor:"#32CD32", color: "black"};
              break;
            default:0
          }

              if(paciente.estaEmbarazada == 1){

                switch (paciente.ultimoEstadoActual) {

                  case 'Muy Grave':
                    muy_graves_embarazadas++;
                    break;
                  case 'Grave':
                    graves_embarazadas++;
                    break;
                  case 'Delicada':
                    delicadas_embarazadas++;
                    break;
                  case 'Estable':
                    estables_embarazadas++;
                    break;
                  default:0
                }

                embarazadas++;

              }else if(paciente.estaEmbarazada == 0){

                switch (paciente.ultimoEstadoActual) {

                  case 'Muy Grave':
                    muy_graves_puerperas++;
                    break;
                  case 'Grave':
                    graves_puerperas++;
                    break;
                  case 'Delicada':
                    delicadas_puerperas++;
                    break;
                  case 'Estable':
                    estables_puerperas++;
                    break;
                  default:0
                }

                puerperas++;

              }

              total_muy_graves      = muy_graves_embarazadas+muy_graves_puerperas;
              total_graves          = graves_embarazadas+graves_puerperas;
              total_delicadas       = delicadas_embarazadas+delicadas_puerperas;
              total_estables        = estables_embarazadas+estables_puerperas;


              total_embarazadas_estados_actuales    = muy_graves_embarazadas+graves_embarazadas+delicadas_embarazadas+estables_embarazadas;
              total_puerperas_estados_actuales      = muy_graves_puerperas+graves_puerperas+delicadas_puerperas+estables_puerperas;


              total_estados_actuales = total_muy_graves+total_graves+total_delicadas+total_estables;

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

          // if(paciente.afiliacion_id == null){

          //   paciente.afiliacion_id = "NO REGISTRADO"; 

          // }
          // else{
          //   paciente.afiliacion_id = paciente.afiliacion.nombre;
          // }

          if(paciente.municipio_id == null ){

            paciente.municipio_id = "NO REGISTRADO"; 

          }
          else{
            paciente.municipio_id = paciente.municipio.nombre;
          }

          if(paciente.localidad_id == null ){

            paciente.localidad_id = "NO REGISTRADO"; 

          }
          else{
            paciente.localidad_id = paciente.localidad.nombre;
          }

          if(paciente.telefono_contacto == null ){

            paciente.telefono_contacto = "NO FUE PROPORCIONADO"; 

          }
          else{
            paciente.telefono_contacto;
          }

          indice_actual = datos.content.length -1;

          datos.content[indice_actual].table.body.push([
            { text: i+1, style: 'tabla_datos' }, 
            { text: '('+paciente.clues.id+') - '+paciente.clues.nombre, style: 'tabla_datos' },
            { text: paciente.curp , style: 'tabla_datos'},
            { text: paciente.nombre + ' '+ paciente.paterno + ' '+ paciente.materno , style: 'tabla_datos'},
            { text: paciente.telefono_contacto , style: 'tabla_datos'},
            { text: paciente.edad +' Años', style: 'tabla_datos'},
            { text: fecha_ingreso , style: 'tabla_datos'},
            //{ text: paciente.ultimoEstadoActual , style: 'tabla_datos'},
            pintar_estado_actual,
            { text: paciente.semanas_gestacionales , style: 'tabla_datos'},
            { text: paciente.estaEmbarazada , style: 'tabla_datos'},
            { text: paciente.fueReferida , style: 'tabla_datos'},
            { text: paciente.esExtranjero , style: 'tabla_datos'},
            { text: paciente.municipio_id , style: 'tabla_datos'},
            { text: paciente.localidad_id , style: 'tabla_datos'}
            //{ text: paciente.afiliacion_id , style: 'tabla_datos'}
          ]);
          
          pintar_estado_actual = {};
        }

        datos.content.push({ text:'', pageBreak:'after' });


        datos.content.push({
          
          margin: [350,100,0,0],
          table: {
           widths: [ 160, 50,],
            margin: [0,0,0,0],
            
            body: [
              [
                {text: "GRUPO DE EDAD", style: "tabla_datos_titulo",fillColor:"#DEDEDE", colSpan:2},{}
              ],
              [
                { text: "(≤19)", style: "tabla_datos_titulo" },
                { text: new Intl.NumberFormat('es-MX').format(menores_igual_19), style: "tabla_datos_centrar"},

              ],
              [
                { text: "(≥20)", style: "tabla_datos_titulo" },
                { text: new Intl.NumberFormat('es-MX').format(mayores_igual_20), style: "tabla_datos_centrar"},


              ],
              [
                { text: "TOTAL", style: "tabla_datos_titulo", fillColor:"#DEDEDE" },
                { text: new Intl.NumberFormat('es-MX').format(total_pacientes), style: "tabla_datos_centrar", fillColor:"#DEDEDE"},

              ]
            ]
          },
          

        });

        datos.content.push({
          
          margin: [250,10,0,0],
          table: {
           widths: [ 160, 80, 80, 100 ],
            margin: [0,0,0,0],
            
            body: [
              [
                { text: "PACIENTES EN ESTADO ACTUAL", style: "tabla_datos_estados_actuales", fillColor:"#DEDEDE", },
                { text: "EMBARAZADAS", style: "tabla_datos_titulo", fillColor:"#DEDEDE", },
                { text: "PUERPERAS", style: "tabla_datos_titulo", fillColor:"#DEDEDE", },
                { text: "TOTAL", style: "tabla_datos_titulo", fillColor:"#DEDEDE", blod: true }
              ],
              [
                { text: "MUY GRAVES", style: "tabla_datos_estados_actuales", fillColor:"#FF0000", color: "black",},
                { text: muy_graves_embarazadas, style: "tabla_datos_titulo"},
                { text: muy_graves_puerperas, style: "tabla_datos_titulo"},
                { text: total_muy_graves, style: "tabla_datos_centrar",fillColor:"#DEDEDE", }
              ],
              [
                { text: "GRAVES", style: "tabla_datos_estados_actuales", fillColor:"#FFA500", color: "black",},
                { text: graves_embarazadas, style: "tabla_datos_titulo"},
                { text: graves_puerperas, style: "tabla_datos_titulo"},
                { text: total_graves, style: "tabla_datos_centrar", fillColor:"#DEDEDE", }
              ],
              [
                { text: "DELICADAS", style: "tabla_datos_estados_actuales", fillColor:"#FFFF00", color: "black"},
                { text: delicadas_embarazadas, style: "tabla_datos_titulo"},
                { text: delicadas_puerperas, style: "tabla_datos_titulo"},
                { text: total_delicadas, style: "tabla_datos_centrar", fillColor:"#DEDEDE", }
              ],
              [
                { text: "ESTABLES", style: "tabla_datos_estados_actuales", fillColor:"#32CD32", color: "black"},
                { text: estables_embarazadas, style: "tabla_datos_titulo"},
                { text: estables_puerperas, style: "tabla_datos_titulo"},
                { text: total_estables, style: "tabla_datos_centrar", fillColor:"#DEDEDE", }
              ],
              [
                { text: "SUBTOTAL", style: "tabla_datos_estados_actuales", fillColor:"#DEDEDE"},
                { text: total_embarazadas_estados_actuales, style: "tabla_datos_centrar", fillColor:"#DEDEDE",},
                { text: total_puerperas_estados_actuales, style: "tabla_datos_centrar", fillColor:"#DEDEDE",},
                { text: total_estados_actuales, style: "tabla_datos_centrar", fillColor:"#DEDEDE", }
              ]
            ]
          }
        });

        return datos;
    }
}