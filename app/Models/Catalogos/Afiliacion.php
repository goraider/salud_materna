<?php

namespace App\Models\Catalogos;
use Illuminate\Database\Eloquent\SoftDeletes;

use Illuminate\Database\Eloquent\Model;

class Afiliacion extends Model
{
    use SoftDeletes;
    protected $table = 'afiliaciones';
}
