<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDirectorioTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('directorio', function (Blueprint $table) {

            $table->smallIncrements('id');
            $table->string('nombre')->nullable();
            $table->bigInteger('celular')->nullable()->unsigned();
            $table->string('correo')->nullable();
            $table->string('cargo')->nullable();

            $table->smallInteger('jurisdicciones_id')->nullable()->unsigned();

            $table->timestamps();
            $table->softDeletes();

        });

        Schema::table('directorio', function($table) {
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
        Schema::dropIfExists('directorio');
    }
}
