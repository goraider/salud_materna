<?php

namespace App\Http\Controllers\API\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

use App\Http\Controllers\Controller;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;
use Response, Validator;
use Carbon\Carbon;

use App\Models\Sistema\Paciente;
use App\Models\Sistema\Seguimiento;
use App\Models\Sistema\Diagnostico;
use App\Models\Sistema\SeguimientoDiagnostico;

use App\Models\Catalogos\Clue;
use App\Models\Catalogos\EstadoActual;

class DashEstadosActuales extends Controller
{
    public function getDashEstadosActuales(Request $request){

        try {

            $parametros = $request->all();


            if(isset($parametros['clues']) && $parametros['clues']){


                //$pacientes = Paciente::select('estado_actual_id', 'ultimoEstadoActual', DB::raw('count(estado_actual_id) as total'))
                $pacientes = Paciente::select(DB::raw('count(estado_actual_id) as total'), "estado_actual_id")->with('estado_actual')
                ->where('clues', '=', $parametros['clues'])
                ->where('tieneAlta', '=', 0)
                // ->where('estado_actual_id', '=', $parametros['estado_actual'])
                ->orderBy('estado_actual_id')
                ->groupBy('estado_actual_id')->get();

                // $pacientes = Seguimiento::select('seguimientos.estado_actual_id', DB::raw('count(seguimientos.estado_actual_id) as total'))->with('estado_actual')
                // ->join('pacientes as P', 'P.id', '=', 'seguimientos.paciente_id')
                // ->join('estados_actuales', 'seguimientos.estado_actual_id', '=', 'estados_actuales.id')
                // ->where('P.tieneAlta', '=', 0)
                // ->where('P.clues', '=', $parametros['clues'])
                // ->groupBy('seguimientos.estado_actual_id')->get();

                return response()->json([ 'data' => $pacientes ],HttpResponse::HTTP_OK);


            }else{

                $pacientes = Paciente::select(DB::raw('count(estado_actual_id) as total'), "estado_actual_id")->with('estado_actual')
                ->where('tieneAlta', '=', 0)
                // ->where('estado_actual_id', '=', $parametros['estado_actual'])
                ->orderBy('estado_actual_id')
                ->groupBy('estado_actual_id')->get();

                // $pacientes = Seguimiento::select('seguimientos.estado_actual_id', DB::raw('count(seguimientos.estado_actual_id) as total'))->with('estado_actual')
                //             ->join('pacientes as P', 'P.id', '=', 'seguimientos.paciente_id')
                //             ->join('estados_actuales', 'seguimientos.estado_actual_id', '=', 'estados_actuales.id')
                //             ->where('P.tieneAlta', '=', 0)
                //             ->groupBy('seguimientos.estado_actual_id')->get();

                return response()->json([ 'data' => $pacientes ],HttpResponse::HTTP_OK);
            }
            //code...
            
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function getDashEstadosActualesPacientes(Request $request){

        try {

            $parametros = $request->all();


            if(isset($parametros['estado_actual']) && $parametros['estado_actual']){

                $pacientes = Paciente::select('pacientes.*')
                        ->where('clues', '=', $parametros['clues'])
                        ->where('tieneAlta', '=', 0)
                        ->where('estado_actual_id', '=', $parametros['estado_actual'])
                        ->orderBy('fecha_ingreso', 'DESC')
                        ->get();


                return response()->json([ 'pacientes' => $pacientes ],HttpResponse::HTTP_OK);

                // $pacientes = Paciente::select('pacientes.*')
                // ->with(['seguimientos.diagnosticos', 'seguimientos'=>function($query) use($parametros) {
                //     $query = $query->where('estado_actual_id', $parametros['estado_actual']);
                // }, 'clues', 'municipio', 'localidad', 'metodo_gestacional', 'afiliacion', 'alta'])
                // ->where('clues', $parametros['clues'])->get();

            }

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

    public function getDashControlEmbarazo(Request $request){

    
        try {

            $parametros = $request->all();



            if(isset($parametros['cluesControl']) && $parametros['cluesControl']){

                $pacientes = Paciente::select('pacientes.*')
                        ->where('cluesControl', '=', $parametros['cluesControl'])
                        ->where('tieneAlta', '=', 0)
                        ->where('semanasControl', '=', $parametros['semanasControl'])
                        ->orderBy('fecha_ingreso', 'DESC')
                        ->get();


                return response()->json([ 'pacientes' => $pacientes ],HttpResponse::HTTP_OK);

                // $pacientes = Paciente::select('pacientes.*')
                // ->with(['seguimientos.diagnosticos', 'seguimientos'=>function($query) use($parametros) {
                //     $query = $query->where('estado_actual_id', $parametros['estado_actual']);
                // }, 'clues', 'municipio', 'localidad', 'metodo_gestacional', 'afiliacion', 'alta'])
                // ->where('clues', $parametros['clues'])->get();

            }else{

                $pacientes = Paciente::select('pacientes.*')
                    ->where('tieneAlta', '=', 0)
                    ->where('semanasControl', '=', $parametros['semanasControl'])
                    ->orderBy('fecha_ingreso', 'DESC')
                    ->get();

                return response()->json([ 'data' => $pacientes ],HttpResponse::HTTP_OK);
            }

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }


    }
}
