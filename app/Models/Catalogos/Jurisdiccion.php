<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Jurisdiccion extends Model
{
    protected $table = 'jurisdicciones';
    protected $hidden = ["created_at", "updated_at", "deleted_at"];

    public function municipios(){
        return $this->hasMany('App\Models\Catalogos\Municipio','jurisdicciones_id', 'id');
    }

    public function clues(){
        return $this->hasMany('App\Models\Catalogos\Clue','jurisdicciones_id', 'id');
    }

}
