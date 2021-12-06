<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMunicipiosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('municipios', function (Blueprint $table) {
            $table->smallIncrements('id')->unsigned();
            $table->string('clave', 191);
			$table->string('nombre', 191);
			$table->integer('entidades_id')->default(7);
			$table->smallInteger('jurisdicciones_id')->unsigned();
			$table->timestamps();
			$table->softDeletes();
        });

        Schema::table('municipios', function($table) {
            $table->foreign('jurisdicciones_id')->references('id')->on('jurisdicciones')->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('municipios');
    }
}
