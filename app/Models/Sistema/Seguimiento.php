<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class Seguimiento extends Model
{
    protected $table = 'seguimientos';
    protected $fillable = [
        'id',
        'folio_seguimiento',
        'observaciones',
        'codigoMater',
        'no_cama',
        'servicio_id',
        'estado_actual_id',
        'factor_covid_id',
        'paciente_id',
    ];

    public function paciente(){

        return $this->belongsTo('App\Models\Sistema\Paciente', 'paciente_id', 'id');

    }
    
    public function seguimientoEstadoActual(){

        return $this->hasOne('App\Models\Sistema\Seguimiento', 'paciente_id', 'id')->latest();
    }

    public function diagnosticos(){

        return $this->belongsToMany('App\Models\Sistema\Diagnostico', 'seguimiento_diagnostico', 'seguimiento_id', 'diagnostico_id');

    }

    public function estado_actual(){

        return $this->belongsTo('App\Models\Catalogos\EstadoActual', 'estado_actual_id');
    }

    public function factor_covid(){

        return $this->belongsTo('App\Models\Catalogos\FactorCovid', 'factor_covid_id');
    }

    public function servicio(){

        return $this->belongsTo('App\Models\Catalogos\Servicio', 'servicio_id');
    }

}
