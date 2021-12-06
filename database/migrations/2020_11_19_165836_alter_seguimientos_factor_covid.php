<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterSeguimientosFactorCovid extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('seguimientos', function (Blueprint $table) {

            $table->smallInteger('factor_covid_id')->unsigned()->nullable()->index()->after('estado_actual_id');
            $table->foreign('factor_covid_id')->references('id')->on('factor_covid')->onUpdate('cascade');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('seguimientos', function (Blueprint $table) {
            
            $table->dropForeign(['factor_covid_id']);
            $table->dropColumn('factor_covid_id');
            
        });
    }
}
