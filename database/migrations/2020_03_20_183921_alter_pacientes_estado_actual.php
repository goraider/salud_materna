<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPacientesEstadoActual extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pacientes', function (Blueprint $table) {
            
            $table->string('ultimoEstadoActual')->nullable()->after('paisOrigen');
            $table->smallInteger('estado_actual_id')->unsigned()->nullable()->after('ultimoEstadoActual');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('pacientes', function (Blueprint $table) {
            
            $table->dropColumn('ultimoEstadoActual');
            $table->dropColumn('estado_actual_id');
            
        });
    }
}
