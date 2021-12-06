<?php

use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('logout',   'API\Auth\AuthController@logout');
    Route::get('perfil',   'API\Auth\AuthController@me');
    
});

Route::post('signin',   'API\Auth\AuthController@login');
Route::post('refresh',  'API\Auth\AuthController@refresh');




Route::group(['middleware'=>'auth'],function($router){

    Route::apiResource('user',          'API\Admin\UserController');
    Route::apiResource('permission',    'API\Admin\PermissionController');
    Route::apiResource('role',          'API\Admin\RoleController');
    Route::apiResource('profile',       'API\ProfileController')->only([ 'show', 'update']);

    Route::get('clues',                                 'API\Catalogos\CluesController@index');

    Route::apiResource('diagnosticos',                  'API\Catalogos\DiagnosticoController');
    Route::apiResource('metodos-anticonceptivos',       'API\Catalogos\MetodosAnticonceptivosController');
    Route::get('afiliaciones',                          'API\Catalogos\AfiliacionesController@index');
    Route::apiResource('municipios',                    'API\Catalogos\MunicipiosController');
    Route::apiResource('localidades',                   'API\Catalogos\LocalidadesController');
    Route::apiResource('servicios',                     'API\Catalogos\ServiciosController');
    Route::apiResource('estados-actuales',              'API\Catalogos\EstadosActualesController');
    Route::apiResource('metodos-gestacionales',         'API\Catalogos\MetodosGestacionalesController');
    Route::get('condiciones_egresos',                   'API\Catalogos\CondicionesEgresosController@index');
    Route::apiResource('motivos_egresos',               'API\Catalogos\MotivosEgresosController');
    Route::apiResource('factores-covid',                'API\Catalogos\FactoresCovidController');

    //subir información desde aplicación
    Route::apiResource('pacientes',                             'API\Sistema\PacientesController');
    Route::get('catalogos-filtro-pacientes',                    'API\Sistema\PacientesController@getFilterCatalogs');
    Route::get('catalogo-lugares',                              'API\Sistema\PacientesController@getLugares');
    Route::post('sync-pacientes',                               'API\Sistema\PacientesController@getDispositivosPacientes');
    Route::post('sync-altas',                                   'API\Sistema\AltasController@getDispositivosAltas');
    Route::apiResource('seguimientos',                          'API\Sistema\SeguimientosController');
    Route::apiResource('seguimientos-diagnosticos',             'API\Sistema\SeguimientosDiagnosticosController');

    Route::apiResource('altas',                                 'API\Sistema\AltasController');
    Route::apiResource('altas-diagnosticos',                    'API\Sistema\AltasDiagnosticosController');

    //rutas especiales
    Route::post('update-device',                        'API\Admin\ClueUserController@updateDevice');
    //rutas autocomplets
    Route::get('busqueda-clues',                        'API\Busquedas\BusquedaCatalogosController@getCluesAutocomplete');
    Route::get('busqueda-diagnosticos',                 'API\Busquedas\BusquedaCatalogosController@getDiagnosticosAutocomplete');


    //dash
    Route::get('dash-estados-actuales',                  'API\Dashboard\DashEstadosActuales@getDashEstadosActuales');
    Route::get('dash-control-embarazo',                  'API\Dashboard\DashEstadosActuales@getDashControlEmbarazo');
    Route::get('dash-estados-actuales-pacientes',        'API\Dashboard\DashEstadosActuales@getDashEstadosActualesPacientes');

    //reportes
    Route::post('obtener-catalogos',                   'API\Busquedas\BusquedaCatalogosController@getCatalogs');
    //reporte monitoreo
    Route::get('reporte-monitoreo',                    'API\Reportes\ReportesController@reporteMonitoreo');
    Route::get('catalogos-monitoreo',                  'API\Reportes\ReportesController@filtrosMonitoreo');

    //reporte altas
    Route::get('reporte-altas',                         'API\Reportes\ReportesController@reporteAltas');

    
    


});

Route::middleware('auth')->get('/avatar-images', function (Request $request) {
    $avatars_path = public_path() . config('ng-client.path') . '/assets/avatars';
    $image_files = glob( $avatars_path . '/*', GLOB_MARK );

    $root_path = public_path() . config('ng-client.path');

    $clean_path = function($value)use($root_path) {
        return str_replace($root_path,'',$value);
    };
    
    $avatars = array_map($clean_path, $image_files);

    return response()->json(['images'=>$avatars], HttpResponse::HTTP_OK);
});