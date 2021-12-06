<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

//use Illuminate\Support\Facades\Input;
use Response, DB;

use App\Models\Sistema\Paciente;
use App\Models\Sistema\Alta;
use App\Models\Sistema\AltaDiagnostico;
use App\Models\Sistema\Directorio;

use Carbon\Carbon;

class AltasController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //$data = Input::json()->all();
        $data = $request->json()->all();
        $data = (object) $data;

        try {

            if(property_exists($data, "altas")){
                $altas = array_filter($data->altas, function($v){return $v !== null;});
                foreach ($altas as $key => $value) {
                    //validar que el valor no sea null
                    if($value != null){
                        //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
                        if(is_array($value))
                            $value = (object) $value;

                            $paciente = Paciente::where('folio_paciente', '=', $value->folio_paciente)->first();

                            if($paciente){

                                //DB::table('pacientes')->updateOrInsert($paciente->tieneAlta);
                                //https://jsoneditoronline.org/?id=a0755322ada0471faff3ed343ea34a23


                                    $altas = new Alta();
                                    $altas->folio_alta                  = $value->folio_alta;
                                    $altas->observaciones               = $value->observaciones;
                                    $altas->fecha_alta                  = Carbon::createFromFormat('d/m/Y H:i:s', $value->fecha_alta)->format('Y-m-d');
                                    $altas->dias_hospitalizado          = $value->dias_hospitalizado;
                                    $altas->telefono                    = property_exists($value, "telefono") ? $value->telefono : null;
                                    $altas->direccion_completa          = property_exists($value, "direccion_completa") ? $value->direccion_completa:null;
                                    $altas->motivo_egreso_id            = $value->motivo_egreso_id; 
                                    $altas->condicion_egreso_id         = $value->condicion_egreso_id;
                                    $altas->estado_actual_id            = $value->estado_actual_id;
                                    $altas->metodo_anticonceptivo_id    = property_exists($value, "metodo_anticonceptivo_id") ? $value->metodo_anticonceptivo_id:null;
                                    $altas->municipio_id                = property_exists($value, "municipio_id") ? $value->municipio_id:null;
                                    $altas->localidad_id                = property_exists($value, "localidad_id") ? $value->localidad_id:null;
                                    $altas->paciente_id                 = $paciente->id;

                                    if($altas->save())

                                    DB::table('pacientes')
                                    ->where('folio_paciente', $value->folio_paciente)
                                    ->update(['tieneAlta' => 1]);
                            }
                    }
                }
                return Response::json(array("status" => 200, "messages" => "Se agrego la información del alta con exito", "data" => $data), 200);
            }
            else{
                return Response::json(array("error" => 404, "messages" => "No se registro el alta"), 404);
            }
        }
        catch (\Exception $e) {
            return Response::json($e->getMessage(), 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
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
        //
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

    public function getDispositivosAltas(Request $request){

        //en un futuro mandaria un array de folios para casarlos con los pacientes ingresado que sean distintos de los que mande migue.

        try{
            
            $parametros = $request->all();

            $altas = DB::table('altas')
                        ->join('pacientes as PS', 'altas.paciente_id', '=', 'PS.id')
                        ->where('PS.clues', '=', $parametros['altas'][0]['clues'])
                        ->whereNotIn('folio_alta', $parametros['altas'][1]['folios_altas'])
                        ->select('altas.*', 'PS.folio_paciente')
                        ->get();

            if(!$altas){
                return Response::json(array("status" => 204, "messages" => "No hay altas por sincronizar", "altas" => $altas), 204);
                //204
            }
                
            
            return Response::json(array("status" => 200, "messages" => "Sincronización Exitosa", "altas" => $altas), 200);

        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }

    }
}
