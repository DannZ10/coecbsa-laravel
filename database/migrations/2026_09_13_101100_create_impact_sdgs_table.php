<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('impact_sdgs', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique();
            $table->string('label_id');
            $table->string('label_en')->nullable();
            $table->text('description_id');
            $table->text('description_en')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index('position');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('impact_sdgs');
    }
};
