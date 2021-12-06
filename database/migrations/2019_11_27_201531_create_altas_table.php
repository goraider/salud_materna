<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAltasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('altas', function (Blueprint $table) {
            
            $table->smallIncrements('id')->unsigned();
            $table->string('folio_alta');
            $table->string('observaciones');
            $table->bigInteger('telefono')->nullable()->unsigned();
            $table->string('direccion_completa');

            $table->smallInteger('motivo_egreso_id')->unsigned();
            $table->foreign('motivo_egreso_id')->references('id')->on('motivos_egresos')->onUpdate('cascade');


            $table->smallInteger('condicion_egreso_id')->unsigned();
            $table->foreign('condicion_egreso_id')->references('id')->on('condiciones_egresos')->onUpdate('cascade');


            $table->smallInteger('estado_actual_id')->unsigned();
            $table->foreign('estado_actual_id')->references('id')->on('estados_actuales')->onUpdate('cascade');

            $table->smallInteger('metodo_anticonceptivo_id')->unsigned();
            $table->foreign('metodo_anticonceptivo_id')->references('id')->on('metodos_anticonceptivos')->onUpdate('cascade');
            
            $table->smallInteger('municipio_id')->unsigned();
            $table->foreign('municipio_id')->references('id')->on('municipios')->onUpdate('cascade');


            $table->smallInteger('localidad_id')->unsigned();
            $table->foreign('localidad_id')->references('id')->on('localidades')->onUpdate('cascade');

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
        Schema::dropIfExists('altas');
    }
}
