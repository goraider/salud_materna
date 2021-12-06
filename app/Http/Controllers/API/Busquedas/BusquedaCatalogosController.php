<?php

namespace App\Http\Controllers\API\Busquedas;

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use App\Http\Controllers\Controller;

use App\Models\Catalogos\Clue;
use App\Models\Catalogos\Jurisdiccion;
use App\Models\Catalogos\MetodoAnticonceptivo;
use App\Models\Sistema\Diagnostico;
use App\Models\Catalogos\Municipio;
use App\Models\Catalogos\Localidad;
use App\Models\Catalogos\EstadoActual;
use App\Models\Catalogos\CondicionEgreso;
use App\Models\Catalogos\MotivoEgreso;


class BusquedaCatalogosController extends Controller
{
    public function getCluesAutocomplete(Request $request)
    {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = $request->all();
            $unidades = Clue::select('id', 'nombre', 'domicilio', 'codigoPostal', 'nivelAtencion', 'numeroLatitud', 'numeroLongitud');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $unidades = $unidades->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%')
                                ->orWhere('id','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $unidades = $unidades->paginate($resultadosPorPagina);
            } else {

                $unidades = $unidades->get();
            }

            return response()->json(['data'=>$unidades],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getDiagnosticosAutocomplete(Request $request)
    {
        /*if (\Gate::denies('has-permission', \Permissions::VER_ROL) && \Gate::denies('has-permission', \Permissions::SELECCIONAR_ROL)){
            return response()->json(['message'=>'No esta autorizado para ver este contenido'],HttpResponse::HTTP_FORBIDDEN);
        }*/

        try{
            $parametros = $request->all();
            $unidades = Diagnostico::select('id','nombre');
            
            //Filtros, busquedas, ordenamiento
            if(isset($parametros['query']) && $parametros['query']){
                $unidades = $unidades->where(function($query)use($parametros){
                    return $query->where('nombre','LIKE','%'.$parametros['query'].'%');
                });
            }

            if(isset($parametros['page'])){
                $resultadosPorPagina = isset($parametros["per_page"])? $parametros["per_page"] : 20;
                $unidades = $unidades->paginate($resultadosPorPagina);
            } else {

                $unidades = $unidades->get();
            }

            return response()->json(['data'=>$unidades],HttpResponse::HTTP_OK);
        }catch(\Exception $e){
            return response()->json(['error'=>['message'=>$e->getMessage(),'line'=>$e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
    public function getCatalogs(Request $request)
    {
        try {
            $listado_catalogos = [
                'clues'                     => Clue::getModel(),
                'diagnosticos'              => Diagnostico::getModel(),
                'distritos'                 => Jurisdiccion::getModel(),
                'municipios'                => Municipio::getModel(),
                'localidades'               => Localidad::getModel(),
                'estados_actuales'          => EstadoActual::getModel(),
                'anticonceptivos'           => MetodoAnticonceptivo::getModel(),

                'motivos_egresos'               => MotivoEgreso::getModel(),
                'condiciones_egresos'           => CondicionEgreso::getModel(),
                'metodos_anticonceptivos'       => MetodoAnticonceptivo::getModel(),
            ];

            //$parametros = Input::all();
            $parametros = $request->all();

            $catalogos = [];
            for ($i = 0; $i < count($parametros); $i++) {
                $catalogo = $parametros[$i]; //podemos agregar filtros y ordenamiento

                if (isset($listado_catalogos[$catalogo['nombre']])) {
                    $modelo = $listado_catalogos[$catalogo['nombre']];
                    //podemos agregar filtros y ordenamiento
                    if (isset($catalogo['orden']) && $catalogo['orden']) { //hacer arrays
                        $modelo = $modelo->orderBy($catalogo['orden']);
                    }
                    //throw new \Exception(isset($catalogo['filtro_id']), 1);
                    if (isset($catalogo['filtro_id']) && $catalogo['filtro_id']) {  //hacer arrays

                        $modelo = $modelo->where($catalogo['filtro_id']['campo'], $catalogo['filtro_id']['valor']);
                    }

                    $catalogos[$catalogo['nombre']] = $modelo->get(); //por el momento bastara con esto
                } else {
                    $catalogos[$catalogo['nombre']] = '404';
                }
            }

            return response()->json(['data' => $catalogos], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }

    public function getlocalidad(Request $request)
    {
        $parametros = $request->all();
        //return response()->json(['data'=>$parametros['municipio']], HttpResponse::HTTP_OK);
        try {

            $localidades                 = Localidad::where("municipio_id", "=", $parametros['municipio'])->get();
            $catalogo_covid = [

                'localidades'                             => $localidades,

            ];

            return response()->json(['data' => $catalogo_covid], HttpResponse::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json(['error' => ['message' => $e->getMessage(), 'line' => $e->getLine()]], HttpResponse::HTTP_CONFLICT);
        }
    }
}
