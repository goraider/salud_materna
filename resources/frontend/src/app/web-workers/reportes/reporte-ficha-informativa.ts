import { LOGOS } from "../../logos";
export class ReporteFichaInformativa{
    
    getDocumentDefinition(reportData:any) {
        
        console.log(reportData.items);
        //return reportData;
        let contadorLineasHorizontalesV = 0;
        let fecha_hoy =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date());
        console.log(LOGOS);


        let datos = {
          pageOrientation: 'portrait',
          pageSize: 'LETTER',
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
                    // text: reportData.config.title,
                    text: 'SECRETARÍA DE SALUD\n'+'COORDINACIÓN DE LA ESTRATEGIA PARA LA CONTENCIÓN DE LA MORTALIDAD MATERNA - '+reportData.config.title+'.',
                    bold: true,
                    fontSize: 10,
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
                    text:fecha_hoy.toString(),
                    alignment:'right',
                    fontSize: 8,
                }
              ]
            }
          },
          content: [
            ],
            styles: {
              cabecera: {
                fontSize: 7,
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
                fontSize: 7,
                alignment:"center"
              },
              tabla_datos_titulo:
              {
                fontSize: 7,
                alignment:"center"
              },
              tabla_datos_centrar:
              {
                fontSize: 7,
                alignment:"center",
                bold: true,
                color:"red",
              },
              tabla_datos_respuesta:
              {
                fontSize: 7,
                bold: true,
                color:"red",
              },
              campos_izquierda:
              {
                fontSize: 7,
                alignment:"left"
              },
              datos_personales_izquierda:
              {
                fontSize: 7,
                bold: true,
                color:"red",
                
              },
              tabla_datos_personales:
              {
                fontSize: 7,
                alignment:'left'
              },
              datos_contacto:
              {
                fontSize: 10,
                bold: true,
                alignment:"center"
              },
            }
        };
        let esta_embarazada;
        let paciente = reportData.items;

        esta_embarazada = parseInt(paciente.estaEmbarazada);
        

        let fecha_ingreso     =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(paciente.fecha_ingreso));
        let fecha_nacimiento  =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date(paciente.fecha_nacimiento));


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


        datos.content.push({
          layout: 'noBorders',
          table: {
           widths: ['*'],
            margin: [0,0,0,0],
            body: [
              [
                { text: " \n\n", style: "tabla_datos"}
              ]
            ]
          }
        });

        datos.content.push({
          layout: 'noBorders',
          table: {
           widths: [50,'*', 10],
            margin: [0,0,0,0],
            body: [
              [
                { text: "Unidad Medica: ", style: "tabla_datos" },
                {text: '( '+paciente.clues.id+' ) - '+paciente.clues.nombre, style: "tabla_datos_respuesta"},
                { text: " \n\n", style: "tabla_datos"}
              ]
            ]
          }
        });
              
        datos.content.push({
          layout: 'noBorders',
          table: {
           widths: [50, 120, 20, 45, 60, 100, 50, 50, 20],
            margin: [0,0,0,0,0],
            body: [
              [

                {text: "Nombre: ", style: "tabla_datos_personales",},
                {text: paciente.nombre+" "+paciente.paterno+" "+paciente.materno, style: "datos_personales_izquierda"},

                {text: "Edad: ", style: "tabla_datos_personales"},
                {text:paciente.edad + ' años', style: "datos_personales_izquierda"},
                // {text: "Sexo: ", style: "tabla_datos"},
                // {text: (datos_triage.sexo == 1 ? "M" : "F"), style: "tabla_datos_respuesta"},
                {text: "Fecha de Ingreso: ", style: "tabla_datos_personales"},
                {text: fecha_ingreso, style: "datos_personales_izquierda"},
                
                {text: "Hora de Ingreso: ", style: "tabla_datos_personales"},
                {text:paciente.hora_ingreso+' Hrs.', style: "datos_personales_izquierda"},

                // {text: "Fecha Ingreso: ", style: "tabla_datos"},
                // {text:datos_triage.datos_valoracion.created_at.substr(0, 10), style: "tabla_datos_respuesta"},
                // {text: "Hora: ", style: "tabla_datos"},
                // {text: datos_triage.datos_valoracion.created_at.substr(11, 5), style: "tabla_datos_respuesta"}
              ],
              [
                {text: "Folio: ", style: "tabla_datos_personales"},
                {text: paciente.folio_paciente, style: "datos_personales_izquierda", colSpan:2},{},

                {text: "CURP: ", style: "tabla_datos_personales"},
                {text:paciente.curp, style: "datos_personales_izquierda", colSpan:2},{},

                {text: "Fecha de nacimiento: ", style: "tabla_datos_personales"},
                {text:fecha_nacimiento, style: "datos_personales_izquierda", colSpan:2},{},

                //{text: datos_triage.calle+" "+datos_triage.colonia+" "+(datos_triage.no_exterior != null ? "No."+datos_triage.no_exterior : "S/N")+" "+(datos_triage.no_interior != null ?  'Int. '+datos_triage.no_interior : ""), colSpan:6, style: "tabla_datos_respuesta"  },{},{},{},{},{}
              ],
              [
                {text: "Municipio:", style: "tabla_datos_personales"},
                {text: paciente.municipio_id, style: "datos_personales_izquierda",colSpan:1},{},

                {text: "Localidad: ", style: "tabla_datos_personales"},
                {text: paciente.localidad_id, style: "datos_personales_izquierda",colSpan:1},{},

                {text: "Teléfono de Contacto: ", style: "tabla_datos_personales"},
                {text: paciente.telefono_contacto, style: "datos_personales_izquierda", colSpan:2},{},
              ],
              [
                {text: "Estado Actual:", style: "tabla_datos_personales"},
                {text: paciente.ultimoEstadoActual, style: "datos_personales_izquierda", colSpan:2},{},

                {text: "Referencia: ", style: "tabla_datos_personales"},
                {text: (paciente.clues_referencia != null ? "SI, "+paciente.clues_referencia : "NO"), style: "datos_personales_izquierda", colSpan:2},{},

                {text: "Semanas Gestacionales: ", style: "tabla_datos_personales"},
                {text: paciente.semanas_gestacionales, style: "datos_personales_izquierda", colSpan:2},{},

              ],


              // [
              //   {text: "Diagnostico: ", style: "tabla_datos"},
              //   {text: datos_triage.datos_valoracion.diagnostico, style: "tabla_datos_respuesta", colSpan:9},{},{},{},{},{},{},{},{},
              //   {text: "Subsecuente: ", style: "tabla_datos"},
              //   {text: (datos_triage.datos_valoracion.subsecuente == 1 ? "SI" : "NO"), style: "tabla_datos_respuesta"}
              // ],
              // [
              //   {text:''},{},{},{},{},{},{},{},{},{},{},{}
              // ],
              // [
              //   {text: "Fecha de Inicio del Padecimiento: ", style: "tabla_datos", colSpan: 3},{},{},
              //   {text: datos_triage.datos_valoracion.fecha_inicio_padecimiento, style: "tabla_datos_respuesta"},
              //   {text:"¿Tiene Menos de 7 Días? ", style: "tabla_datos", colSpan: 4},{},{},{},
              //   {text: (datos_triage.datos_valoracion.menosSieteDias == 1 ? "SI" : "NO"), style: "tabla_datos_respuesta", colSpan: 4},{},{},{}
              // ],
              // [
              //   {text: "Marque con un X la presencia o no de los siguientes síntomas", style: "tabla_datos", colSpan:12},{},{},{},{},{},{},{},{},{},{},{}
              // ]
            ]
          }
        });

        datos.content.push({
          layout: 'noBorders',
          table: {
           widths: [150,330 ],
            margin: [0,0,0,0],
            body: [
              [
                { text: "Historial Obstetrico de la Paciente: ", style: "tabla_datos" },
                { text: " \n\n", style: "tabla_datos"}

              ]
            ]
          }
        });

        datos.content.push({
          
          margin: [70,0,0,0],
          table: {
           widths: [ 160, 50, 50, 100 ],
            margin: [0,0,0,0],
            
            body: [
              [
                { text: "Embarazo", style: "tabla_datos" },
                { text: "Si", style: "tabla_datos_titulo" },
                { text: "No", style: "tabla_datos_titulo" },
                { text: "¿Cuantos (as)?", style: "tabla_datos_titulo" }
              ],
              [
                { text: "¿Esta embarazada?", style: "tabla_datos"},
                { text: (esta_embarazada == 1 ? "X" : ""), style: "tabla_datos_centrar"},
                { text: (esta_embarazada == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                { text: "N/A", style: "tabla_datos_titulo" }
              ],
              [
                { text: "Gestas", style: "tabla_datos"},
                { text: (paciente.gestas != 0 ? "X" : ""), style: "tabla_datos_centrar"},
                { text: (paciente.gestas == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                { text: paciente.gestas, style: "tabla_datos_titulo" }
              ],
              [
                { text: "Abortos", style: "tabla_datos"},
                { text: (paciente.abortos != 0 ? "X" : ""), style: "tabla_datos_centrar"},
                { text: (paciente.abortos == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                { text: paciente.abortos, style: "tabla_datos_titulo" }
              ],
              [
                { text: "Partos", style: "tabla_datos"},
                { text: (paciente.partos != 0 ? "X" : ""), style: "tabla_datos_centrar"},
                { text: (paciente.partos == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                { text: paciente.partos, style: "tabla_datos_titulo" }
              ],
              [
                { text: "Cesareas", style: "tabla_datos"},
                { text: (paciente.cesareas != 0 ? "X" : ""), style: "tabla_datos_centrar"},
                { text: (paciente.cesareas == 0 ? "X" : ""), style: "tabla_datos_centrar"},
                { text: paciente.cesareas, style: "tabla_datos_titulo" }
              ]
            ]
          }
        });

        datos.content.push({
          layout: 'noBorders',
          table: {
           widths: [150,330 ],
            margin: [0,0,0,0],
            body: [
              [
                { text: "\n", style: "tabla_datos"}

              ]
            ]
          }
        });

        datos.content.push({
          layout: 'noBorders',
          table: {
           widths: [150,330 ],
            margin: [0,0,0,0],
            body: [
              [
                { text: "Seguimientos y/o Atenciones Hospitalarias: ", style: "tabla_datos" },
                { text: " \n\n", style: "tabla_datos"}

              ]
            ]
          }
        });


      
      if(paciente.seguimientos.length > 0){

        let clues = '';
        let indice_actual;
        let diagnosticos_seguimiento = "";

        for(let i = 0; i < paciente.seguimientos.length; i++){

          let seguimiento = paciente.seguimientos[i];

          if(seguimiento.estado_actual_id == null){
            seguimiento.estado_actual_id = "N/A"; 
          }
          else{
            seguimiento.estado_actual_id = seguimiento.estado_actual.nombre;
          }

          if(seguimiento.servicio_id == null){
            seguimiento.servicio_id = "NO SE REGISTRÓ"; 
          }
          else{
            seguimiento.servicio_id = seguimiento.servicio.nombre;
          }

          if(seguimiento.factor_covid_id == null){
            seguimiento.factor_covid_id = "NO SE REGISTRÓ"; 
          }
          else{
            seguimiento.factor_covid_id = seguimiento.factor_covid.nombre;
          }

            
          if(seguimiento.diagnosticos.length == 0){

              diagnosticos_seguimiento = "NO SE REGISTRÓ NINGÚN DIAGNOSTICO";

          }else{
              for (let indice in seguimiento.diagnosticos){

                let index = parseInt(indice)+1;

                if (diagnosticos_seguimiento!=="")
                diagnosticos_seguimiento += ".\n";
                diagnosticos_seguimiento += `${index}: ${seguimiento.diagnosticos[indice].nombre}`;

              }
          }
          

          if(clues != paciente.clues){
            clues = paciente.clues;

            datos.content.push({
              //layout: 'lightHorizontalLines',
              table: {
                headerRows: 1,
                dontBreakRows: true,
                keepWithHeaderRows: 1,
                widths: [ 15, 80, 80, 100, 100, 100],
                margin: [0,0,0,0],
                body: [
                  //[{text: "["+empleado.clues+"] "+empleado.clues_descripcion, colSpan: 12, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{}],
                  [
                    {text: "N°", style: 'cabecera'},
                    {text: "ESTADO ACTUAL", style: 'cabecera'},
                    {text: "CUADRO RESPIRATORIO (COVID-19)", style: 'cabecera'},
                    {text: "N° CAMA/SERVICIO", style: 'cabecera'},
                    {text: "DIAGNOSTICO(S)", style: 'cabecera'},
                    {text: "OBSERVACIONES", style: 'cabecera'},
                  ]
                ]
              }
            });

            indice_actual = datos.content.length -1;
          }
            datos.content[indice_actual].table.body.push([

              { text: i+1, style: 'tabla_datos' }, 
              { text: seguimiento.estado_actual_id, style: 'tabla_datos'},
              { text: seguimiento.factor_covid_id, style: 'tabla_datos'},
              { text: 'N°'+seguimiento.no_cama+' / '+seguimiento.servicio_id, style: 'campos_izquierda'},
              { text: diagnosticos_seguimiento, style: 'campos_izquierda'},
              { text: seguimiento.observaciones, style: 'campos_izquierda'},

            ]);
            diagnosticos_seguimiento = "";
        }
      }else{

        datos.content.push({
          layout: 'noBorders',
          table: {
          widths: [150,330 ],
            margin: [0,0,0,0],
            body: [
              [
                { text: "La paciente no tiene ningún registro de seguimientos y/o atenciones hospitalarias: ", style: "tabla_datos" },
                { text: " \n\n", style: "tabla_datos"}

              ]
            ]
          }
        });

      }

      datos.content.push({
        layout: 'noBorders',
        table: {
         widths: [100,330 ],
          margin: [0,0,0,0],
          body: [
            [
              { text: "\n", style: "tabla_datos"}

            ]
          ]
        }
      });

      datos.content.push({
        layout: 'noBorders',
        table: {
         widths: [100,330 ],
          margin: [0,0,0,0],
          body: [
            [
              { text: "Alta ó Egreso Hospitalario: ", style: "tabla_datos" },
              { text: " \n\n", style: "tabla_datos"}

            ]
          ]
        }
      });


      
      if(paciente.alta != null){

        let clues = '';
        let indice_actual;
        let diagnosticos_alta = "";

          let alta = paciente.alta;

          let fecha_egreso     =  new Intl.DateTimeFormat('es-ES', {year: 'numeric', month: 'long', day: '2-digit'}).format(new Date(alta.fecha_alta));

          if(alta.condicion_egreso_id == null){
            alta.condicion_egreso_id = "N/A"; 
          }
          else{
            alta.condicion_egreso_id = alta.condicion_egreso.nombre;
          }

          if(alta.estado_actual_id == null){
            alta.estado_actual_id = "N/A"; 
          }
          else{
            alta.estado_actual_id = alta.estado_actual.nombre;
          }

          if(alta.motivo_egreso_id == null){
            alta.motivo_egreso_id = "N/A"; 
          }
          else{
            alta.motivo_egreso_id = alta.motivo_egreso.nombre;
          }

          if(alta.metodo_anticonceptivo_id == null){
            alta.metodo_anticonceptivo_id = "N/A"; 
          }
          else{
            alta.metodo_anticonceptivo_id = alta.metodo_anticonceptivo.nombre;
          }

          if(alta.municipio_id == null){
            alta.municipio_id = "SIN REGISTRO"; 
          }
          else{
            alta.municipio_id = alta.municipio.nombre;
          }

          if(alta.localidad_id == null){
            alta.localidad_id = "SIN REGISTRO"; 
          }
          else{
            alta.localidad_id = alta.localidad.nombre;
          }

          if(alta.direccion_completa == null){
            alta.direccion_completa = "SIN REGISTRO"; 
          }
          else{
            alta.direccion_completa
          }

          if(alta.telefono == null){
            alta.telefono = "SIN REGISTRO"; 
          }
          else{
            alta.telefono
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
          

          if(clues != paciente.clues){
            clues = paciente.clues;

            datos.content.push({
              //layout: 'lightHorizontalLines',
              table: {
                headerRows: 1,
                dontBreakRows: true,
                keepWithHeaderRows: 1,
                widths: [ 80, 70, 80, 70 , 90, 90],
                margin: [0,0,0,0],
                body: [
                  //[{text: "["+empleado.clues+"] "+empleado.clues_descripcion, colSpan: 12, style: 'cabecera'},{},{},{},{},{},{},{},{},{},{},{}],
                  [
                    {text: "CONDICIÓN DE EGRESO", style: 'cabecera'},
                    {text: "ESTADO ACTUAL", style: 'cabecera'},
                    {text: "MOTIVO DEL EGRESO", style: 'cabecera'},
                    {text: "ANTICONCEPTIVO", style: 'cabecera'},
                    {text: "DIAGNOSTICO(S)", style: 'cabecera'},
                    {text: "OBSERVACIONES", style: 'cabecera'},
                  ]
                ]
              }
            });

            indice_actual = datos.content.length -1;
          }
            datos.content[indice_actual].table.body.push([

              { text: alta.condicion_egreso_id, style: 'tabla_datos' },
              { text: alta.estado_actual_id , style: 'tabla_datos'},
              { text: alta.motivo_egreso_id , style: 'tabla_datos'},
              { text: alta.metodo_anticonceptivo_id , style: 'tabla_datos'},
              { text: diagnosticos_alta, style: 'campos_izquierda'},
              { text: alta.observaciones, style: 'campos_izquierda'},          
              // { text: seguimiento.servicio_id , style: 'tabla_datos'},
              // { text: seguimiento.observaciones, style: 'campos_izquierda'},

            ]);
            diagnosticos_alta = "";

            datos.content.push({
              layout: 'noBorders',
              table: {
               widths: [100,330 ],
                margin: [0,0,0,0],
                body: [
                  [
                    { text: "\n", style: "tabla_datos"}
      
                  ]
                ]
              }
            });
            
            datos.content.push({
              layout: 'noBorders',
              table: {
                widths: [50, '*', '*', '*'],
                margin: [0,0,0,0],
                body: [
                  [
                    { text: "Fecha de Egreso: ", style: "tabla_datos" },
                    {text: fecha_egreso, style: "tabla_datos_respuesta"},

                    { text: "Dias de Hospitalización: ", style: "tabla_datos" },
                    {text: alta.dias_hospitalizado, style: "tabla_datos_respuesta"},
                  ],
                  [
                    { text: ""},
                    { text: ""},
                    { text: "Datos de Contacto: ", style: "datos_contacto"},
                    { text: "\n"}
                  ],
                  [
                    { text: "Dirección: ", style: "tabla_datos" },
                    {text: alta.direccion_completa, style: "tabla_datos_respuesta"},

                    { text: "Télefono: ", style: "tabla_datos" },
                    {text: alta.telefono, style: "tabla_datos_respuesta"},
                  ],
                  [
                    { text: "Municipio: ", style: "tabla_datos" },
                    {text: alta.municipio_id, style: "tabla_datos_respuesta"},

                    { text: "Localidad: ", style: "tabla_datos" },
                    {text: alta.localidad_id, style: "tabla_datos_respuesta"},
                  ],
                ]
              }
            });
      }else{

        datos.content.push({
          layout: 'noBorders',
          table: {
          widths: [150,330 ],
            margin: [0,0,0,0],
            body: [
              [
                { text: "La paciente no tiene ningún registro su alta y/o egreso hospitalario: ", style: "tabla_datos" },
                { text: " \n\n", style: "tabla_datos"}

              ]
            ]
          }
        });

      }

        // datos.content.push({
        //   layout: 'noBorders',
        //   table: {
        //    widths: [ 150,330 ],
        //     margin: [0,0,0,0],
        //     body: [
        //       [
        //         {text: "¿Tiene 2 o más de los primeros tres síntomas? ", style: "tabla_datos"},
        //         {text: (datos_triage.datos_valoracion.tieneSintomas == 1 ? "SI" : "NO"), style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         {text: "Acompañados de al menos uno de los siguientes signos o síntomas: ", style: "tabla_datos", colSpan: 2},{}
        //       ]
        //     ]
        //   }
        // });

        // datos.content.push({
        //   margin: [140,0,0,0],
        //   table: {
        //    widths: [ 120, 40, 40 ],
        //     margin: [0,0,0,0],
        //     body: [
        //       [
        //         { text: "Síntoma", style: "tabla_datos" },
        //         { text: "Si", style: "tabla_datos_titulo" },
        //         { text: "No", style: "tabla_datos_titulo" }
        //       ],
        //       [
        //         { text: "Disnea", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneDisnea == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneDisnea != 1 ? "X" : ""), style: "tabla_datos_centrar"}
        //       ],
        //       [
        //         { text: "Altralgias", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneArtralgia == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneArtralgia != 1 ? "X" : ""), style: "tabla_datos_centrar"}
        //       ],
        //       [
        //         { text: "Mialgias", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneMialgia == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneMialgia != 1 ? "X" : ""), style: "tabla_datos_centrar"}
        //       ],
        //       [
        //         { text: "Odinofagia", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneOdinofalgia == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneOdinofalgia != 1 ? "X" : ""), style: "tabla_datos_centrar"}
        //       ],
        //       [
        //         { text: "Rinorrea", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneRinorrea == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneRinorrea != 1 ? "X" : ""), style: "tabla_datos_centrar"}
        //       ],
        //       [
        //         { text: "Conjuntivitis", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneConjuntivitis == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneConjuntivitis != 1 ? "X" : ""), style: "tabla_datos_centrar"}
        //       ],
        //       [
        //         { text: "Dolor Torácico", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneDolorToracico == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneDolorToracico != 1 ? "X" : ""), style: "tabla_datos_centrar"}
        //       ],
        //       [
        //         { text: "Vomito", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneVomito == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneVomito != 1 ? "X" : ""), style: "tabla_datos_centrar"}
        //       ],
        //       [
        //         { text: "Diarrea", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneDiarrea == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneDiarrea != 1 ? "X" : ""), style: "tabla_datos_centrar"}
        //       ]
        //     ]
        //   }
        // });

        // datos.content.push({
        //   layout: 'noBorders',
        //   table: {
        //    widths: [ 40, 150, 40, 50,80,80 ],
        //     margin: [0,0,0,0],
        //     body: [
        //       [
        //         {text: "Investigue la presencia de Comorbilidades ", style: "tabla_datos", colSpan: 6},{},{},{},{},{}
        //       ]
        //     ]
        //   }
        // });

        // datos.content.push({
          
        //   table: {
        //    widths: [ 120, 40, 40, "*" ],
        //     margin: [0,0,0,0],
        //     body: [
        //       [
        //         { text: "Comorbilidad", style: "tabla_datos" },
        //         { text: "Si", style: "tabla_datos_titulo" },
        //         { text: "No", style: "tabla_datos_titulo" },
        //         { text: "Cual", style: "tabla_datos_titulo" }
        //       ],
        //       [
        //         { text: "Edad >65 o <5 años", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneEdadMayor == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneEdadMayor != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosEdad, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Diabetes Mellitus", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneDiabetesMellitus == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneDiabetesMellitus != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosDiabetes, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Hipertension Arterial", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneHipertensionArterial == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneHipertensionArterial != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosHipertension, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Obesidad", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneObesisdad == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneObesisdad != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosObesidad, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Enfermedad Cardiovascular", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneEnfermedadCardiovascular == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneEnfermedadCardiovascular != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosCardiovascular, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Neumopatia Cronica", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneNeumopatiaCronica == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneNeumopatiaCronica != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosNeumopatia, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Nefroparia Cronica", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneNefropatiaCronica == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneNefropatiaCronica != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosNefropatia, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Hepatopatia Cronica", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneHepatopatiaCronica == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneHepatopatiaCronica != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosHepatopatia, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Enfermedad Hematológica", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneEnfermedadHematologica == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneEnfermedadHematologica != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosHematologia, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Enfermedad Neurológica Cronica", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneNeorologiaCronica == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneNeorologiaCronica != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosNeorologia, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "VIH", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneVIH == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneVIH != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosVih, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Cancer", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneCancer == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneCancer != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosCancer, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Otra Inmunosupresión", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneOtraInmunosupresion == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneOtraInmunosupresion != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosInmunosupresion, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "Embarazo", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tieneEmbarazo == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tieneEmbarazo != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosEmbarazo, style: "tabla_datos_respuesta"}
        //       ],
        //       [
        //         { text: "2 Semanas de Puerperio", style: "tabla_datos"},
        //         { text: (datos_triage.datos_valoracion.tiene2SemanasPuerperio == 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: (datos_triage.datos_valoracion.tiene2SemanasPuerperio != 1 ? "X" : ""), style: "tabla_datos_centrar"},
        //         { text: datos_triage.datos_valoracion.datosPuerperio, style: "tabla_datos_respuesta"}
        //       ]
        //     ]
        //   }
        // });

        // datos.content.push({
        //   layout: 'noBorders',
        //   table: {
        //    widths: [ 10,100,30,10, 40, 10,30,40, 50,120 ],
        //     margin: [0,0,0,0],
        //     body: [
        //       [
        //         {text: "¿Tiene alguna comorbilidad? ", style: "tabla_datos", colSpan: 2},{},
        //         {text: (datos_triage.datos_valoracion.tieneMorbilidades  == 1 ? "SI" : "NO") , style: "tabla_datos_respuesta", colSpan:8},{},{},{},{},{},{},{}
        //       ],
        //       [
        //         {text: "Exploración fisica ", style: "tabla_datos", colSpan: 2},{},
        //         { text: "FC ", style: "tabla_datos"},
        //         { text: datos_triage.datos_valoracion.FC, style: "tabla_datos_respuesta"},
        //         { text: "FR: ", style: "tabla_datos"},
        //         { text: datos_triage.datos_valoracion.FR, style: "tabla_datos_respuesta"},
        //         { text: "SaO2: ", style: "tabla_datos"},
        //         { text: datos_triage.datos_valoracion.SaO2, style: "tabla_datos_respuesta"},
        //         { text: "SaO2Fi02: ", style: "tabla_datos"},
        //         { text: datos_triage.datos_valoracion.SaO2Fi02, style: "tabla_datos_respuesta"},
        //       ],
        //       [
        //         { text: "TA: ", style: "tabla_datos"},
        //         { text: datos_triage.datos_valoracion.TA, style: "tabla_datos_respuesta"},
        //         { text: "Glasgow: ", style: "tabla_datos"},
        //         { text: datos_triage.datos_valoracion.glasgow, style: "tabla_datos_respuesta"},
        //         { text: "Temp.: ", style: "tabla_datos"},
        //         { text: datos_triage.datos_valoracion.temperatura, style: "tabla_datos_respuesta"},
        //         { text: "Mal estado en general: ", style: "tabla_datos", colSpan: 2 },{},
        //         { text: datos_triage.datos_valoracion.estado_general, style: "tabla_datos_respuesta", colSpan: 2 },{}
        //       ],
        //       [
        //         {text: "¿Existe alguna alteración? ", style: "tabla_datos", colSpan: 2},{},
        //         {text: (datos_triage.datos_valoracion.tieneAlteracion  == 1 ? "SI" : "NO"), style: "tabla_datos_respuesta", colSpan: 8},{},{},{},{},{},{},{}
        //       ],
        //       [
        //         {text: "¿Acudirá para revaloración? ", style: "tabla_datos", colSpan: 2},{},
        //         {text: (datos_triage.datos_valoracion.revaloracion  == 1 ? "SI" : "NO"), style: "tabla_datos_respuesta", colSpan: 8},{},{},{},{},{},{},{}
        //       ],
        //       [
        //         {text: "Si cumple con la definición operacional (pregunta 1 y 2 positivas) de caso SOSPECHOSO (hacer estudio de caso, muestrear al 10% ambulatorios con síntomas leves y al 100% con síntomas graves"+
        //                 "de dificultad respiratoria y hospitalizados); o en un caso CONFIRMADO con COVID19, tiene la comorbilidad y tiene 2 o más factores de riesgo en la exploración física, el paciente pasa al"+
        //                 "consultorio siguiendo el algoritmo.\n\n", style: "tabla_datos", colSpan: 10},{},{},{},{},{},{},{},{},{}
        //       ]
        //     ]
        //   }
        // });

        // datos.content.push({
        //   layout: 'noBorders',
        //   table: {
        //    widths: [ 240,60,120,60],
        //     margin: [0,0,0,0],
        //     body: [
        //       [
        //         {text: "Nombre, Firma y cédula del metodo Triage:", style: "tabla_datos"},
        //         {text: "\n\n\n__________________________________________________________________", colSpan: 3, style:'tabla_datos_titulo'},{},{}
        //       ],
        //       [
        //         {text: "", style: "tabla_datos"},
        //         {text:  datos_triage.datos_valoracion.usuario.name+"\nNo. Cedula: "+datos_triage.datos_valoracion.usuario.cedula, colSpan: 3, style: "tabla_datos_titulo"},{},{}
        //       ]
        //     ]
        //   }
        // });
        
        return datos;
      }
}