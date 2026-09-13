<?php

namespace Database\Seeders;

use App\Enums\ArticleStatus;
use App\Enums\ProgramStatus;
use App\Enums\Role;
use App\Models\Album;
use App\Models\Article;
use App\Models\Category;
use App\Models\GalleryItem;
use App\Models\ImpactSdg;
use App\Models\ImpactStat;
use App\Models\Partner;
use App\Models\Program;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Initial content, carried over from the Next app's apps/web/src/data/content.ts
 * so the rebuilt site opens with the same programs, partners and impact figures
 * the current one shows.
 *
 * Copy that is not editable in the CMS (hero, focus areas, people, contact
 * details) lives in lang/{locale}.json instead — putting it in the database
 * would mean building CMS screens nobody asked for.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = $this->seedAdmin();
        $this->seedTaxonomy();
        $this->seedPrograms();
        $this->seedPartners();
        $this->seedImpact();
        $this->seedArticles($admin);
        $this->seedGallery();
    }

    private function seedAdmin(): User
    {
        $password = (string) config('coecbsa.admin.password', '');

        if ($password === '') {
            // Never ship a default password. A random one is printed once and
            // then only exists as a hash, so an unattended seed cannot leave a
            // guessable super admin behind.
            $password = Str::password(20);
            $this->command?->warn("ADMIN_PASSWORD was empty. Generated: {$password}");
        }

        return User::updateOrCreate(
            ['email' => (string) config('coecbsa.admin.email')],
            [
                'name' => (string) config('coecbsa.admin.name'),
                'password' => Hash::make($password),
                'role' => Role::SuperAdmin,
                'is_active' => true,
                'email_verified_at' => now(),
            ],
        );
    }

    private function seedTaxonomy(): void
    {
        foreach ([
            ['program', 'Program', 'Program'],
            ['kolaborasi', 'Kolaborasi', 'Collaboration'],
            ['kemitraan', 'Kemitraan', 'Partnership'],
            ['riset', 'Riset', 'Research'],
        ] as [$slug, $nameId, $nameEn]) {
            Category::updateOrCreate(['slug' => $slug], ['name_id' => $nameId, 'name_en' => $nameEn]);
        }

        foreach (['Maggot BSF', 'Ekonomi Sirkular', 'IKM', 'SDGs'] as $name) {
            Tag::updateOrCreate(['slug' => Str::slug($name)], ['name' => $name]);
        }
    }

    private function seedPrograms(): void
    {
        $programs = [
            [
                'slug' => 'ekosistem-ekonomi-sirkular-maggot-bsf',
                'tag_label_id' => 'InsaIntek · Kemendikti',
                'tag_label_en' => 'InsaIntek · Kemendikti',
                'title_id' => 'Ekosistem Ekonomi Sirkular Maggot BSF',
                'title_en' => 'BSF Maggot Circular-Economy Ecosystem',
                'place_id' => 'Malang Raya',
                'place_en' => 'Greater Malang',
                'desc_id' => 'Menautkan penyedia limbah, pengolah, pengguna, dan regulator menjadi rantai pasok maggot yang utuh — dengan Sekolah Lapang di SPPG Sawojajar.',
                'desc_en' => 'Linking waste providers, processors, users, and regulators into a complete maggot supply chain — with a Field School at SPPG Sawojajar.',
                'funder_id' => 'Pendanaan Ditjen Sains & Teknologi',
                'funder_en' => 'Funded by Ditjen Sains & Teknologi',
                'image' => 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=1200&h=900&fit=crop&auto=format',
                'status' => ProgramStatus::Ongoing,
                'details_id' => 'Penyedia limbah, pengolah, pengguna, dan regulator dibina melalui Forum Kolaborasi, Sekolah Lapang, Podcast, BSF Challenges, dan Gebyar.',
                'details_en' => 'Waste providers, processors, users, and regulators are connected through the Collaboration Forum, Field School, Podcast, BSF Challenges, and Gebyar.',
                'position' => 0,
            ],
            [
                'slug' => 'limbah-ternak-menjadi-media-tanam',
                'tag_label_id' => 'Program 3M · Bank Indonesia',
                'tag_label_en' => '3M Program · Bank Indonesia',
                'title_id' => 'Limbah Ternak Menjadi Media Tanam',
                'title_en' => 'Livestock Waste into Growing Media',
                'place_id' => 'Bojonegoro & Kota Malang',
                'place_en' => 'Bojonegoro & Malang City',
                'desc_id' => 'Kolaborasi 3M bersama KTT USTAN Mandiri dan Bank Indonesia: kotoran sapi difermentasi (EM4 + SERMA) menjadi media tanam berkelanjutan.',
                'desc_en' => 'A 3M collaboration with KTT USTAN Mandiri and Bank Indonesia: cattle manure fermented (EM4 + SERMA) into sustainable growing media.',
                'funder_id' => 'Mendukung SDG 12, 13, 17',
                'funder_en' => 'Supporting SDGs 12, 13, 17',
                'image' => 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&h=900&fit=crop&auto=format',
                'status' => ProgramStatus::Ongoing,
                'details_id' => 'Kegiatan 3M mempertemukan Bank Indonesia, KTT USTAN Mandiri, dan komunitas untuk menghasilkan media tanam dari limbah ternak.',
                'details_en' => 'The 3M activities bring together Bank Indonesia, KTT USTAN Mandiri, and communities to make growing media from livestock waste.',
                'position' => 1,
            ],
            [
                'slug' => 'penguatan-ikm-berbasis-riset',
                'tag_label_id' => 'Disdagrin Manggarai Barat',
                'tag_label_en' => 'Disdagrin West Manggarai',
                'title_id' => 'Penguatan IKM Berbasis Riset',
                'title_en' => 'Research-Based SME Strengthening',
                'place_id' => 'Manggarai Barat, NTT',
                'place_en' => 'West Manggarai, NTT',
                'desc_id' => 'Inisiasi kolaborasi UB dan Disdagrin untuk menguatkan industri kecil melalui riset dan inovasi berkelanjutan.',
                'desc_en' => 'A UB–Disdagrin initiative to strengthen small industries through research and sustainable innovation.',
                'funder_id' => 'Kemitraan daerah',
                'funder_en' => 'Regional partnership',
                'image' => 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=900&fit=crop&auto=format',
                'status' => ProgramStatus::Planned,
                'details_id' => 'Program ini disiapkan bersama mitra daerah untuk memperkuat kapasitas industri kecil berbasis riset dan inovasi.',
                'details_en' => 'This program is being prepared with regional partners to strengthen research- and innovation-based small industries.',
                'position' => 2,
            ],
        ];

        foreach ($programs as $program) {
            Program::updateOrCreate(['slug' => $program['slug']], $program);
        }
    }

    private function seedPartners(): void
    {
        $groups = [
            ['Pemerintah', 'Government', [
                'Kemendikti · InsaIntek',
                'Disdagrin Manggarai Barat',
                'Pemkab Bojonegoro',
                'DLH',
                'SPPG',
            ]],
            ['Perbankan', 'Banking', ['Bank Indonesia — Jawa Timur']],
            ['Komunitas', 'Community', ['KTT USTAN Mandiri', 'Kampung Lingkar Kampus']],
            ['Akademik', 'Academic', ['Universitas Brawijaya', 'FTAB', 'Program 3M']],
        ];

        $position = 0;

        foreach ($groups as [$groupId, $groupEn, $names]) {
            foreach ($names as $name) {
                Partner::updateOrCreate(
                    ['slug' => Str::slug($name)],
                    [
                        'name_id' => $name,
                        'name_en' => $name,
                        'group_label_id' => $groupId,
                        'group_label_en' => $groupEn,
                        'position' => $position++,
                    ],
                );
            }
        }
    }

    private function seedImpact(): void
    {
        $stats = [
            ['activity-clusters', '5', 'Klaster kegiatan 2026', 'Activity clusters, 2026'],
            ['stakeholder-clusters', '4', 'Klaster pemangku kepentingan', 'Stakeholder clusters'],
            ['forum-participants', '~70', 'Peserta Forum Kolaborasi', 'Collaboration Forum participants'],
            ['active-regions', '3', 'Wilayah proyek aktif', 'Active project regions'],
        ];

        foreach ($stats as $position => [$key, $value, $labelId, $labelEn]) {
            ImpactStat::updateOrCreate(
                ['stat_key' => $key],
                ['value' => $value, 'label_id' => $labelId, 'label_en' => $labelEn, 'position' => $position],
            );
        }

        $sdgs = [
            ['12', 'Konsumsi & Produksi', 'Responsible Consumption',
                'Program mengubah limbah organik menjadi input bernilai dan mengurangi sisa material.',
                'The programs turn organic waste into valuable inputs while reducing material waste.'],
            ['13', 'Aksi Iklim', 'Climate Action',
                'Pengelolaan limbah dan pertanian sirkular membantu menekan dampak lingkungan.',
                'Waste management and circular agriculture help reduce environmental impact.'],
            ['17', 'Kemitraan', 'Partnerships',
                'Forum multipihak menghubungkan kampus, pemerintah, komunitas, dan perbankan.',
                'Multi-stakeholder forums connect campus, government, communities, and banking.'],
        ];

        foreach ($sdgs as $position => [$code, $labelId, $labelEn, $descId, $descEn]) {
            ImpactSdg::updateOrCreate(
                ['code' => $code],
                [
                    'label_id' => $labelId,
                    'label_en' => $labelEn,
                    'description_id' => $descId,
                    'description_en' => $descEn,
                    'position' => $position,
                ],
            );
        }
    }

    private function seedArticles(User $author): void
    {
        $articles = [
            [
                'slug' => 'forum-kolaborasi-multipihak-maggot-bsf',
                'category' => 'program',
                'published_at' => '2026-08-27 09:00:00',
                'title_id' => 'Forum Kolaborasi Multipihak pertemukan 70 pemangku kepentingan maggot BSF',
                'title_en' => 'Multi-Stakeholder Forum convenes 70 BSF maggot stakeholders',
                'excerpt_id' => 'Forum mempertemukan penyedia limbah, pengolah, pengguna, dan regulator dalam satu meja untuk merangkai rantai pasok maggot yang utuh.',
                'excerpt_en' => 'The forum brought waste providers, processors, users, and regulators to one table to assemble a complete maggot supply chain.',
                'content_id' => '<p>Forum Kolaborasi Multipihak yang digelar CoE CBSA mempertemukan sekitar 70 peserta dari empat klaster pemangku kepentingan: penyedia limbah, pengolah, pengguna, dan regulator.</p><p>Forum ini menjadi pembuka rangkaian kegiatan 2026 yang berlanjut dengan Sekolah Lapang di SPPG Sawojajar, Podcast, BSF Challenges, dan Gebyar.</p>',
                'content_en' => '<p>The Multi-Stakeholder Collaboration Forum hosted by CoE CBSA brought together around 70 participants from four stakeholder clusters: waste providers, processors, users, and regulators.</p><p>The forum opens the 2026 activity series, continuing with the Field School at SPPG Sawojajar, a Podcast, BSF Challenges, and Gebyar.</p>',
                'cover_image' => 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&h=800&fit=crop&auto=format',
                'tags' => ['maggot-bsf', 'ekonomi-sirkular'],
            ],
            [
                'slug' => 'kolaborasi-3m-coe-cbsa-bi-jatim-bojonegoro',
                'category' => 'kolaborasi',
                'published_at' => '2026-06-29 09:00:00',
                'title_id' => 'Kolaborasi 3M, CoE CBSA, dan BI Jatim majukan pertanian Bojonegoro',
                'title_en' => '3M, CoE CBSA, and BI East Java advance Bojonegoro agriculture',
                'excerpt_id' => 'Kotoran sapi difermentasi menjadi media tanam berkelanjutan bersama KTT USTAN Mandiri dan Bank Indonesia Jawa Timur.',
                'excerpt_en' => 'Cattle manure is fermented into sustainable growing media with KTT USTAN Mandiri and Bank Indonesia East Java.',
                'content_id' => '<p>Program 3M bersama KTT USTAN Mandiri dan Bank Indonesia Jawa Timur mengolah kotoran sapi melalui fermentasi EM4 dan SERMA menjadi media tanam.</p><p>Hasilnya dipakai langsung oleh kelompok tani setempat dan mendukung SDG 12, 13, dan 17.</p>',
                'content_en' => '<p>The 3M program with KTT USTAN Mandiri and Bank Indonesia East Java processes cattle manure through EM4 and SERMA fermentation into growing media.</p><p>The output is used directly by local farmer groups and supports SDGs 12, 13, and 17.</p>',
                'cover_image' => 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop&auto=format',
                'tags' => ['ekonomi-sirkular', 'sdgs'],
            ],
            [
                'slug' => 'ub-disdagrin-manggarai-barat-penguatan-ikm',
                'category' => 'kemitraan',
                'published_at' => '2026-06-10 09:00:00',
                'title_id' => 'UB dan Disdagrin Manggarai Barat inisiasi penguatan IKM berkelanjutan',
                'title_en' => 'UB and Disdagrin West Manggarai initiate sustainable SME strengthening',
                'excerpt_id' => 'Inisiasi kemitraan daerah untuk menguatkan industri kecil melalui riset terapan dan inovasi berkelanjutan.',
                'excerpt_en' => 'A regional partnership to strengthen small industries through applied research and sustainable innovation.',
                'content_id' => '<p>Universitas Brawijaya melalui CoE CBSA dan Dinas Perdagangan dan Perindustrian Manggarai Barat memulai kolaborasi penguatan industri kecil dan menengah.</p><p>Fokus awal diarahkan pada pemetaan kebutuhan teknologi dan penyiapan pendampingan berbasis riset.</p>',
                'content_en' => '<p>Universitas Brawijaya, through CoE CBSA, and the West Manggarai Trade and Industry Office have begun a collaboration to strengthen small and medium industries.</p><p>The initial focus is mapping technology needs and preparing research-based mentoring.</p>',
                'cover_image' => 'https://images.unsplash.com/photo-1595856619767-ab739fa7daae?w=1200&h=800&fit=crop&auto=format',
                'tags' => ['ikm'],
            ],
        ];

        foreach ($articles as $data) {
            $tags = $data['tags'];
            $categorySlug = $data['category'];
            unset($data['tags'], $data['category']);

            $article = Article::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    ...$data,
                    'status' => ArticleStatus::Published,
                    'author_id' => $author->id,
                    'category_id' => Category::where('slug', $categorySlug)->value('id'),
                ],
            );

            $article->tags()->sync(Tag::whereIn('slug', $tags)->pluck('id'));
        }
    }

    private function seedGallery(): void
    {
        $album = Album::updateOrCreate(
            ['slug' => 'forum-kolaborasi-2026'],
            ['name_id' => 'Forum Kolaborasi 2026', 'name_en' => 'Collaboration Forum 2026'],
        );

        $items = [
            ['Forum Kolaborasi Multipihak', 'Multi-Stakeholder Collaboration Forum',
                'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=1200&h=800&fit=crop&auto=format'],
            ['Sekolah Lapang SPPG Sawojajar', 'Field School at SPPG Sawojajar',
                'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=1200&h=800&fit=crop&auto=format'],
            ['Pengolahan Limbah Ternak', 'Livestock Waste Processing',
                'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&h=800&fit=crop&auto=format'],
        ];

        foreach ($items as $position => [$titleId, $titleEn, $url]) {
            GalleryItem::updateOrCreate(
                ['image_url' => $url],
                [
                    'album_id' => $album->id,
                    'title_id' => $titleId,
                    'title_en' => $titleEn,
                    'position' => $position,
                ],
            );
        }
    }
}
