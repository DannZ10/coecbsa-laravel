<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('impact_stats', function (Blueprint $table) {
            $table->id();
            // `stat_key`, not `key`: KEY is reserved in MySQL.
            $table->string('stat_key')->unique();
            // Kept as text, not a number: the design prints values like "120+"
            // and "3 Prov.", and the suffix is part of the content.
            $table->string('value');
            $table->string('label_id');
            $table->string('label_en')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index('position');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('impact_stats');
    }
};
