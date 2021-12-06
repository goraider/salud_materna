<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePacientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pacientes', function (Blueprint $table) {

            $table->smallIncrements('id')->unsigned();
            $table->string('folio_paciente')->index();
            
            $table->string('clues')->index();
            $table->foreign('clues')->references('id')->on('clues')->onUpdate('cascade');

            $table->string('nombre')->index();
            $table->string('paterno')->index();
            $table->string('materno')->index();
            $table->integer('edad')->unsigned();
            $table->date('fecha_nacimiento');
            $table->date('fecha_ingreso');
            $table->time('hora_ingreso');
            $table->string('curp');
            $table->integer('gestas')->unsigned();
            $table->integer('partos')->unsigned();
            $table->integer('cesareas')->unsigned();
            $table->integer('abortos')->unsigned();
            $table->decimal('semanas_gestacionales')->unsigned()->nullable();
            $table->boolean('estaEmbarazada')->unsigned();
            $table->boolean('fueReferida')->unsigned();
            $table->boolean('tieneAlta')->unsigned();

            $table->smallInteger('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade');

            $table->smallInteger('municipio_id')->unsigned();
            $table->foreign('municipio_id')->references('id')->on('municipios')->onUpdate('cascade');

            $table->smallInteger('localidad_id')->unsigned();
            $table->foreign('localidad_id')->references('id')->on('localidades')->onUpdate('cascade');

            $table->smallInteger('afiliacion_id')->unsigned()->nullable();
            $table->foreign('afiliacion_id')->references('id')->on('afiliaciones')->onUpdate('cascade');

            $table->smallInteger('metodo_gestacional_id')->unsigned()->nullable();
            $table->foreign('metodo_gestacional_id')->references('id')->on('metodos_gestacionales')->onUpdate('cascade');
            
            $table->string('clues_referencia')->nullable();
            $table->foreign('clues_referencia')->references('id')->on('clues')->onUpdate('cascade');

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
        Schema::dropIfExists('pacientes');
    }
}
