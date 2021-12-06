<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterAltasAgregarFechaDias extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('altas', function (Blueprint $table) {

            $table->date('fecha_alta')->index()->nullable()->after('observaciones');
            $table->integer('dias_hospitalizado')->index()->nullable()->unsigned()->after('fecha_alta');

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
            
            $table->dropColumn('fecha_alta');
            $table->dropColumn('dias_hospitalizado');
            
        });
    }
}
