<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

//use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Hash;

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

use App\Models\Catalogos\Municipio;
use App\Models\Catalogos\Localidad;





class PacientesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        try{

            $loggedUser = auth()->userOrFail();

            $permiso = DB::table('permissions')
                ->leftJoin('permission_user', 'permissions.id', '=', 'permission_user.permission_id')
                ->where('permission_user.user_id', '=', $loggedUser->id)
                ->where('permission_user.permission_id', '=', 'P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0')
                ->first();
    
                //P5gCJH25AeIwy2IOmvCYtHKg5XL3hKd0
    
            $userClues = DB::table('clue_user')
            ->where('user_id', $loggedUser->id)->first();

            

            if($permiso){

                $pacientes = Paciente::select('pacientes.*')
                ->with('seguimientos.diagnosticos', 'clues', 'municipio', 'localidad', 'metodo_gestacional', 'alta')->orderBy('fecha_ingreso', 'DESC');

            }else{

                $pacientes = Paciente::select('pacientes.*')
                ->with('seguimientos.diagnosticos', 'clues', 'municipio', 'localidad', 'metodo_gestacional', 'alta')->orderBy('fecha_ingreso', 'DESC');

                $pacientes->where('clues', '=', $userClues->clue_id);
            }


            //$parametros = Input::all();
            $parametros = $request->all();

            //$pacientes->where('clues', '=', $userClues->clue_id);
            //$pacientes = Paciente::select('pacientes.*','seguimientos', 'municipio', 'localidad', 'metodo_gestacional', 'afiliacion')

            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $pacientes = $pacientes->where(function($query)use($parametros){
                    return $query->where('folio_paciente','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('clues','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('paterno','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('materno','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['active_filter']) && $parametros['active_filter']){

                // if(isset($parametros['fecha_ingreso']) && $parametros['fecha_ingreso']){

                //     $f = Carbon::createFromDate( $parametros['fecha_ingreso'] )->format('Y-m-d');
                //     $pacientes = $pacientes->where('fecha_ingreso',$f);

                // }

                if(isset($parametros['fecha_inicio'], $parametros['fecha_fin'])){

                    $pacientes = $pacientes->whereBetween('fecha_ingreso', [$parametros['fecha_inicio'], $parametros['fecha_fin']]);

                }

                if(isset($parametros['altas'])){

                    $pacientes = $pacientes->where('tieneAlta',$parametros['altas']);

                }

                if(isset($parametros['nombre']) && $parametros['nombre']){

                    $pacientes = $pacientes->where('nombre',$parametros['nombre'])
                                           ->orWhere('paterno',$parametros['nombre'])
                                           ->orWhere('materno',$parametros['nombre']);
                }

                if(isset($parametros['clues']) && $parametros['clues']){

                    $pacientes = $pacientes->where('clues',$parametros['clues']);

                    //POR SI SE QUIERE BUSCAR EL FRANGMENTO DE UNA CADENA O STRING
                    // $pacientes = $pacientes->where(DB::raw('SUBSTRING(pacientes.folio_paciente, 1, 11)'), '=' , $parametros['clues']);
                }

                if(isset($parametros['estados_actuales']) && $parametros['estados_actuales']){

                    //$pacientes = $pacientes->join( DB::raw("(SELECT MAX('seguimientos.id') FROM seguimientos WHERE seguimientos.paciente_id = pacientes.id )"), 'seguimientos.paciente_id', '=', 'pacientes.id')
                                           //->select('nombre',DB::raw('max(S.id) from seguimientos'))
                                           //->where(DB::raw("(select max(`S.id`) from seguimientos)") )
                                           //->where('seguimientos.estado_actual_id', $parametros['estados_actuales']);

                    // $pacientes = $pacientes->join('seguimientos as SEAP', 'SEAP.paciente_id', '=', 'pacientes.id')
                    //                        ->where('SEAP.estado_actual_id', $parametros['estados_actuales'])->distinct();

                    $pacientes = $pacientes->where('estado_actual_id',$parametros['estados_actuales']);


                }

                if(isset($parametros['diagnosticos']) && $parametros['diagnosticos']){

                    $pacientes = $pacientes->join('seguimientos as SDP', 'SDP.paciente_id', '=', 'pacientes.id')
                                           ->join('seguimiento_diagnostico as SD', 'SD.seguimiento_id', '=', 'SDP.id')
                                           ->join('diagnosticos as D', 'SD.diagnostico_id', '=', 'D.id')
                                           ->where('SD.diagnostico_id', $parametros['diagnosticos'])->distinct();
                }
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
    
                $pacientes = $pacientes->paginate($resultadosPorPagina);
            } else {
                $pacientes = $pacientes->get();
            }

            return response()->json(['data'=>$pacientes],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {

        //$data = Input::json()->all();
        $data = $request->json()->all();
        $data = (object) $data;
        

        try {

            if(property_exists($data, "pacientes")){
                $pacientes = array_filter($data->pacientes, function($v){return $v !== null;});
                foreach ($pacientes as $key => $value) {
                    //validar que el valor no sea null
                    if($value != null){
                        //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
                        if(is_array($value))
                            $value = (object) $value;

                            $paciente = new Paciente();

                            $paciente->folio_paciente           = $value->folio_paciente;
                            $paciente->clues                    = $value->clues;
                            $paciente->nombre                   = $value->nombre;
                            $paciente->paterno                  = $value->paterno;
                            $paciente->materno                  = $value->materno;
                            $paciente->edad                     = $value->edad;
                            $paciente->fecha_nacimiento         = Carbon::createFromDate($value->fecha_nacimiento)->format('Y-m-d');
                            $paciente->fecha_ingreso            = Carbon::createFromDate($value->fecha_ingreso)->format('Y-m-d');
                            $paciente->hora_ingreso             = $value->hora_ingreso;
                            $paciente->telefono_contacto        = $value->telefono_contacto;
                            $paciente->semanasControl           = Carbon::createFromDate($value->semanasControl)->format('Y-m-d');
                            $paciente->cluesControl             = $value->cluesControl;
                            $paciente->curp                     = $value->curp;
                            $paciente->fecha_puerperio          = $value->fecha_puerperio;
                            $paciente->clues_puerperio          = $value->clues_puerperio;
                            $paciente->esPuerpera               = $value->esPuerpera;
                            $paciente->gestas                   = $value->gestas;
                            $paciente->partos                   = $value->partos;
                            $paciente->cesareas                 = $value->cesareas;
                            $paciente->abortos                  = $value->abortos;
                            $paciente->semanas_gestacionales    = $value->semanas_gestacionales;
                            $paciente->estaEmbarazada           = $value->estaEmbarazada;
                            $paciente->fueReferida              = $value->fueReferida;
                            $paciente->tieneAlta                = $value->tieneAlta;
                            $paciente->esExtranjero             = property_exists($value, "esExtranjero") ? $value->esExtranjero:null;
                            $paciente->paisOrigen               = property_exists($value, "paisOrigen") ? $value->paisOrigen:null;
                            $paciente->ultimoEstadoActual       = $value->ultimoEstadoActual;
                            $paciente->estado_actual_id         = $value->estado_actual_id;
                            $paciente->user_id                  = $value->user_id;
                            $paciente->municipio_id             = $value->municipio_id;
                            $paciente->localidad_id             = $value->localidad_id;
                            $paciente->afiliacion_id            = $value->afiliacion_id;
                            $paciente->metodo_gestacional_id    = $value->metodo_gestacional_id;
                            $paciente->clues_referencia         = $value->clues_referencia;

                            $paciente->save();
                    }
                }
                return Response::json(array("status" => 200, "messages" => "Se agrego la información del paciente con exito", "data" => $data), 200);
            }
            else{
                return Response::json(array("error" => 404, "messages" => "No se registro el paciente"), 404);
            }
        }
        catch (\Exception $e) {
            return Response::json($e->getMessage(), 500);
        }

        
        // try {
        //     if(property_exists($data, "pacientes")){
                
        //         $pacientes = array_filter($data->pacientes, function($v){return $v !== null;});
        //         //dd($pacientes);
        //         foreach ($pacientes as $key => $value) {
                    
        //             //validar que el valor no sea null
        //             if($value != null){
        //                 //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
        //                 if(is_array($value))

        //                     $value = (object) $value;
                                                
        //                     $paciente = new Paciente();
                        
        //                     $paciente->folio_paciente           = $value->folio_paciente;
        //                     $paciente->nombre                   = $value->nombre;
        //                     $paciente->paterno                  = $value->paterno;
        //                     $paciente->materno                  = $value->materno;
        //                     $paciente->edad                     = $value->edad;
        //                     $paciente->fecha_nacimiento         = $value->fecha_nacimiento;
        //                     $paciente->fecha_ingreso            = $value->fecha_ingreso;
        //                     $paciente->hora_ingreso             = $value->hora_ingreso;
        //                     $paciente->curp                     = $value->curp;
        //                     $paciente->gestas                   = $value->gestas;
        //                     $paciente->partos                   = $value->partos;
        //                     $paciente->cesareas                 = $value->cesareas;
        //                     $paciente->abortos                  = $value->abortos;
        //                     $paciente->semanas_gestacionales    = $value->semanas_gestacionales;
        //                     $paciente->estaEmbarazada           = $value->estaEmbarazada;
        //                     $paciente->fueReferida              = $value->fueReferida;
        //                     $paciente->tieneAlta                = $value->tieneAlta;
        //                     $paciente->user_id                  = $value->user_id;
        //                     $paciente->municipio_id             = $value->municipio_id;
        //                     $paciente->localidad_id             = $value->localidad_id;
        //                     $paciente->afiliacion_id            = $value->afiliacion_id;
        //                     $paciente->metodo_gestacional_id    = $value->metodo_gestacional_id;
        //                     $paciente->clues_referencia         = $value->clues_referencia;
                    

        //                 if($paciente->save()){
        //                     if(property_exists($value, "seguimientos")){
        //                         $seguimientos = array_filter($value->seguimientos, function($v){return $v !== null;});
        //                         foreach ($seguimientos as $key => $v) {
        //                             //validar que el valor no sea null
        //                             if($v != null){
        //                                 //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
        //                                 if(is_array($v))
        //                                     $v = (object) $v;
                
        //                                     $seguimiento = new Seguimiento();
        //                                     $seguimiento->folio_seguimiento     = $v->folio_seguimiento;
        //                                     $seguimiento->observaciones         = $v->observaciones;
        //                                     $seguimiento->codigoMater           = $v->codigoMater;
        //                                     $seguimiento->no_cama               = $v->no_cama; 
        //                                     $seguimiento->paciente_id           = $paciente->id;
        //                                     $seguimiento->servicio_id           = $v->servicio_id;
        //                                     $seguimiento->estado_actual_id      = $v->estado_actual_id;

        //                                     if($seguimiento->save()){
        //                                         if(property_exists($v, "diagnosticos")){
        //                                             $diagnosticos = array_filter($v->diagnosticos, function($v){return $v !== null;});
        //                                             foreach ($diagnosticos as $key => $d) {
        //                                                 //validar que el valor no sea null
        //                                                 if($d != null){
        //                                                     //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
        //                                                     if(is_array($d))
        //                                                         $d = (object) $d;
                                    
        //                                                         $diagnosticos = new SeguimientoDiagnostico();

        //                                                         $diagnosticos->folio_seguimiento_diagnostico         = $d->folio_seguimiento_diagnostico;
        //                                                         $diagnosticos->seguimiento_id                        = $seguimiento->id;
        //                                                         $diagnosticos->diagnostico_id                        = $d->diagnostico_id;

        //                                                         $diagnosticos->save();
        //                                                 }
        //                                             }
        //                                         }
                                    
        //                                     }
        //                             }
        //                         }
        //                     }
                
        //                 }
        //             }
        //         }
        //         return Response::json(array("status" => 200, "messages" => "Se agrego la información del paciente con exito", "data" => $data), 200);
        //     }
        //     else{
        //         return Response::json(array("error" => 404, "messages" => "No se encontro el registro de pacientes"), 404);
        //     }
        // }
        // catch (\Exception $e) {
        //     return Response::json($e->getMessage(), 500);
        // }
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {

        //$paciente = Paciente::with('municipio','localidad')->find($id);
        $paciente = Paciente::find($id);

        if(!$paciente){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['paciente' => $paciente], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //$input = Input::json()->all();
        $input = $request->json()->all();

        if (is_array($input))
            $input = (object) $input;

        try {

                $paciente = new Paciente();
                $data = $paciente::find($id);

                $data->folio_paciente           = $input->folio_paciente;
                $data->clues                    = $input->clues;
                $data->nombre                   = $input->nombre;
                $data->paterno                  = $input->paterno;
                $data->materno                  = $input->materno;
                $data->edad                     = $input->edad;
                $data->fecha_nacimiento         = Carbon::createFromDate($input->fecha_nacimiento)->format('Y-m-d');
                $data->fecha_ingreso            = Carbon::createFromDate($input->fecha_ingreso)->format('Y-m-d');
                $data->hora_ingreso             = $input->hora_ingreso;
                $data->telefono_contacto        = $input->telefono_contacto;
                $data->semanasControl           = Carbon::createFromDate($input->semanasControl)->format('Y-m-d');
                $data->cluesControl             = $input->cluesControl;
                $data->curp                     = $input->curp;
                $data->fecha_puerperio          = $input->fecha_puerperio;
                $data->clues_puerperio          = $input->clues_puerperio;
                $data->esPuerpera               = $input->esPuerpera;
                $data->gestas                   = $input->gestas;
                $data->partos                   = $input->partos;
                $data->cesareas                 = $input->cesareas;
                $data->abortos                  = $input->abortos;
                $data->semanas_gestacionales    = $input->semanas_gestacionales;
                $data->estaEmbarazada           = $input->estaEmbarazada;
                $data->fueReferida              = $input->fueReferida;
                $data->tieneAlta                = $input->tieneAlta;
                $data->esExtranjero             = $input->esExtranjero;
                $data->paisOrigen               = $input->paisOrigen;
                $data->ultimoEstadoActual       = $input->ultimoEstadoActual;
                $data->estado_actual_id         = $input->estado_actual_id;
                $data->user_id                  = $input->user_id;
                $data->municipio_id             = $input->municipio_id;
                $data->localidad_id             = $input->localidad_id;
                $data->afiliacion_id            = $input->afiliacion_id;
                $data->metodo_gestacional_id    = $input->metodo_gestacional_id;
                $data->clues_referencia         = $input->clues_referencia;


                if($data->save()){
                    return Response::json(array("status" => 200, "messages" => "Se edito la información del paciente con exito", "data" => $data), 200);
                }            
                else{
                return Response::json(array("error" => 404, "messages" => "No se pudo editar la información del paciente"), 404);
            }
        }
        catch (\Exception $e) {
            return Response::json($e->getMessage(), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function getFilterCatalogs(){
        try{

            $catalogo_clues = Clue::orderBy('nombre');
            $catalogo_diagnosticos = Diagnostico::orderBy("nombre");
            $catalogo_estados_actuales = EstadoActual::orderBy("nombre");



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

    public function getLugares(){
        try{

            $municipios = Municipio::orderBy('nombre');
            $localidades = Localidad::orderBy("nombre");



            $catalogo_lugares = [
                'municipios'               => $municipios->get(),
                'localidades'              => $localidades->get(),
            ];

            return response()->json($catalogo_lugares, HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }


    public function getDispositivosPacientes(Request $request){

        //en un futuro mandaria un array de folios para casarlos con los pacientes ingresado que sean distintos de los que mande migue.

        try{
            
            //$parametros = Input::all();
            $parametros = $request->all();
            //return Response::json(array("error" => $parametros['pacientes'], 200));

            //$parametros = (object) $parametros;

            //return Response::json(array("error" => $parametros['pacientes'][1]['folios_paciente'], 200));
            //$arreglos = implode(",", $parametros->pacientes[1]['folios_paciente']);
            //$nuevo = str_replace(array(","), '\",\"', $arreglos);

            
            //return Response::json(array("error" => $nuevo, 200));
            //$pacientes = Paciente::where('clues', $parametros['clues'])->get();
            $pacientes = DB::table('pacientes')
                        ->where('clues', '=', $parametros['pacientes'][0]['clues'])
                        ->where('tieneAlta', '=', 0)
                        ->whereNotIn('folio_paciente', $parametros['pacientes'][1]['folios_pacientes'])
                        ->get();

            if(!$pacientes){
                return Response::json(array("status" => 204, "messages" => "No hay pacientes por sincronizar", "pacientes" => $pacientes), 204);
                //204
            }
                
            
            return Response::json(array("status" => 200, "messages" => "Sincronización Exitosa", "pacientes" => $pacientes), 200);

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }

}
