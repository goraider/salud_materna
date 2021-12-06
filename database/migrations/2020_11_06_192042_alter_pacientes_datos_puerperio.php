<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterPacientesDatosPuerperio extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pacientes', function (Blueprint $table) {
            
            $table->date('fecha_puerperio')->index()->nullable()->after('curp');
            $table->string('clues_puerperio')->index()->nullable()->after('fecha_puerperio');
            $table->boolean('esPuerpera')->index()->default(0)->unsigned()->nullable()->after('clues_puerperio');

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
            
            $table->dropColumn('fecha_puerperio');
            $table->dropColumn('clues_puerperio');
            $table->dropColumn('esPuerpera');
            
        });
    }
}
