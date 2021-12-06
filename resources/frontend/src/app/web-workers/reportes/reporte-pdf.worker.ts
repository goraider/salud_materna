/// <reference lib="webworker" />
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ReportePacientes } from './reporte-pacientes';
import { ReporteMonitoreo } from './reporte-monitoreo';
import { ReporteFichaInformativa } from './reporte-ficha-informativa';
import { ReporteAltas } from './reporte-altas';

///import { ReportePersonalActivoArea } from './reporte-personal-activo-area';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const reportes = {
  '/pacientes'              : new ReportePacientes(),
  '/monitoreo'              : new ReporteMonitoreo(),
  '/ficha-informativa'      : new ReporteFichaInformativa(),
  '/altas'                  : new ReporteAltas()
  //'empleados/personal-activo-area': new ReportePersonalActivoArea()
};

addEventListener('message', ({ data }) => {
  console.log("plop", data.data);

  const documentDefinition = reportes[data.reporte].getDocumentDefinition(data.data);

  let pdfReporte = pdfMake.createPdf(documentDefinition);

  pdfReporte.getBase64(function(encodedString) {
      let base64data = encodedString;
      //console.log(base64data);
      var bytes = atob( base64data ), len = bytes.length;
      var buffer = new ArrayBuffer( len ), view = new Uint8Array( buffer );
      for ( var i=0 ; i < len ; i++ )
        view[i] = bytes.charCodeAt(i) & 0xff;
      let file = new Blob( [ buffer ], { type: 'application/pdf' } );
      postMessage(file);
  });
});