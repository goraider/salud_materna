<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterAltasDatosNulos extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('altas', function (Blueprint $table) {
            
            $table->bigInteger('telefono')->unsigned()->nullable()->change();
            $table->string('direccion_completa')->nullable()->change();
            $table->smallInteger('metodo_anticonceptivo_id')->unsigned()->nullable()->change();
            $table->smallInteger('municipio_id')->unsigned()->nullable()->change();
            $table->smallInteger('localidad_id')->unsigned()->nullable()->change();


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('altas', function (Blueprint $table) {
            
            $table->dropColumn('telefono');
            $table->dropColumn('direccion_completa');
            $table->dropColumn('metodo_anticonceptivo_id');
            $table->dropColumn('municipio_id');
            $table->dropColumn('localidad_id');

        });
    }
}
