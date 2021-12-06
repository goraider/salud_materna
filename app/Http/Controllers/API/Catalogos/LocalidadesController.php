<?php

namespace App\Http\Controllers\API\Catalogos;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Models\Catalogos\Localidad;

class LocalidadesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {

            $localidades = Localidad::all();
    
            return response()->json(['catalogo_localidades' => $localidades], 200);

        } catch (\Exception $e) {
            return response()->json(['error' =>$e, 404]);
        }
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //$localidad = Localidad::find($id);

        // $localidad = Localidad::with("municipios")
        // ->selectRaw("municipios.id as idMunicipio, municipios.nombre as municipios, localidades.id, localidades.claveCarta, localidades.nombre, localidades.created_at, localidades.updated_at, localidades.deleted_at")
        // ->leftJoin('municipios', 'municipios.id', '=', 'localidades.municipios_id')->find($id);

        $localidad = Localidad::with("municipios")
        ->selectRaw("municipios.id as idMunicipio, municipios.nombre as municipios, localidades.id, localidades.claveCarta, localidades.nombre, localidades.created_at, localidades.updated_at, localidades.deleted_at")
        ->leftJoin('municipios', 'municipios.id', '=', 'localidades.municipios_id');

        if(isset($id)){
            $localidad = $localidad->where("municipios.nombre", $id)->orWhere("municipios.id", $id);
        }else{
            $localidad = $localidad->where("municipios.id", 1);
        }

        $localidad = $localidad->get();

        if(!$localidad){
            return response()->json(['No se encuentra el recurso que esta buscando.'], HttpResponse::HTTP_CONFLICT);
            //404
        }

        return response()->json(['localidad' => $localidad], 200);
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
