import { bi, type Bi } from "@/lib/i18n";

export type NavItem = { label: Bi; to: string };

export const nav: NavItem[] = [
  { label: bi("Tentang", "About"), to: "/tentang" },
  { label: bi("Struktur", "Structure"), to: "/struktur" },
  { label: bi("Fokus", "Focus"), to: "/fokus" },
  { label: bi("Program", "Programs"), to: "/program" },
  { label: bi("Berita", "News"), to: "/berita" },
  { label: bi("Kontak", "Contact"), to: "/kontak" },
];

export const hero = {
  eyebrow: bi(
    "Community-Based Sustainable Agroindustry",
    "Community-Based Sustainable Agroindustry",
  ),
  title: bi(
    "Agroindustri berkelanjutan, bersama masyarakat.",
    "Sustainable agroindustry, with communities.",
  ),
  lead: bi(
    "Riset, teknologi, dan kolaborasi multipihak untuk agroindustri yang inklusif, inovatif, dan ramah lingkungan.",
    "Research, technology, and multi-stakeholder collaboration for agroindustry that is inclusive, innovative, and sustainable.",
  ),
  primaryCta: bi("Jelajahi program", "Explore programs"),
  secondaryCta: bi("Lihat dampak", "See our impact"),
};

export const pillars: { label: Bi; note: Bi }[] = [
  { label: bi("Inklusif", "Inclusive"), note: bi("Melibatkan komunitas", "Community at the center") },
  { label: bi("Inovatif", "Innovative"), note: bi("Riset ke hilirisasi", "Research to downstream") },
  { label: bi("Berdaya Saing", "Competitive"), note: bi("Bernilai tambah", "Value creation") },
  { label: bi("Ramah Lingkungan", "Sustainable"), note: bi("Ekonomi sirkular", "Circular economy") },
];

export const about = {
  kicker: bi("Tentang Kami", "About Us"),
  title: bi(
    "Menjembatani laboratorium dan lapangan.",
    "Bridging the lab and the field.",
  ),
  body: bi(
    "CoE CBSA di bawah FTAB Universitas Brawijaya mengubah hasil riset menjadi teknologi yang dipakai peternak, pelaku IKM, dan komunitas.",
    "Under FTAB Universitas Brawijaya, CoE CBSA turns research into technology used by farmers, small industries, and communities.",
  ),
  cta: bi("Selengkapnya tentang CoE CBSA", "More about CoE CBSA"),
  approaches: [
    {
      label: bi("Riset", "Research"),
      desc: bi(
        "Riset terapan agroindustri yang menjawab persoalan nyata peternak dan pelaku IKM di lapangan.",
        "Applied agroindustry research that answers real problems faced by farmers and small industries in the field.",
      ),
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=900&h=900&fit=crop&auto=format",
    },
    {
      label: bi("Teknologi", "Technology"),
      desc: bi(
        "Hilirisasi dan alih teknologi tepat guna, dari purwarupa laboratorium menjadi alat yang dipakai komunitas.",
        "Downstreaming and appropriate technology transfer, from lab prototypes to tools communities actually use.",
      ),
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&h=900&fit=crop&auto=format",
    },
    {
      label: bi("Pemberdayaan", "Empowerment"),
      desc: bi(
        "Penguatan kapasitas komunitas dan IKM melalui pendampingan berkelanjutan dan sekolah lapang.",
        "Strengthening community and SME capacity through continuous mentoring and field schools.",
      ),
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&h=900&fit=crop&auto=format",
    },
    {
      label: bi("Kolaborasi", "Collaboration"),
      desc: bi(
        "Mempertemukan akademik, pemerintah, perbankan, dan industri dalam satu ekosistem penta-helix.",
        "Bringing academia, government, banking, and industry together in one penta-helix ecosystem.",
      ),
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&h=900&fit=crop&auto=format",
    },
  ],
};

export type Focus = { no: string; title: Bi; desc: Bi };

export const focus = {
  kicker: bi("Fokus Keilmuan", "Focus Areas"),
  title: bi("Di mana kami bekerja.", "Where we work."),
  items: [
    {
      no: "01",
      title: bi("Ekonomi Sirkular", "Circular Economy"),
      desc: bi(
        "Valorisasi limbah organik menjadi produk bernilai — menutup lingkaran material.",
        "Valorizing organic waste into valuable products — closing the material loop.",
      ),
    },
    {
      no: "02",
      title: bi("Pengelolaan Limbah Organik", "Organic Waste Management"),
      desc: bi(
        "Budidaya maggot BSF dan konversi limbah ternak menjadi media tanam.",
        "BSF maggot farming and converting livestock waste into growing media.",
      ),
    },
    {
      no: "03",
      title: bi("Pemberdayaan & IKM", "Empowerment & SMEs"),
      desc: bi(
        "Hilirisasi teknologi ke komunitas champion dan penguatan industri kecil.",
        "Technology downstreaming to champion communities and small-industry strengthening.",
      ),
    },
    {
      no: "04",
      title: bi("Kolaborasi Multipihak", "Multi-Stakeholder Collaboration"),
      desc: bi(
        "Akademisi, pemerintah, industri, komunitas, dan perbankan dalam satu ekosistem.",
        "Academia, government, industry, community, and banking in one ecosystem.",
      ),
    },
    {
      no: "05",
      title: bi("Pertanian Berkelanjutan & SDGs", "Sustainable Agriculture & SDGs"),
      desc: bi(
        "Kontribusi nyata pada SDG 12, 13, dan 17.",
        "Tangible contributions to SDGs 12, 13, and 17.",
      ),
    },
  ] as Focus[],
};

export type Program = {
  tag: Bi;
  title: Bi;
  place: Bi;
  desc: Bi;
  funder: Bi;
  image: string;
  status: "ongoing" | "planned" | "completed";
  details?: Bi;
};

export const programs = {
  kicker: bi("Program Unggulan", "Flagship Programs"),
  title: bi("Program yang berjalan di lapangan.", "Programs running in the field."),
  items: [
    {
      tag: bi("InsaIntek · Kemendikti", "InsaIntek · Kemendikti"),
      title: bi(
        "Ekosistem Ekonomi Sirkular Maggot BSF",
        "BSF Maggot Circular-Economy Ecosystem",
      ),
      place: bi("Malang Raya", "Greater Malang"),
      desc: bi(
        "Menautkan penyedia limbah, pengolah, pengguna, dan regulator menjadi rantai pasok maggot yang utuh — dengan Sekolah Lapang di SPPG Sawojajar.",
        "Linking waste providers, processors, users, and regulators into a complete maggot supply chain — with a Field School at SPPG Sawojajar.",
      ),
      funder: bi("Pendanaan Ditjen Sains & Teknologi", "Funded by Ditjen Sains & Teknologi"),
      image:
        "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=1200&h=900&fit=crop&auto=format",
      status: "ongoing",
      details: bi(
        "Penyedia limbah, pengolah, pengguna, dan regulator dibina melalui Forum Kolaborasi, Sekolah Lapang, Podcast, BSF Challenges, dan Gebyar.",
        "Waste providers, processors, users, and regulators are connected through the Collaboration Forum, Field School, Podcast, BSF Challenges, and Gebyar.",
      ),
    },
    {
      tag: bi("Program 3M · Bank Indonesia", "3M Program · Bank Indonesia"),
      title: bi(
        "Limbah Ternak Menjadi Media Tanam",
        "Livestock Waste into Growing Media",
      ),
      place: bi("Bojonegoro & Kota Malang", "Bojonegoro & Malang City"),
      desc: bi(
        "Kolaborasi 3M bersama KTT USTAN Mandiri dan Bank Indonesia: kotoran sapi difermentasi (EM4 + SERMA) menjadi media tanam berkelanjutan.",
        "A 3M collaboration with KTT USTAN Mandiri and Bank Indonesia: cattle manure fermented (EM4 + SERMA) into sustainable growing media.",
      ),
      funder: bi("Mendukung SDG 12, 13, 17", "Supporting SDGs 12, 13, 17"),
      image:
        "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=1200&h=900&fit=crop&auto=format",
      status: "ongoing",
      details: bi(
        "Kegiatan 3M mempertemukan Bank Indonesia, KTT USTAN Mandiri, dan komunitas untuk menghasilkan media tanam dari limbah ternak.",
        "The 3M activities bring together Bank Indonesia, KTT USTAN Mandiri, and communities to make growing media from livestock waste.",
      ),
    },
    {
      tag: bi("Disdagrin Manggarai Barat", "Disdagrin West Manggarai"),
      title: bi(
        "Penguatan IKM Berbasis Riset",
        "Research-Based SME Strengthening",
      ),
      place: bi("Manggarai Barat, NTT", "West Manggarai, NTT"),
      desc: bi(
        "Inisiasi kolaborasi UB dan Disdagrin untuk menguatkan industri kecil melalui riset dan inovasi berkelanjutan.",
        "A UB–Disdagrin initiative to strengthen small industries through research and sustainable innovation.",
      ),
      funder: bi("Kemitraan daerah", "Regional partnership"),
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&h=900&fit=crop&auto=format",
      status: "planned",
      details: bi(
        "Program ini disiapkan bersama mitra daerah untuk memperkuat kapasitas industri kecil berbasis riset dan inovasi.",
        "This program is being prepared with regional partners to strengthen research- and innovation-based small industries.",
      ),
    },
  ] as Program[],
};

export const bsfDetail = {
  clustersLabel: bi("Empat klaster pemangku kepentingan", "Four stakeholder clusters"),
  clusters: [
    { title: bi("Penyedia Limbah", "Waste Providers"), desc: bi("Dinas terkait, SPPG, DLH.", "Relevant agencies, SPPG, DLH.") },
    { title: bi("Pengolah", "Processors"), desc: bi("Peternak maggot & tim teknologi kampus.", "Maggot farmers & campus tech team.") },
    { title: bi("Pengguna", "Users"), desc: bi("Peternak ikan & ternak.", "Fish & livestock farmers.") },
    { title: bi("Regulator", "Regulators"), desc: bi("Pembuat kebijakan.", "Policymakers.") },
  ],
  seriesLabel: bi("Rangkaian kegiatan 2026, Agustus–November", "2026 activity series, August–November"),
  series: [
    bi("Forum Kolaborasi", "Collaboration Forum"),
    bi("Sekolah Lapang", "Field School"),
    bi("Podcast", "Podcast"),
    bi("BSF Challenges", "BSF Challenges"),
    bi("Gebyar", "Gebyar"),
  ] as Bi[],
};

export type Stat = { value: string; label: Bi };

export const impact = {
  kicker: bi("Proyek & Dampak", "Projects & Impact"),
  title: bi(
    "Dampak nyata, terukur di lapangan.",
    "Real impact, measured in the field.",
  ),
  lead: bi(
    "Dari valorisasi limbah hingga penguatan komunitas, kami menjadikan Malang Raya prototipe ekosistem agroindustri sirkular berbasis komunitas.",
    "From waste valorization to community strengthening, we are making Greater Malang a prototype for community-based circular agroindustry.",
  ),
  stats: [
    { value: "5", label: bi("Klaster kegiatan 2026", "Activity clusters, 2026") },
    { value: "4", label: bi("Klaster pemangku kepentingan", "Stakeholder clusters") },
    { value: "~70", label: bi("Peserta Forum Kolaborasi", "Collaboration Forum participants") },
    { value: "3", label: bi("Wilayah proyek aktif", "Active project regions") },
  ] as Stat[],
  sdgs: [
    {
      code: "12",
      label: bi("Konsumsi & Produksi", "Responsible Consumption"),
      description: bi(
        "Program mengubah limbah organik menjadi input bernilai dan mengurangi sisa material.",
        "The programs turn organic waste into valuable inputs while reducing material waste.",
      ),
    },
    {
      code: "13",
      label: bi("Aksi Iklim", "Climate Action"),
      description: bi(
        "Pengelolaan limbah dan pertanian sirkular membantu menekan dampak lingkungan.",
        "Waste management and circular agriculture help reduce environmental impact.",
      ),
    },
    {
      code: "17",
      label: bi("Kemitraan", "Partnerships"),
      description: bi(
        "Forum multipihak menghubungkan kampus, pemerintah, komunitas, dan perbankan.",
        "Multi-stakeholder forums connect campus, government, communities, and banking.",
      ),
    },
  ],
  feature: {
    title: bi("Ekosistem Sirkular Maggot BSF", "BSF Maggot Circular Ecosystem"),
    place: bi("Malang Raya", "Greater Malang"),
    note: bi(
      "Sekolah Lapang di SPPG Sawojajar menautkan penyedia limbah, pengolah, pengguna, dan regulator.",
      "A Field School at SPPG Sawojajar links waste providers, processors, users, and regulators.",
    ),
    image:
      "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1000&h=800&fit=crop&auto=format",
  },
};

export type Article = {
  date: Bi;
  category: Bi;
  title: Bi;
  image: string;
};

export const news = {
  kicker: bi("Berita Terbaru", "Latest News"),
  title: bi("Kabar dari lapangan.", "News from the field."),
  cta: bi("Semua berita", "All news"),
  items: [
    {
      date: bi("27 Agustus 2026", "27 August 2026"),
      category: bi("Program", "Program"),
      title: bi(
        "Forum Kolaborasi Multipihak pertemukan 70 pemangku kepentingan maggot BSF",
        "Multi-Stakeholder Forum convenes 70 BSF maggot stakeholders",
      ),
      image:
        "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=600&fit=crop&auto=format",
    },
    {
      date: bi("29 Juni 2026", "29 June 2026"),
      category: bi("Kolaborasi", "Collaboration"),
      title: bi(
        "Kolaborasi 3M, CoE CBSA, dan BI Jatim majukan pertanian Bojonegoro",
        "3M, CoE CBSA, and BI East Java advance Bojonegoro agriculture",
      ),
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop&auto=format",
    },
    {
      date: bi("Juni 2026", "June 2026"),
      category: bi("Kemitraan", "Partnership"),
      title: bi(
        "UB dan Disdagrin Manggarai Barat inisiasi penguatan IKM berkelanjutan",
        "UB and Disdagrin West Manggarai initiate sustainable SME strengthening",
      ),
      image:
        "https://images.unsplash.com/photo-1595856619767-ab739fa7daae?w=800&h=600&fit=crop&auto=format",
    },
  ] as Article[],
};

export type PartnerGroup = { group: Bi; names: string[] };

export const partners = {
  kicker: bi("Mitra & Pemangku Kepentingan", "Partners & Stakeholders"),
  title: bi("Bekerja lintas sektor.", "Working across sectors."),
  groups: [
    {
      group: bi("Pemerintah", "Government"),
      names: ["Kemendikti · InsaIntek", "Disdagrin Manggarai Barat", "Pemkab Bojonegoro", "DLH", "SPPG"],
    },
    {
      group: bi("Perbankan", "Banking"),
      names: ["Bank Indonesia — Jawa Timur"],
    },
    {
      group: bi("Komunitas", "Community"),
      names: ["KTT USTAN Mandiri", "Kampung Lingkar Kampus"],
    },
    {
      group: bi("Akademik", "Academic"),
      names: ["Universitas Brawijaya", "FTAB", "Program 3M"],
    },
  ] as PartnerGroup[],
};

export const mission = {
  statement: bi(
    "CoE CBSA mengintegrasikan riset, teknologi, pemberdayaan masyarakat, dan kolaborasi multipihak untuk menghasilkan solusi agroindustri yang inklusif, inovatif, berdaya saing, dan ramah lingkungan.",
    "CoE CBSA integrates research, technology, community empowerment, and multi-stakeholder collaboration to deliver agroindustry solutions that are inclusive, innovative, competitive, and environmentally sound.",
  ),
  vision: bi(
    "Menjadi pusat unggulan agroindustri berkelanjutan berbasis masyarakat yang menjembatani riset dan dampak nyata.",
    "To be a center of excellence in community-based sustainable agroindustry that bridges research and real-world impact.",
  ),
};

export type Person = {
  name: string;
  role: Bi;
  division: Bi;
  history: Bi;
  /** Temporary mockup portraits until official staff photos are uploaded. */
  photo?: string;
};

export const people: Person[] = [
  {
    name: "Dr. Dodyk Pranowo, STP, M.Si",
    role: bi("Ketua CoE CBSA", "Head of CoE CBSA"),
    division: bi("Pimpinan", "Leadership"),
    history: bi(
      "Memimpin arah CoE CBSA dan pengembangan hilirisasi teknologi berbasis kolaborasi multipihak.",
      "Leads CoE CBSA and its technology commercialisation work through multi-stakeholder collaboration.",
    ),
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=720&h=900&fit=crop&auto=format",
  },
  {
    name: "Hendri Cahya Aprilianto, S.TP., M.T., Ph.D",
    role: bi("Sekretaris", "Secretary"),
    division: bi("Pimpinan", "Leadership"),
    history: bi(
      "Mendukung koordinasi administrasi, program, dan jejaring kolaborasi CoE CBSA.",
      "Supports administrative coordination, programs, and CoE CBSA collaboration networks.",
    ),
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=720&h=900&fit=crop&auto=format",
  },
  {
    name: "Nur Lailatul Rahmah, S.Si, M.Si., Ph.D",
    role: bi("Ketua Divisi Riset dan Inovasi Agroindustri", "Head, Agroindustry Research & Innovation Division"),
    division: bi("Riset & Inovasi", "Research & Innovation"),
    history: bi(
      "Mengawal riset dan inovasi agroindustri agar dapat diterapkan dan memberi dampak di lapangan.",
      "Guides agroindustry research and innovation toward practical field impact.",
    ),
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=720&h=900&fit=crop&auto=format",
  },
];

export type ContactDetail = { label: Bi; value: Bi; href: string; icon: string };

export const contact = {
  kicker: bi("Kontak", "Contact"),
  title: bi("Mari berkolaborasi.", "Let's collaborate."),
  body: bi(
    "Terbuka untuk kemitraan riset, hilirisasi teknologi, dan program pemberdayaan masyarakat.",
    "Open to research partnerships, technology downstreaming, and community empowerment programs.",
  ),
  cta: bi("Hubungi kami", "Get in touch"),
  details: [
    {
      label: bi("Alamat", "Address"),
      value: bi(
        "Laboratorium Kewirausahaan FTAB UB Lt.2, Jl. Veteran, Kec. Lowokwaru, Kota Malang",
        "FTAB UB Entrepreneurship Lab 2nd Fl., Jl. Veteran, Lowokwaru, Malang City",
      ),
      href: "https://maps.app.goo.gl/GdRLHxxe7QovXS4W6",
      icon: "map",
    },
    {
      label: bi("WhatsApp", "WhatsApp"),
      value: bi("+62 857-0197-7439", "+62 857-0197-7439"),
      href: "https://wa.me/6285701977439",
      icon: "phone",
    },
    {
      label: bi("Email", "Email"),
      value: bi("coe.cbsa@ub.ac.id", "coe.cbsa@ub.ac.id"),
      href: "mailto:coe.cbsa@ub.ac.id",
      icon: "mail",
    },
    {
      label: bi("Instagram", "Instagram"),
      value: bi("@coe_cbsa", "@coe_cbsa"),
      href: "https://www.instagram.com/coe_cbsa",
      icon: "instagram",
    },
  ] as ContactDetail[],
};
