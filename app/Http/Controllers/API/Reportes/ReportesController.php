<?php

namespace App\Http\Controllers\API\Reportes;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Response as HttpResponse;

use App\Models\Catalogos\Clue;
use App\Models\Catalogos\Jurisdiccion;
use App\Models\Sistema\Paciente;
use App\Models\Sistema\Diagnostico;
use App\Models\Catalogos\EstadoActual;

use App\Models\Catalogos\CondicionEgreso;
use App\Models\Catalogos\MotivoEgreso;
use App\Models\Catalogos\MetodoAnticonceptivo;


class ReportesController extends Controller
{

    public function reporteMonitoreo(Request $request)
    {
        try{

            $parametros = $request->all();

            $pacientes = Paciente::select('pacientes.*')
                         ->with('ultimoSeguimiento.diagnosticos', 'primerSeguimiento.diagnosticos', 'clues.distrito', 'municipio', 'localidad', 'metodo_gestacional', 'alta');

            // $pacientes = $pacientes->leftJoin('clues as CLUE', 'CLUE.id', '=', 'pacientes.clues')
            //             ->where('CLUE.id', 'CSSSA019954')->get();

            //$pacientes = Jurisdiccion::select('jurisdicciones.*')->with('clues.pacientes');




            // $pacientes = Paciente::select('pacientes.*')
            // ->with(['clues.distrito', 'clues'=>function($query) use($parametros) {
            //     $query = $query->where('clues', $parametros['clues']);
            // }, 'municipio', 'localidad', 'metodo_gestacional', 'afiliacion', 'alta'])
            // ->get();

            if(isset($parametros['query']) && $parametros['query']){
                $pacientes = $pacientes->where(function($query)use($parametros){
                    return $query->where('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('materno','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){

                if(isset($parametros['distrito_id']) && $parametros['distrito_id']){

                    $pacientes = $pacientes->leftJoin('clues as CLUE', 'CLUE.id', '=', 'pacientes.clues')
                                           ->leftJoin('jurisdicciones as DIST', 'DIST.id', '=', 'CLUE.jurisdicciones_id')
                                           ->where('DIST.id', $parametros['distrito_id'])
                                           ->orderBy('fecha_ingreso', 'DESC');

                }

                if(isset($parametros['clues_id']) && $parametros['clues_id']){

                    $pacientes = $pacientes->where('clues',$parametros['clues_id']);

                }

                if(isset($parametros['estados_actuales']) && $parametros['estados_actuales']){
                    
                    $pacientes = $pacientes->where('estado_actual_id',$parametros['estados_actuales']);
                
                }
                if(isset($parametros['altas'])){

                    $pacientes = $pacientes->where('tieneAlta',$parametros['altas']);

                }
                if(isset($parametros['fecha_inicio'], $parametros['fecha_fin'])){

                    $pacientes = $pacientes->whereBetween('fecha_ingreso', [$parametros['fecha_inicio'], $parametros['fecha_fin']]);

                }

            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $pacientes = $pacientes->paginate($resultadosPorPagina);
            } else {
                $pacientes = $pacientes->get();
            }


            return response()->json(['data'=>$pacientes],HttpResponse::HTTP_OK);

        }catch(\Throwable $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
        
    }

    public function filtrosMonitoreo(){
        try{

            $catalogo_distritos         = Jurisdiccion::orderBy('id');
            $catalogo_clues             = Clue::orderBy('nombre');
            //$catalogo_diagnosticos      = Diagnostico::orderBy("nombre");
            $catalogo_estados_actuales  = EstadoActual::orderBy("nombre");



            $catalogos = [
                'clues'               => $catalogo_clues->get(),
                'diagnosticos'        => $catalogo_diagnosticos->get(),
                'estados_actuales'    => $catalogo_estados_actuales->get(),
            ];

            return response()->json(['data'=>$catalogos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }


    public function filtrosAlta(){
        try{

            $catalogo_motivos_egresos               = MotivoEgreso::orderBy('id');
            $catalogo_condiciones_egresos           = CondicionEgreso::orderBy('id');
            $catalogo_estados_actuales              = EstadoActual::orderBy('id');
            $catalogos_metodos_anticonceptivos      = MetodoAnticonceptivo::orderBy('id');



            $catalogos = [
                'motivos_egresos'               => $catalogo_motivos_egresos->get(),
                'condiciones_egresos'           => $catalogo_condiciones_egresos->get(),
                'estados_actuales'              => $catalogo_estados_actuales->get(),
                'metodos_anticonceptivos'       => $catalogos_metodos_anticonceptivos->get(),
            ];

            return response()->json(['data'=>$catalogos],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function reporteAltas(Request $request)
    {
        try{

            $parametros = $request->all();

            $pacientes = Paciente::select('pacientes.*')->with('clues.distrito', 'municipio', 'localidad', 'metodo_gestacional', 'alta')
                                                        ->join('altas as A', 'A.paciente_id', '=', 'pacientes.id');


            if(isset($parametros['query']) && $parametros['query']){
                $pacientes = $pacientes->where(function($query)use($parametros){
                    return $query->where('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('materno','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){

                if(isset($parametros['distrito_id']) && $parametros['distrito_id']){

                    $pacientes = $pacientes->leftJoin('clues as CLUE', 'CLUE.id', '=', 'pacientes.clues')
                                           ->leftJoin('jurisdicciones as DIST', 'DIST.id', '=', 'CLUE.jurisdicciones_id')
                                           ->where('DIST.id', $parametros['distrito_id'])
                                           ->orderBy('fecha_ingreso', 'DESC');

                }

                if(isset($parametros['clues_id']) && $parametros['clues_id']){

                    $pacientes = $pacientes->where('clues',$parametros['clues_id']);

                }

                if(isset($parametros['motivo_egreso_id']) && $parametros['motivo_egreso_id']){
                    
                    $pacientes = $pacientes->where('A.motivo_egreso_id', $parametros['motivo_egreso_id']);

                }

                if(isset($parametros['condicion_egreso_id']) && $parametros['condicion_egreso_id']){

                    $pacientes = $pacientes->where('A.condicion_egreso_id', $parametros['condicion_egreso_id']);

                }


                if(isset($parametros['estado_actual_id']) && $parametros['estado_actual_id']){

                    $pacientes = $pacientes->where('A.estado_actual_id', $parametros['estado_actual_id']);
                
                }

                if(isset($parametros['metodo_anticonceptivo_id']) && $parametros['metodo_anticonceptivo_id']){

                    $pacientes = $pacientes->where('A.metodo_anticonceptivo_id', $parametros['metodo_anticonceptivo_id']);
                
                }

                if(isset($parametros['fecha_inicio'], $parametros['fecha_fin'])){

                    //$pacientes = $pacientes->whereBetween('fecha_ingreso', [$parametros['fecha_inicio'], $parametros['fecha_fin']]);

                    $pacientes = $pacientes->whereBetween('A.fecha_alta', [$parametros['fecha_inicio'], $parametros['fecha_fin']])
                                           ->orderBy('A.fecha_alta', 'DESC');


                }

            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $pacientes = $pacientes->paginate($resultadosPorPagina);
            } else {
                $pacientes = $pacientes->get();
            }


            return response()->json(['data'=>$pacientes],HttpResponse::HTTP_OK);

        }catch(\Throwable $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
        
    }
    

}
