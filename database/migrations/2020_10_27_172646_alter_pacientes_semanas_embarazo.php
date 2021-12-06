<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AlterPacientesSemanasEmbarazo extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('pacientes', function (Blueprint $table) {
            
            $table->decimal('semanasControl')->index()->unsigned()->nullable()->after('hora_ingreso');
            $table->string('cluesControl')->index()->nullable()->after('semanasControl');

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
            
            $table->dropColumn('semanasControl');
            $table->dropColumn('cluesControl');
            
        });
    }
}
