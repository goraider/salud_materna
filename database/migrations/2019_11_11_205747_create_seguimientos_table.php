<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSeguimientosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('seguimientos', function (Blueprint $table) {

            $table->smallIncrements('id')->unsigned();
            $table->string('folio_seguimiento');
            $table->string('observaciones');
            $table->boolean('codigoMater');
            $table->string('no_cama');
            
            $table->smallInteger('servicio_id')->unsigned();
            $table->foreign('servicio_id')->references('id')->on('servicios')->onUpdate('cascade');

            $table->smallInteger('estado_actual_id')->unsigned()->index();
            $table->foreign('estado_actual_id')->references('id')->on('estados_actuales')->onUpdate('cascade');

            $table->smallInteger('paciente_id')->unsigned();
            $table->foreign('paciente_id')->references('id')->on('pacientes')->onUpdate('cascade');


            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('seguimientos');
    }
}
