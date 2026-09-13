<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name_id');
            $table->string('name_en')->nullable();
            // Grouping label shown above the logo row ("Pemerintah", "Industri"),
            // not a relation. Same reasoning as programs.tag_label_*.
            $table->string('group_label_id');
            $table->string('group_label_en')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('href')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index(['group_label_id', 'position']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
