<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            // The object key on the media disk, recorded at upload time.
            // Deriving it back from the URL is what previously let a delete
            // report success while the object stayed public in the bucket.
            $table->string('path')->unique();
            $table->string('url');
            // Mime type of the bytes actually stored, which is not necessarily
            // what was uploaded: images are re-encoded to WebP on the way in.
            $table->string('type', 100);
            $table->string('filename');
            $table->unsignedBigInteger('size');
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->string('alt_id')->nullable();
            $table->string('alt_en')->nullable();
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
