<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            // Bilingual columns: the `_id` suffix is the ISO 639-1 code for
            // Indonesian, not a foreign key. Separate columns rather than one
            // JSON blob so they stay indexable and searchable.
            $table->string('name_id');
            $table->string('name_en')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
