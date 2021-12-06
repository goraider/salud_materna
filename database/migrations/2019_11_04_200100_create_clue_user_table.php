<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClueUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('clue_user', function (Blueprint $table) {

            //$table->smallIncrements('id')->unsigned();
            //$table->string('clue_clue');
            $table->string('clue_id')->index();
            $table->unsignedSmallInteger('user_id')->index();
            $table->string('dispositivo_id')->nullable();
            
            //$table->smallInteger('jurisdiccion_id')->unsigned()->index();
            $table->foreign('clue_id')->references('id')->on('clues')->onUpdate('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onUpdate('cascade');
            //$table->foreign('clue_clue')->references('clues')->on('clues')->onUpdate('cascade');
            //$table->foreign('jurisdiccion_id')->references('id')->on('jurisdicciones');
            
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
        Schema::dropIfExists('clue_user');
    }
}
