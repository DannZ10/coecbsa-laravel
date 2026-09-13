<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title_id')->nullable();
            $table->string('title_en')->nullable();
            $table->text('caption_id')->nullable();
            $table->text('caption_en')->nullable();
            $table->string('image_url');
            $table->string('thumbnail_url')->nullable();
            // `position`, not `order`: ORDER is a reserved word in MySQL and
            // every query touching it would need quoting.
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index('position');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
