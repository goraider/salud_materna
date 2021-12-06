<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPacientesDatosExtranjeroTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pacientes', function (Blueprint $table) {

            $table->string('curp')->unsigned()->nullable()->change();
            $table->smallInteger('municipio_id')->unsigned()->nullable()->change();
            $table->smallInteger('localidad_id')->unsigned()->nullable()->change();
            $table->boolean('esExtranjero')->unsigned()->nullable()->after('tieneAlta');
            $table->string('paisOrigen')->nullable()->after('esExtranjero');




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

            $table->dropColumn('curp');
            $table->dropColumn('municipio_id');
            $table->dropColumn('localidad_id');
            $table->dropColumn('esExtranjero');
            $table->dropColumn('paisOrigen');

        });
    }
}
