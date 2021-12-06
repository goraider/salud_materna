<?php

namespace App\Models\Sistema;

use Illuminate\Database\Eloquent\Model;

class Directorio extends Model
{
    protected $table = 'directorio';
    protected $fillable = [

        'id',
        'nombre',
        'celular',
        'correo',
        'cargo'
    ];
}
