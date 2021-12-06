<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    public $incrementing = true;
    protected $table = 'pacientes';
    protected $fillable = [
        'id',
        'folio_paciente',
        'clues',
        'paterno',
        'materno',
        'edad',
        'fecha_nacimiento',
        'fecha_ingreso',
        'hora_ingreso',
        'telefono_contacto',
        'semanasControl',
        'cluesControl',
        'curp',
        'fecha_puerperio',
        'clues_puerperio',
        'esPuerpera',
        'gestas',
        'partos',
        'cesareas',
        'abortos',
        'semanas_gestacionales',
        'estaEmbarazada',
        'fueReferida',
        'tieneAlta',
        'esExtranjero',
        'paisOrigen',
        'ultimoEstadoActual',
        'estado_actual_id',
        'user_id',
        'municipio_id',
        'localidad_id',
        'afiliacion_id',
        'metodo_gestacional_id',
        'clues_referencia',
    ];

    public function seguimientos(){

        return $this->hasMany('App\Models\Sistema\Seguimiento', 'paciente_id', 'id')->with("servicio")->with("estado_actual")->with("factor_covid");
    }

    public function municipio(){

        return $this->belongsTo('App\Models\Catalogos\Municipio', 'municipio_id');
    }

    public function clues(){

        return $this->belongsTo('App\Models\Catalogos\Clue', 'clues');
    }

    public function localidad(){

        return $this->belongsTo('App\Models\Catalogos\Localidad', 'localidad_id');
    }

    public function metodo_gestacional(){

        return $this->belongsTo('App\Models\Catalogos\MetodoGestacional', 'metodo_gestacional_id');
    }

    // public function afiliacion(){

    //     return $this->belongsTo('App\Models\Catalogos\Afiliacion', 'afiliacion_id');
    // }

    public function alta(){

        return $this->hasOne('App\Models\Sistema\Alta', 'paciente_id', "id")->orderBy('id')->with("motivoEgreso")->with("condicionEgreso")->with("estadoActual")->with("metodoAnticonceptivo")->with("municipio")->with("localidad")->with("diagnosticos");
    }

    public function estado_actual(){

        return $this->belongsTo('App\Models\Catalogos\EstadoActual', 'estado_actual_id');
    }

    //reportes
    public function ultimoSeguimiento(){

        return $this->hasOne('App\Models\Sistema\Seguimiento', 'paciente_id', 'id')->orderBy('id', 'DESC')->with("servicio")->with("estado_actual");
    }

    public function primerSeguimiento(){

        return $this->hasOne('App\Models\Sistema\Seguimiento', 'paciente_id', 'id')->orderBy('id', 'ASC')->with("servicio")->with("estado_actual");
    }
    
}
