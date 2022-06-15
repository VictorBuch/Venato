<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable()->default(null);
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->integer('weight')->nullable()->default(null);
            $table->string('weight_unit')->nullable()->default(null);
            $table->integer('height')->nullable()->default(null);
            $table->string('height_unit')->nullable()->default(null);
            $table->integer('age')->nullable()->default(null);
            $table->string('goal')->nullable()->default(null);
            $table->integer('calorie_goal')->nullable()->default(null);
            $table->string('activity_level')->nullable()->default(null);
            $table->string('sex')->nullable()->default(null);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
