<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            // `tag_label_*`, not `tag_*`: this is the Indonesian/English label
            // printed on the card, not a relation to `tags`. Called `tag_id` it
            // would read as a foreign key to every Laravel developer who sees it.
            $table->string('tag_label_id');
            $table->string('tag_label_en')->nullable();
            $table->string('title_id');
            $table->string('title_en')->nullable();
            $table->string('place_id');
            $table->string('place_en')->nullable();
            $table->text('desc_id');
            $table->text('desc_en')->nullable();
            $table->string('funder_id');
            $table->string('funder_en')->nullable();
            $table->string('image');
            $table->longText('details_id')->nullable();
            $table->longText('details_en')->nullable();
            $table->string('status', 20)->default('ongoing');
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index('position');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('programs');
    }
};
