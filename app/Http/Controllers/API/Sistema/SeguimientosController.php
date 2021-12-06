<?php

namespace App\Http\Controllers\API\Sistema;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;
//use Illuminate\Support\Facades\Input;
use Response, DB, Validator;

use App\Models\Sistema\Paciente;
use App\Models\Sistema\Seguimiento;

class SeguimientosController extends Controller
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

            if(property_exists($data, "seguimientos")){
                $seguimientos = array_filter($data->seguimientos, function($v){return $v !== null;});
                foreach ($seguimientos as $key => $value) {
                    //validar que el valor no sea null
                    if($value != null){
                        //comprobar si el value es un array, si es convertirlo a object mas facil para manejar.
                        if(is_array($value))
                            $value = (object) $value;

                            if($paciente = Paciente::where('folio_paciente', '=', $value->folio_paciente)->first()){

                                //$paciente = Paciente::where('folio_paciente', '=', $value->folio_paciente)->first();

                                $seguimiento = new Seguimiento();

                                $seguimiento->folio_seguimiento      = property_exists($value, "folio_seguimiento") ? $value->folio_seguimiento: $seguimiento->folio_seguimiento;
                                $seguimiento->observaciones          = property_exists($value, "observaciones")     ? $value->observaciones: $seguimiento->observaciones;
                                $seguimiento->codigoMater            = property_exists($value, "codigoMater")       ? $value->codigoMater: $seguimiento->codigoMater;
                                $seguimiento->no_cama                = property_exists($value, "no_cama")           ? $value->no_cama: $seguimiento->no_cama;
                                $seguimiento->paciente_id            = property_exists($paciente, "id")             ? $paciente->id :  $paciente->id;
                                $seguimiento->servicio_id            = property_exists($value, "servicio_id")       ? $value->servicio_id: $seguimiento->servicio_id;
                                $seguimiento->estado_actual_id       = property_exists($value, "estado_actual_id")  ? $value->estado_actual_id: $seguimiento->estado_actual_id;
                                $seguimiento->factor_covid_id        = property_exists($value, "factor_covid_id")   ? $value->factor_covid_id: $seguimiento->factor_covid_id;
                                //$seguimiento->save();
                               if($seguimiento->save())

                                DB::table('pacientes')
                                ->where('folio_paciente', $value->folio_paciente)
                                ->update([
                                    'ultimoEstadoActual' => $value->ultimoEstadoActual,
                                    'estado_actual_id'   => $value->estado_actual_id,
                                ]);


                            }
                    }
                }
                return Response::json(array("status" => 200, "messages" => "Se agrego la información de los seguimientos con exito", "data" => $data), 200);
            }
            else{
                return Response::json(array("error" => 404, "messages" => "No se registro el seguimiento"), 404);
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
        // ME MANDAS EL FOLIO PACIENTE Y TE MANDO EL ULTIMO SEGUIMIENTO.

        $seguimiento = Seguimiento::select('seguimientos.*')->with('estado_actual', 'factor_covid', 'servicio', 'diagnosticos')
                                    ->where('paciente_id', '=', $id)
                                    ->orderBy('id', 'desc')->first();
        

        if(!$seguimiento){
            return Response::json(array("error" => 404, "messages" => "No se encontro el seguimiento"), 404);
            //404
        }

        return response()->json(['seguimiento' => $seguimiento], 200);
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
}
