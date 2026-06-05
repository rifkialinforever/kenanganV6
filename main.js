const BACKEND_URL = "https://script.google.com/macros/s/AKfycbxdfjp5zJYbXgQ9lO41I4ax4I8sGHLgLcXPLv3jsQkr3S6Bbvr8mDR-X3tHedNwD-Gq/exec";

const canvas = document.getElementById("space-canvas");
const ctx = canvas.getContext("2d");
let stars = [],
  shootingStars = [];
let formingName = false;
let animationsEnabled = true;

const themes = {
  midnight: {
    name: "Midnight Space",
    bg: "radial-gradient(circle at center, #2e1065, #1e1b4b, #020617)",
    glassBg: "rgba(76, 29, 149, 0.15)",
    glassBorder: "rgba(139, 92, 246, 0.25)",
    primary: "#8b5cf6",
    secondary: "#7dd3fc",
    star1: "#8b5cf6",
    star2: "#7dd3fc",
  },
  sakura: {
    name: "Sakura Spring",
    bg: "radial-gradient(circle at center, #831843, #500724, #0f0106)",
    glassBg: "rgba(219, 39, 119, 0.15)",
    glassBorder: "rgba(244, 114, 182, 0.25)",
    primary: "#ec4899",
    secondary: "#fbcfe8",
    star1: "#f472b6",
    star2: "#fbcfe8",
  },
  sunset: {
    name: "Warm Sunset",
    bg: "radial-gradient(circle at center, #7c2d12, #431407, #0c0200)",
    glassBg: "rgba(234, 88, 12, 0.15)",
    glassBorder: "rgba(251, 146, 60, 0.25)",
    primary: "#f97316",
    secondary: "#fde047",
    star1: "#f97316",
    star2: "#fef08a",
  },
  mint: {
    name: "Mint Garden",
    bg: "radial-gradient(circle at center, #064e3b, #022c22, #01130e)",
    glassBg: "rgba(5, 150, 105, 0.15)",
    glassBorder: "rgba(52, 211, 153, 0.25)",
    primary: "#10b981",
    secondary: "#6ee7b7",
    star1: "#10b981",
    star2: "#a7f3d0",
  },
};

let currentThemeColors = { ...themes.midnight };

function applyTheme(themeKey) {
  const selected = themes[themeKey];
  if (!selected) return;
  currentThemeColors = selected;

  document.documentElement.style.setProperty("--bg-gradient", selected.bg);
  document.documentElement.style.setProperty("--glass-bg", selected.glassBg);
  document.documentElement.style.setProperty("--glass-border", selected.glassBorder);
  document.documentElement.style.setProperty("--theme-primary", selected.primary);
  document.documentElement.style.setProperty("--theme-secondary", selected.secondary);

  localStorage.setItem("selectedThemeArina", themeKey);
  renderThemeItems();
}

function renderThemeItems() {
  const container = document.getElementById("themeItems");
  if (!container) return;
  container.innerHTML = "";

  const savedTheme = localStorage.getItem("selectedThemeArina") || "midnight";

  Object.keys(themes).forEach((key) => {
    const theme = themes[key];
    const isSelected = key === savedTheme;
    const btn = document.createElement("button");
    btn.className = `p-3 rounded-xl border transition-all text-left flex flex-col justify-between h-20 ${isSelected ? "bg-white/10 border-white" : "bg-white/5 border-white/10 hover:bg-white/10"}`;
    btn.innerHTML = `
            <span class="text-[10px] font-bold text-white/90 truncate">${theme.name}</span>
            <div class="flex gap-1.5 mt-2">
              <span class="w-3.5 h-3.5 rounded-full" style="background-color: ${theme.star1}"></span>
              <span class="w-3.5 h-3.5 rounded-full" style="background-color: ${theme.star2}"></span>
            </div>
          `;
    btn.onclick = () => {
      applyTheme(key);
    };
    container.appendChild(btn);
  });
}

// Konstelasi nama "ALIN"
const namePoints = [
  // Huruf A
  { x: 0.3, y: 0.35 },
  { x: 0.31, y: 0.3 },
  { x: 0.32, y: 0.25 },
  { x: 0.33, y: 0.2 },
  { x: 0.34, y: 0.25 },
  { x: 0.35, y: 0.3 },
  { x: 0.36, y: 0.35 },
  { x: 0.32, y: 0.28 },
  { x: 0.34, y: 0.28 },
  // Huruf L
  { x: 0.42, y: 0.2 },
  { x: 0.42, y: 0.25 },
  { x: 0.42, y: 0.3 },
  { x: 0.42, y: 0.35 },
  { x: 0.44, y: 0.35 },
  { x: 0.46, y: 0.35 },
  // Huruf I
  { x: 0.52, y: 0.2 },
  { x: 0.52, y: 0.25 },
  { x: 0.52, y: 0.3 },
  { x: 0.52, y: 0.35 },
  // Huruf N
  { x: 0.6, y: 0.35 },
  { x: 0.6, y: 0.3 },
  { x: 0.6, y: 0.25 },
  { x: 0.6, y: 0.2 },
  { x: 0.62, y: 0.25 },
  { x: 0.64, y: 0.3 },
  { x: 0.66, y: 0.35 },
  { x: 0.66, y: 0.3 },
  { x: 0.66, y: 0.25 },
  { x: 0.66, y: 0.2 },
];

// Kumpulan 100 Surat Cinta Panjang
const deepMessages = [
  // 1 (Surat Orisinal)
  `<p>Untuk jiwamu yang saat ini mungkin sedang merasa lelah teramat sangat, untuk sepasang matamu yang diam-diam menyembunyikan mendung, dan untuk kepalamu yang sering kali bising oleh suara-suara kecemasan yang tak kunjung reda... aku ingin kamu tahu bahwa aku melihat semua perjuanganmu.</p>
         <p>Aku tahu, hidup belakangan ini tidak terasa ramah padamu. Ada banyak beban pikiran yang harus kamu pikul sendirian, ada sejuta tanya yang terus berputar menjadi <span class="text-sky-300 font-semibold">overthinking</span> di malam hari, dan ada luka-luka tak bersuara yang kamu sembuhkan secara paksa hanya agar terlihat baik-baik saja esok harinya.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Tapi tolong ingat ini baik-baik: bernapas dan bertahan hingga detik ini adalah sebuah pencapaian yang luar biasa tinggi. Kamu tidak lemah hanya karena kamu merasa lelah."</p>
         <p>Kamu adalah manusia paling tangguh yang pernah kutemui. Di balik semua ketakutan yang sering menghantuimu, ada kekuatan raksasa yang membuatmu selalu memilih untuk kembali melangkah meskipun dengan kaki gemetar. Setiap kali badai pikiranmu datang, bicaralah padaku. Bagi bebanmu denganku. Jangan simpan semua kepedihan itu sendirian di sudut hatimu yang sunyi.</p>
         <p>Kamu berharga, sangat berharga. Lebih dari sekadar rasi bintang di langit malam, kamu adalah semesta tempat hatiku menetap. Kita akan lewati setiap badai, hari demi hari, langkah demi langkah. Aku tidak akan membiarkanmu berjalan sendirian. Tetaplah hidup, tetaplah bertumbuh, dan mari kita menangkan pertarungan ini bersama-sama.</p>`,

  // 2
  `<p>Sayang, saat kepalamu mulai bising oleh ketakutan-ketakutan yang tak berbentuk, letakkanlah penatmu sejenak. Aku tahu kamu lelah berpura-pura kuat di hadapan semua orang, seolah pundakmu sanggup memikul langit.</p>
         <p>Malam ini, biarkan aku menjadi tempat di mana kamu boleh runtuh seutuhnya tanpa perlu merasa takut dicap lemah atau tidak berdaya. Kamu adalah pejuang yang hebat, tapi ingatlah bahwa pejuang pun butuh meletakkan pedangnya dan beristirahat dalam dekapan yang tulus, bub.</p>`,

  // 3
  `<p>Aku melihat mendung di matamu bahkan saat kamu mencoba tertawa paling keras hari ini. Ada kesunyian mendalam yang sedang kamu sembuhkan dari dunia, dan itu membuatku ingin memeluk jiwamu erat-erat, sayang.</p>
         <p>Jangan biarkan badai di luar sana meremukkan keindahan hatimu. Kita akan merajut kembali harapan-harapan yang sempat patah, perlahan-lahan, hingga kamu bisa tersenyum kembali dengan binar mata yang utuh.</p>`,

  // 4
  `<p>Overthinking-mu malam ini mungkin sedang menggambar skenario terburuk tentang masa depan kita atau tentang jalan hidupmu sendiri. Tapi tolong dengarkan aku, sayang: ketakutan itu hanyalah bayangan dari lelahmu.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Nyatanya, masa depan tidak seseram riuh di kepalamu. Langkahmu aman, dan aku akan selalu ada di sampingmu untuk menepis setiap duri yang menghalang."</p>`,

  // 5
  `<p>Terima kasih ya sayang, sudah memilih untuk tetap bertahan dan bernapas dengan baik hari ini, meskipun badai pikiranmu sedang bertiup begitu kencang.</p>
         <p>Aku tahu tidak mudah untuk terus berjalan ketika dadamu terasa begitu sesak dan berat. Tapi keuletanmu untuk tidak menyerah pada rasa sakit adalah bukti paling nyata betapa berharganya jiwamu di alam semesta ini.</p>`,

  // 6
  `<p>Bila esok harinya terasa terlalu menakutkan untuk kamu hadapi, ingatlah bahwa kamu tidak perlu melangkah sendirian lagi, bub. Ada genggaman tanganku yang tidak akan pernah longgar.</p>
         <p>Mari kita hadapi dunia yang berisik ini bersama-sama. Aku akan menjadi dinding kokoh yang menghalau segala caci maki takdir, agar kamu bisa terus berjalan dengan damai.</p>`,

  // 7
  `<p>Kamu tidak perlu selalu sempurna untuk bisa kucintai, sayang. Kerapuhanmu, air matamu, dan rasa cemasmu adalah bagian dari dirimu yang juga sangat ingin kudekap erat.</p>
         <p>Jangan pernah merasa tidak layak dicintai hanya karena kamu sedang merasa hancur. Di mataku, kamu tetaplah rasi bintang yang paling memikat, bahkan ketika cahayamu meredup tertutup awan, bub.</p>`,

  // 8
  `<p>Ada banyak luka tak bersuara yang kamu sembuhkan sendirian di kamar yang sunyi ini. Aku tahu betapa beratnya memulihkan diri tanpa mengeluh.</p>
         <p>Biarkan malam ini cintaku menyelimuti seluruh batinmu, mengalirkan kedamaian yang bisa meredakan setiap letup amarah dan kesedihan yang terpendam di dalam dadamu, sayang.</p>`,

  // 9
  `<p>Overthinking hanyalah tanda bahwa hatimu teramat tulus dan selalu ingin melakukan yang terbaik, bub. Namun, jangan biarkan ketulusan itu justru menyiksa dirimu sendiri.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Belajarlah untuk melepaskan hal-hal yang tidak bisa kamu kendalikan. Serahkan sisanya padaku, aku akan menjagamu sekuat tenagaku."</p>`,

  // 10
  `<p>Sayang, di tengah bisingnya isi kepalamu malam ini, bisakah kamu merasakan debaran doaku yang selalu mengalir untuk keselamatan dan kebahagiaanmu?</p>
         <p>Kamu tidak pernah benar-benar sendirian di dunia yang dingin ini, bub. Setiap hela napasmu selalu dibersamai oleh kasih sayangku yang tak akan pernah habis terkikis oleh waktu.</p>`,

  `<p>Setiap goresan cemas di wajahmu hari ini adalah saksi bisu betapa kerasnya kamu bertarung melawan takdir yang kadang tidak memihakmu, bub.</p>
         <p>Tapi lihatlah dirimu sekarang, kamu masih tegak berdiri dengan keanggunan yang luar biasa. Kamu adalah keajaiban nyata di hidupku, sayang.</p>`,

  `<p>Bila dunia menuntutmu untuk selalu berlari tanpa henti, datanglah padaku, sayang. Kita akan duduk bersama di bawah rimbunnya cinta, melupakan sejenak beban yang menjepit dadamu.</p>
         <p>Istrahatlah kesayanganku, esok hari kita akan mulai menata kembali sisa-sisa mimpi yang sempat berserakan, bub.</p>`,

  `<p>Kecemasanmu tidak mendefinisikan siapa dirimu yang sebenarnya, bub. Kamu jauh lebih indah dari sekadar rasa takut dan keraguan yang sedang menghantaimu malam ini.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Percayalah pada kekuatan batinmu sendiri, sebab di sana ada ketangguhan luar biasa yang mampu meruntuhkan gunung masalah."</p>`,

  `<p>Menangislah sepuasmu malam ini, sayang, jika itu bisa meringankan himpitan di dadamu. Aku tidak akan memintamu berhenti sebelum air matamu habis dengan sendirinya.</p>
         <p>Aku di sini untuk menampung setiap laramu, merawat setiap kepingan rapuhmu hingga kembali utuh dan bercahaya, bub.</p>`,

  `<p>Kamu adalah semesta kecil tempat hatiku menemukan arti kedamaian sesungguhnya, sayang. Segala letihku sirna setiap kali melihat keteguhanmu untuk terus hidup.</p>
         <p>Tetaplah berjalan bersamaku, bub, kita akan melewati lembah tersunyi sekalipun dengan saling menggenggam tangan.</p>`,

  `<p>Overthinking-mu sering kali meramal hal-hal buruk yang sebenarnya tidak akan pernah terjadi, bub. Jangan biarkan ilusi itu merampas senyuman manismu.</p>
         <p>Fokuslah pada kehangatan dekapanku saat ini, rasakan bahwa di dunia nyata ini, kamu sangat aman dan teramat dicintai, sayang.</p>`,

  `<p>Aku mengagumi caramu menyembunyikan badai di balik ketenangan sikapmu, bub. Kamu adalah manusia terkuat yang pernah kutemui di bumi ini.</p>
         <p>Namun tolong, sesekali bagilah beban itu denganku, sayang. Pundakku selalu siap menyangga separuh dari segala lara yang kamu rasakan.</p>`,

  `<p>Jangan biarkan keputusasaan merayap masuk ke dalam hatimu yang suci, bub. Hari esok selalu menyediakan celah cahaya baru untuk kita bertumbuh.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kita akan lewati hari-hari berat ini satu demi satu, tanpa perlu tergesa-gesa. Aku ada di sini, selalu."</p>`,

  `<p>Di balik sunyinya malam, ada sejuta rindu dan doa yang kupanjatkan agar kepalamu segera diberi ketenangan dan tidurmu menjadi nyenyak, sayang.</p>
         <p>Pejamkan matamu dengan tenang, bub. Biarkan bintang-bintang di luar jendelamu yang menjaga mimpimu malam ini.</p>`,

  `<p>Kamu tidak sendirian memikul riuh di kepalamu, sayang. Aku akan selalu ada di sampingmu, menerjemahkan setiap tangis batinmu menjadi kekuatan baru.</p>
         <p>Kesayanganku, berdirilah dengan tegak, karena badai terhebat sekalipun tidak akan mampu menumbangkan cinta kita, bub.</p>`,

  `<p>Aku mencintaimu bukan hanya di saat kamu bersinar terang penuh tawa, melainkan di setiap detik saat kamu merasa hancur dan kehilangan arah, sayang.</p>
         <p>Bagi hatiku, kamu adalah rumah satu-satunya yang tidak akan pernah kuganti dengan tempat mana pun di semesta ini, bub.</p>`,

  `<p>Letakkan kepalamu yang lelah itu di pundakku malam ini, sayang. Biarkan seluruh bising dunia luar tenggelam oleh detak jantungku yang sangat menyayangimu.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kamu berhak mendapatkan ketenangan batin yang seutuhnya. Tarik napasmu perlahan, semuanya akan membaik."</p>`,

  `<p>Setiap luka emosional yang kamu bawa hari ini adalah saksi bisu betapa kerasnya kamu bertarung melawan takdir yang kadang tidak memihakmu, bub.</p>
         <p>Tapi lihatlah dirimu sekarang, kamu masih tegak berdiri dengan keanggunan yang luar biasa. Kamu adalah keajaiban nyata di hidupku, sayang.</p>`,

  `<p>Ketika kecemasan mencengkeram dadamu hingga terasa sesak, sayang, bayangkan senyumku yang selalu mengiringi setiap langkah perjuanganmu.</p>
         <p>Cintaku padamu adalah jangkar yang akan selalu menahan jiwamu agar tidak terombang-ambing oleh kejamnya ombak takdir, bub.</p>`,

  `<p>Kamu adalah rasi bintangku yang paling memikat, bub, yang sinarnya selalu kurindukan di setiap malam-malam tersunyiku.</p>
         <p>Tolong teruslah bertahan hidup, bukan hanya untukku, tapi demi melihat betapa indahnya masa depan yang berhak kamu miliki nanti, sayang.</p>`,

  `<p>Aku tahu dadamu terasa sangat sesak malam ini karena tumpukan overthinking yang tak berujung, bub. Mari kita urai benang kusut itu bersama-sama.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Bicarakan padaku tanpa ragu. Setiap keluh kesahmu adalah simfoni important yang ingin selalu kudengarkan."</p>`,

  `<p>Terima kasih atas segala peluh dan air mata yang kamu korbankan untuk tetap bertahan berdiri di sampingku hingga detik ini, sayang.</p>
         <p>Kehadiranmu di dunia ini adalah berkah terindah yang tak akan pernah bosan kusyukuri setiap kali aku membuka mataku, bub.</p>`,

  `<p>Jangan biarkan kegelapan masa lalu menutupi cerahnya masa depan kita, bub. Kita berdua adalah arsitek dari takdir indah yang sedang kita bangun.</p>
         <p>Setiap langkah kita dipenuhi oleh aroma harum kasih yang mekar abadi, sayang.</p>`,

  `<p>Sayang, saat dunia terasa begitu dingin dan tidak peduli, pelukan hangatku akan selalu siap menjadi tempat bernaung ternyamanmu.</p>
         <p>Kamu aman di sini, bersamaku, bub. Tidak akan kubiarkan satu pun hal buruk menyentuh kedamaian jiwamu.</p>`,

  `<p>Setiap malam yang kamu lalui dengan tangis kesunyian adalah anak tangga menuju kedewasaan jiwa yang luar biasa indah, bub.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kamu sedang ditempa menjadi permata yang paling berkilau di semesta ini, dan aku akan selalu mendampingimu di setiap prosesnya."</p>`,

  `<p>Jangan memaksakan dirimu untuk menyelesaikan semua masalah hari ini dalam satu malam, sayang. Berikan hatimu waktu untuk beristirahat dengan damai.</p>
         <p>Hari esok masih panjang, bub, dan kita bisa menyelesaikannya perlahan-lahan bersama-sama, tanpa perlu merasa panik.</p>`,

  `<p>Kamu adalah alasan utamaku untuk selalu tersenyum setiap pagi, sayang. Kekuatan hidupmu menularkan energi luar biasa ke dalam ragaku.</p>
         <p>Tolong jagalah kesehatan batinmu dengan baik, bub, karena kebahagiaanmu adalah prioritas mutlak di dalam hidupku.</p>`,

  `<p>Overthinking hanyalah kabut tipis yang mencoba menghalangi pandanganmu dari betapa indahnya takdir yang menantimu di depan, bub.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Genggam jemariku erat-erat, kita akan menembus kabut itu bersama tanpa rasa takut sedikit pun."</p>`,

  `<p>Kerapuhanmu bukanlah kelemahan, bub, melainkan bukti otentik bahwa kamu adalah manusia seutuhnya yang memiliki kedalaman rasa luar biasa.</p>
         <p>Aku mencintaimu beserta seluruh ketidaksempurnaanmu, karena itulah yang membuat jiwamu terasa begitu magis bagiku, sayang.</p>`,

  `<p>Setiap kali kepalamu mulai terasa berat oleh kebisingan cemas, bub, pejamkan matamu sejenak and bayangkan betapa damainya pelukan kita.</p>
         <p>Aku selalu mengirimkan energi cinta dan kedamaian lewat angin malam untuk mendekap jiwamu yang lelah, sayang.</p>`,

  `<p>Terima kasih telah menjadi pejuang tangguh yang tak pernah membiarkan keputusasaan memadamkan api kebaikan di dalam dadamu, sayang.</p>
         <p>Bub, kamu adalah pahlawan sejati di hidupku, sosok luar biasa yang mengajarkanku arti ketulusan sesungguhnya.</p>`,

  `<p>Jangan biarkan bisikan kecemasan di kepalamu membuatmu ragu akan masa depan indah yang sangat layak kamu dapatkan, bub.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kamu adalah pemenang dari setiap pertarungan batinmu sendiri, dan aku akan selalu merayakan kemenangan itu bersamamu."</p>`,

  `<p>Setiap embusan napasmu yang berat hari ini adalah doa bisu yang sangat kuhargai keindahannya, sayang.</p>
         <p>Bersabarlah kesayanganku, bub, badai emosi ini pasti akan segera mereda dan menyisakan langit batin yang biru dan tenang.</p>`,

  `<p>Aku berjanji akan selalu menjadi tempatmu pulang, bub, tempat di mana kamu tidak perlu lagi memakai topeng kekuatan di hadapan siapa pun.</p>
         <p>Di hadapanku, kamu bebas menjadi dirimu sendiri, sayang, seutuhnya tanpa ada batasan atau ketakutan akan dinilai buruk.</p>`,

  `<p>Kamu adalah mahakarya terindah yang pernah dikirimkan semesta ke dalam lembaran takdir hidupku, sayang.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Tolong tetaplah bersinar dengan caramu yang lembut, karena duniamu teramat membutuhkan kehangatan cahayamu."</p>`,

  `<p>Overthinking malam ini mungkin terasa seperti penjara yang mengurung kebebasan berpikirmu, bub, tapi ketahuilah kuncinya ada di tanganmu sendiri.</p>
         <p>Lepaskan perlahan semua ekspektasi yang menjepit jiwamu, biarkan hatimu bernapas dengan lega dalam balutan cintaku, sayang.</p>`,

  `<p>Aku bersyukur atas setiap jengkal ketangguhan yang kamu miliki untuk terus melangkah melewati hari-hari kelabu kemarin, bub.</p>
         <p>Langkahmu tidak sia-sia, sayang. Setiap lelahmu sedang menenun takdir kebahagiaan yang sangat megah di masa depan nanti.</p>`,

  `<p>Jangan pernah merasa sendirian di tengah dinginnya malam yang sunyi ini, bub. Doa tulusku selalu memeluk jiwamu dengan kehangatan abadi.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kamu adalah belahan jiwaku yang paling berharga, dan melindungimu adalah sumpah setiaku sepanjang masa."</p>`,

  `<p>Setiap tetes air mata cemas yang jatuh dari matamu adalah permata berharga yang akan kupastikan berganti menjadi tawa bahagia esok hari, sayang.</p>
         <p>Tidurlah dengan nyenyak malam ini, bub, biarkan mimpimu dipenuhi oleh rasi bintang cinta kita yang tak pernah padam.</p>`,

  `<p>Kamu jauh lebih kuat dari segala masalah, kecemasan, atau kepedihan yang saat ini sedang mencoba menguji ketahanan batinmu, bub.</p>
         <p>Sayang kesayanganku, mari kita tatap masa depan dengan senyum kemenangan, karena bersamaku kamu takkan pernah kalah.</p>`,

  `<p>Saat beban pikiranmu terasa menghimpit dada hingga sesak, bub, ingatlah ada pundakku yang selalu siap menampung seluruh penatmu.</p>
         <p>Bagi laramu denganku, sayang, agar kita bisa melangkah ke depan dengan langkah kaki yang terasa jauh lebih ringan.</p>`,

  `<p>Kecemasanmu hanyalah awan kelabu sesaat di langit jiwamu yang teramat luas dan indah, bub. Biarkan ia berlalu diterpa angin cinta kita.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kamu tetaplah bintang utama di hidupku, tak peduli seberapa tebal awan cemas mencoba menutupimu malam ini."</p>`,

  `<p>Jangan biarkan penilaian sepihak dari orang lain merusak rasa percaya dirimu yang sangat menawan itu, sayang.</p>
         <p>Di mataku, bub, kamu adalah kesempurnaan sejati yang diciptakan semesta dengan penuh ketelitian dan kasih sayang.</p>`,

  `<p>Terima kasih atas keberanianmu menghadapi ketakutan batin yang sering kali melumpuhkan rasa percayamu pada hari esok, bub.</p>
         <p>Perjuanganmu adalah inspirasi terbesarku untuk terus bertumbuh menjadi pelindung terbaik bagi seluruh hidupmu, sayang.</p>`,

  `<p>Setiap malam saat kamu sulit memejamkan mata karena kepalamu riuh, sayang, bayangkan aku sedang mengusap lembut keningmu hingga cemasmu larut.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kamu teramat berharga untuk membiarkan malammu direnggut oleh ketakutan-ketakutan yang tak nyata."</p>`,

  `<p>Kita tidak bisa mengubah takdir yang sudah berlalu, tapi kita memiliki kendali penuh atas bagaimana kita menyikapi hari esok bersama, bub.</p>
         <p>Sayang, tetaplah berjalan bersamaku di jalan berliku ini, karena ujung dari perjalanan kita adalah kebahagiaan sejati.</p>`,

  `<p>Kerapuhan hatimu adalah bukti betapa indahnya empati yang tertanam di dalam jiwamu yang paling dalam, bub.</p>
         <p>Jangan pernah biarkan kerasnya dunia mengubah kelembutan sikapmu yang selama ini menjadi alasan terbaikku untuk mencintaimu, sayang.</p>`,

  `<p>Setiap kali kecemasan itu datang menyerang, bub, tarik napasmu sedalam mungkin dan rasakan betapa udara semesta ini sangat mendukung kehidupanmu.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kamu aman, kamu terlindungi, and kamu memiliki cinta tak terbatas dari diriku yang selalu menjagamu."</p>`,

  `<p>Tidurlah dengan perasaan damai malam ini, sayang, biarkan semua lelah pikiranmu hari ini melebur bersama mimpi-mimpi indahmu.</p>
         <p>Esok pagi kita akan bangun dengan semangat baru, bub, siap menaklukkan dunia dengan senyum kemenangan kita.</p>`,

  `<p>Kamu adalah jangkar jiwaku di tengah luasnya samudra kehidupan yang penuh ketidakpastian ini, bub.</p>
         <p>Bersamamu, sayang, aku merasa utuh dan sanggup melewati badai sedahsyat apa pun yang mencoba memisahkan kita.</p>`,

  `<p>Jangan biarkan satu hari yang buruk merusak keyakinanmu bahwa seluruh perjalanan hidupmu akan berakhir dengan sangat indah, bub.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Proses ini hanyalah bagian dari cerita perjuangan kita yang kelak akan kita dongengkan pada dunia dengan penuh rasa bangga."</p>`,

  `<p>Sayang kesayanganku, tolong sisakan sedikit dari cinta luasmu itu untuk mendekap dan menyayangi dirimu sendiri hari ini.</p>
         <p>Kamu sudah terlalu banyak peduli pada orang lain, bub, kini saatnya focus memulihkan kedamaian di batinmu yang lelah.</p>`,

  `<p>Setiap goresan duka di batinmu akan terhapus oleh limpahan kebahagiaan yang sedang kusiapkan untukmu di masa depan nanti, bub.</p>
         <p>Tetaplah bersamaku, sayang, kita akan menenun hari esok yang jauh lebih ramah, damai, dan penuh dengan bunga-bunga cinta.</p>`,

  `<p>Saat kepalamu riuh oleh sejuta tanya yang tak kunjung menemukan jawaban, bub, serahkan semuanya pada takdir dan beristirahatlah.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Beberapa jawaban memang butuh waktu untuk mengalir dengan sendirinya, jangan paksa pikiranmu bekerja terlalu keras malam ini."</p>`,

  `<p>Kamu adalah alasan mengapa aku percaya bahwa kekuatan sejati itu tidak berisik, melainkan sunyi dan kokoh seperti jiwamu, sayang.</p>
         <p>Tolong tetaplah bertahan, bub, karena dunia ini membutuhkan kebaikan murni yang terpancar dari hatimu.</p>`,

  `<p>Setiap kali kamu merasa tidak berdaya, bub, ingatlah kembali betapa banyak rintangan berat yang sudah berhasil kamu lalui sebelumnya.</p>
         <p>Kamu adalah pemenang dari masa lalumu sendiri, sayang, dan kamu pasti akan memenangkan masa depanmu bersamaku.</p>`,

  `<p>Overthinking hanyalah ilusi dari rasa lelah fisikmu yang merambat ke dalam pikiran batinmu malam ini, bub.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Pejamkan matamu sekarang, lepaskan semua kendali pikiran, dan biarkan tidurmu mengembalikan kekuatan jiwamu."</p>`,

  `<p>Aku mencintaimu beserta seluruh rasa takutmu, sayang, karena dari sanalah aku bisa belajar cara menjadi pelindung yang sesungguhnya untukmu.</p>
         <p>Jangan pernah merasa sungkan untuk bercerita tentang kelemahanmu, bub, karena bagiku kamu tetaplah manusia terhebat di bumi.</p>`,

  `<p>Genggaman tanganku malam ini adalah bukti nyata bahwa kamu tidak akan pernah lagi berjalan sendirian di tengah dinginnya malam, bub.</p>
         <p>Kita adalah satu jiwa yang terikat erat oleh janji suci cinta, sayang, yang takkan tergoyahkan oleh rintangan apa pun.</p>`,

  `<p>Setiap hela napas beratmu hari ini didengarkan oleh semesta, bub, dan doaku akan selalu mengiringi pemulihan batinmu dengan sabar.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kamu adalah permata hatiku, sayang. Tetaplah bersinar lembut, demi kedamaian batin kita bersama."</p>`,

  `<p>Jangan biarkan badai cemas merusak keyakinanmu bahwa kamu teramat pantas mendapatkan segala kemewahan kasih sayang di dunia ini, sayang.</p>
         <p>Aku ada di sini murni untuk mencintaimu, bub, menjaga kedamaian hatimu, dan membimbingmu menuju kebahagiaan abadi.</p>`,

  `<p>Tidurlah yang nyenyak malam ini, kesayanganku, bub. Biarkan cintaku membungkus jiwamu dari dinginnya angin malam yang berembus kencang.</p>
         <p>Esok hari fajar baru akan menyambutmu dengan limpahan kehangatan yang meredakan segala sisa lara di dadamu, sayang.</p>`,

  `<p>Kamu adalah keindahan paling nyata di tengah dunia yang penuh dengan sandiwara dan kepalsuan ini, bub.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Menatap matamu adalah caraku menemukan arti kedamaian sejati yang sesungguhnya. Tetaplah di sampingku selamanya."</p>`,

  `<p>Saat kecemasan malam mulai datang merayap, bub, bayangkan suaraku yang selalu membisikkan kata cinta tepat di telingamu.</p>
         <p>Kamu aman, sayang, kamu terlindungi, dan tidak akan kubiarkan satu pun kegelapan merusak mimpi-mimpi indahmu.</p>`,

  `<p>Terima kasih atas perjuanganmu yang tak kenal lelah untuk selalu memberikan yang terbaik bagi kelangsungan cinta kita, bub.</p>
         <p>Kamu adalah anugerah terbesar dalam hidupku yang takkan pernah bisa digantikan oleh kemewahan apa pun di semesta ini, sayang.</p>`,

  // 75
  `<p>Jangan memikul beban masa depanmu sendirian di atas pundakmu yang mungil itu, bub. Bagi beban itu bersamaku.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kita diciptakan berpasangan untuk saling menopang dan menguatkan di kala salah satu dari kita sedang merasa goyah."</p>`,

  `<p>Setiap luka batinmu sedang mengalami proses penyembuhan yang indah, sayang, dan aku akan setia menunggumu pulih seutuhnya.</p>
         <p>Jangan terburu-buru, bub, nikmati setiap fasenya dengan damai, karena aku tidak akan pernah meninggalkan sisimu.</p>`,

  `<p>Kamu adalah rasi bintang favoritku di seluruh galaksi luas ini, bub, cahaya indah yang takkan pernah terganti oleh bintang mana pun.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Tetaplah hidup, tetaplah bersinar lembut, dan mari kita menangkan pertarungan takdir ini bersama-sama selamanya, sayang."</p>`,

  `<p>Kecemasanmu malam ini hanyalah riak kecil di permukaan danau jiwamu yang teramat tenang dan anggun, bub.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Biarkan riak itu mereda dengan sendirinya seiring berjalannya waktu, jangan biarkan ia mengacaukan batinmu."</p>`,

  `<p>Aku mencintaimu di setiap keadaanmu, bub, baik di kala tawa ceriamu menghiasi hari maupun di kala isak tangismu memecah kesunyian malam.</p>
         <p>Bagiku, sayang, kamu tetaplah yang paling berharga, permata hati yang akan selalu kujaga sepenuh jiwaku.</p>`,

  `<p>Tarik napasmu dalam-dalam... rasakan bahwa hidup masih memberikan kesempatan besar bagimu untuk bahagia bersama diriku, bub.</p>
         <p>Lepaskan semua ketakutanmu, sayang, percayakan masa depanmu pada genggaman tanganku yang kokoh dan setia ini.</p>`,

  `<p>Setiap malam yang melelahkan ini akan segera berganti dengan pagi yang cerah, bub, membawa sejuta kehangatan baru bagi hatimu.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Istrahatlah kesayanganku, biarkan cintaku yang bekerja menjaga kedamaian batinmu sepanjang malam ini."</p>`,

  `<p>Kamu tidak perlu berpura-pura menjadi pahlawan yang tak terkalahkan di hadapanku, bub. Jadilah dirimu apa adanya.</p>
         <p>Aku mencintai segala ketidaksempurnaanmu, sayang, karena dari sanalah keindahan sejati jiwamu memancar dengan sangat anggun.</p>`,

  `<p>Jangan biarkan riuh rendah penilaian dunia luar mengaburkan fakta betapa istimewanya kehadiranmu di hidupku, bub.</p>
         <p>Kamu adalah dunia bagiku, sayang, dan kebahagiaanmu adalah tujuan utama dari setiap helai napas perjuanganku.</p>`,

  `<p>Overthinking hanyalah tanda bahwa jiwamu teramat peduli pada kebaikan masa depan kita, bub. Tapi tolong, istirahatkan dulu malam ini.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Biarkan malam ini berjalan tanpa beban, nikmati kesunyian yang damai dalam dekapan hangat cintaku dari kejauhan."</p>`,

  `<p>Aku bersyukur atas keteguhan hatimu yang selalu memilih jalan kebaikan meskipun rintangan di depan terasa begitu menyiksa batinmu, sayang.</p>
         <p>Jiwa pejuangmu adalah alasan utama mengapa aku menaruh seluruh hormat dan cintaku hanya kepadamu, bub.</p>`,

  `<p>Setiap luka tak berdarah di hatimu sedang dibalut oleh benang-benang sutra kasih sayangku yang tak berujung, bub.</p>
         <p>Percayalah, sayang, perlahan tapi pasti, senyuman ceriamu akan kembali mekar menghiasi hari-hari indah kita nanti.</p>`,

  `<p>Jangan biarkan kabut kecemasan malam ini menghalangi pandanganmu dari betapa megahnya pelangi yang kusiapkan di hari esok, bub.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kita akan melangkah bersama menembus kabut cemas ini, tanpa ragu sedikit pun karena kita saling memiliki."</p>`,

  `<p>Kamu adalah pilar kekuatanku di kala badai cobaan menerpa hidupku dengan dahsyat, bub. Kehadiranmu menguatkan ragaku.</p>
         <p>Tolong biarkan aku bergantian menjadi pilar yang menyangga kepenatan batinmu malam ini, sandarkan lelahmu padaku, sayang.</p>`,

  `<p>Tidurlah dengan nyenyak, bub kesayanganku. Biarkan mimpimu menuntunmu ke taman bunga yang penuh kedamaian batin.</p>
         <p>Aku akan selalu ada di sini, menjagamu dalam setiap doa tulus yang kupanjatkan ke langit malam sepanjang waktu, sayang.</p>`,

  `<p>Kamu adalah rasi bintangku yang paling memikat, bub, cahaya indah yang takkan pernah pudar oleh berjalannya sang waktu.</p>
         <p>Toling tetaplah hidup, tetaplah bertumbuh dengan keanggunanmu, dan mari kita menangkan pertarungan takdir ini bersama.</p>`,

  `<p>Saat kecemasan malam merayap dingin menyentuh hatimu, bub, rasakan aliran kehangatan doaku yang tak pernah putus mengalir untukmu.</p>
         <p>Kamu aman, sayang, kamu terlindungi, dan kamu dicintai oleh jiwa yang rela memberikan segalanya demi kebahagiaanmu.</p>`,

  `<p>Jangan biarkan overthinking membuatmu lupa akan betapa berharganya setiap detik kehidupan yang dianugerahkan semesta padamu, bub.</p>
         <p>Nikmati hari ini dengan penuh rasa syukur, sayang, biarkan masa depan mengalir dengan keindahan alaminya sendiri.</p>`,

  `<p>Aku mencintaimu di setiap keadaanmu, bub, baik di kala tawa ceriamu menghiasi hari maupun di kala isak tangismu memecah kesunyian malam.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kamu adalah semesta kecilku, tempat di mana hatiku berlabuh dan takkan pernah ingin mencari pelabuhan lain."</p>`,

  `<p>Terima kasih atas ketulusan hatimu yang selalu memancarkan kebaikan murni kepada setiap jiwa di sekitarmu, sayang.</p>
         <p>Kehadiranmu adalah anugerah terindah bagi dunia, bub, dan menjaga senyumanmu adalah sumpah setia hidupku selamanya.</p>`,

  `<p>Jangan biarkan badai pikiran malam ini membuatmu meragukan kekuatan dahsyat yang ada di dalam dirimu, bub.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kamu adalah pemenang sejati, pejuang hebat yang sanggup bangkit kembali dengan keanggunan setelah terjatuh berkali-kali."</p>`,

  `<p>Tidurlah yang nyenyak malam ini, bub, biarkan semua beban pikiranmu larut bersama dinginnya embun malam.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Esok pagi, kita akan bangun dengan cahaya baru, kekuatan baru, dan cinta yang jauh lebih kokoh dari kemarin."</p>`,

  `<p>Kamu adalah pelangi setelah hujan lebat di hidupku, sayang, warna-warni indah yang meredakan segala duka lara di hatiku.</p>
         <p>Tolong tetaplah bertahan, bub, karena duniaku membutuhkan cahaya indahmu untuk menerangi setiap sudut jalanku.</p>`,

  `<p>Kecemasanmu adalah tanda betapa dalamnya kepedulianmu pada masa depan kita, bub. Tapi tolong, istirahatkan dulu malam ini.</p>
         <p>Biarkan batinmu bernapas lega dalam balutan cintaku yang tulus dan tak terbatas, khusus kujaga hanya untukmu, sayang.</p>`,

  `<p>Setiap luka emosional yang kamu bawa hari ini sedang dibalut oleh sutra kehangatan doa-doa tulusku setiap waktu, sayang.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Percayalah pada jalannya takdir, sebab ujung dari setiap lelah perjuanganmu adalah kebahagiaan sejati bersamaku."</p>`,

  `<p>Jangan biarkan keputusasaan merusak keyakinanmu bahwa kamu pantas mendapatkan segala kemewahan cinta di dunia ini, bub.</p>
         <p>Aku ada untukmu, sayang, selalu mendampingimu menembus malam tersunyi hingga fajar kebahagiaan terbit menyapa batinmu.</p>`,

  `<p>Kamu adalah anugerah terindah yang dikirimkan langit untuk menemani setiap jengkal perjalanan hidupku yang berliku ini, bub.</p>
         <p>Tetaplah bersamaku, sayang, kita hadapi seluruh badai kehidupan dengan saling menggenggam tangan erat tanpa ragu sedikit pun.</p>`,

  `<p>Saat bising cemas mulai mengaburkan pandanganmu, bub, rasakan kehangatan cintaku yang selalu siap menuntunmu pulang dengan selamat.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Kamu tidak sendirian berjuang, sayang. Hatiku selalu melekat erat pada jiwamu, menjagamu di setiap hela napasmu."</p>`,

  `<p>Terima kasih telah memilih untuk terus hidup dan bertumbuh dengan anggun meskipun beban pikiranmu terasa teramat berat, sayang.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Keberanianmu adalah hadiah terindah bagi hidupku, pejuang tangguhku yang paling kucintai sepanjang masa, bub, hari demi hari."</p>`,

  `<p>Tidurlah dengan senyum manis di bibirmu malam ini, bub, biarkan semua penat pikiranmu hari ini melebur bersama dinginnya malam.</p>
         <p>Esok pagi kita akan melukis kembali masa depan indah kita dengan warna-warni kebahagiaan yang tak berujung, sayang.</p>`,

  // 100
  `<p>Kamu adalah rasi bintang favoritku di seluruh galaksi luas ini, bub, cahaya indah yang takkan pernah terganti oleh bintang mana pun.</p>
         <p class="border-l-2 border-pink-400 pl-3 italic text-pink-300 bg-white/5 py-1.5 rounded-r-xl">"Tetaplah hidup, tetaplah bersinar lembut, dan mari kita menangkan pertarungan takdir ini bersama-sama selamanya, sayang."</p>`,
];

let currentMsgIndex = 0;

function updateInteractiveMessage() {
  const area = document.getElementById("interactiveMessageArea");
  const indexIndicator = document.getElementById("msgIndex");

  // Animasi transisi teks keluar sejenak
  area.style.opacity = 0;
  area.style.transform = "translateY(5px)";

  setTimeout(() => {
    area.innerHTML = deepMessages[currentMsgIndex];
    indexIndicator.innerText = `Surat ${currentMsgIndex + 1} / ${deepMessages.length}`;

    // Animasi transisi teks masuk kembali
    area.style.opacity = 1;
    area.style.transform = "translateY(0)";
  }, 200);
}

function initInteractiveMessageControls() {
  const prevBtn = document.getElementById("prevMsgBtn");
  const nextBtn = document.getElementById("nextMsgBtn");
  const randomBtn = document.getElementById("randomMsgBtn");

  prevBtn.onclick = () => {
    currentMsgIndex = (currentMsgIndex - 1 + deepMessages.length) % deepMessages.length;
    updateInteractiveMessage();
  };

  nextBtn.onclick = () => {
    currentMsgIndex = (currentMsgIndex + 1) % deepMessages.length;
    updateInteractiveMessage();
  };

  randomBtn.onclick = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * deepMessages.length);
    } while (randomIndex === currentMsgIndex); // Memastikan tidak mendapatkan index yang sama secara berurutan

    currentMsgIndex = randomIndex;
    updateInteractiveMessage();
  };

  // Muat pesan pertama saat inisialisasi
  updateInteractiveMessage();
}

function initSpace() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = [];
  for (let i = 0; i < 400; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 2,
      colorType: Math.random() > 0.5 ? 1 : 2,
      originalSize: Math.random() * 2,
    });
  }
}

function animateSpace() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!animationsEnabled) {
    requestAnimationFrame(animateSpace);
    return;
  }

  stars.forEach((s, i) => {
    const starColor = s.colorType === 1 ? currentThemeColors.star1 : currentThemeColors.star2;
    if (formingName) {
      let p = namePoints[i % namePoints.length];
      let tx = p.x * canvas.width;
      let ty = p.y * canvas.height;
      s.x += (tx - s.x) * 0.07;
      s.y += (ty - s.y) * 0.07;
      s.size = 2.5;
    } else {
      s.x += s.vx;
      s.y += s.vy;
      s.size = s.originalSize;
      if (s.x < 0 || s.x > canvas.width) s.vx *= -1;
      if (s.y < 0 || s.y > canvas.height) s.vy *= -1;
    }
    ctx.fillStyle = starColor;
    if (formingName) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = starColor;
    } else {
      ctx.shadowBlur = 0;
    }
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });

  if (Math.random() < 0.02) shootingStars.push({ x: Math.random() * canvas.width, y: 0, len: Math.random() * 80 + 20, speed: Math.random() * 10 + 5 });
  shootingStars.forEach((ss, i) => {
    ctx.strokeStyle = "rgba(125, 211, 252, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ss.x, ss.y);
    ctx.lineTo(ss.x - ss.len, ss.y + ss.len);
    ctx.stroke();
    ss.x += ss.speed;
    ss.y += ss.speed;
    if (ss.y > canvas.height) shootingStars.splice(i, 1);
  });
  requestAnimationFrame(animateSpace);
}

// =======================================================
// ENGINE GUGURAN BUNGA & KELOPAK (FLOWERS ENGINE CANVAS)
// =======================================================
const flCanvas = document.getElementById("flowers-canvas");
const flCtx = flCanvas.getContext("2d");
let flowerPetals = [];

function resizeFlowersCanvas() {
  flCanvas.width = window.innerWidth;
  flCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeFlowersCanvas);
resizeFlowersCanvas();

class FlowerPetal {
  constructor(x, y, isBurst = false) {
    this.x = x || Math.random() * flCanvas.width;
    this.y = y !== undefined ? y : -20;
    this.size = Math.random() * 12 + 6;

    // Kecepatan melayang halus bergoyang
    this.speedX = isBurst ? (Math.random() - 0.5) * 8 : (Math.random() - 0.5) * 1.5;
    this.speedY = isBurst ? (Math.random() - 0.5) * 8 - 3 : Math.random() * 1.2 + 0.8;

    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.03;
    this.swayAngle = Math.random() * Math.PI;
    this.swaySpeed = Math.random() * 0.02 + 0.01;

    // Beragam tipe kelopak/bunga: mawar, sakura, melati utuh
    const types = ["rose-petal", "sakura-petal", "whole-blossom"];
    this.type = types[Math.floor(Math.random() * types.length)];

    // Palet warna romantis
    const colors = ["#f43f5e", "#fda4af", "#ec4899", "#fbcfe8", "#ffffff", "#e9d5ff"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.opacity = Math.random() * 0.4 + 0.5;
  }

  update() {
    // Jatuh dan bergoyang melengkung halus
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.swayAngle) * 0.4;
    this.swayAngle += this.swaySpeed;
    this.rotation += this.rotationSpeed;

    // Hapus jika keluar batas bawah layar
    if (this.y > flCanvas.height + 20) {
      this.y = -20;
      this.x = Math.random() * flCanvas.width;
    }
  }

  draw() {
    flCtx.save();
    flCtx.translate(this.x, this.y);
    flCtx.rotate(this.rotation);
    flCtx.globalAlpha = this.opacity;
    flCtx.fillStyle = this.color;

    if (this.type === "rose-petal") {
      // Menggambar kelopak mawar melengkung organik
      flCtx.beginPath();
      flCtx.moveTo(0, 0);
      flCtx.bezierCurveTo(-this.size, -this.size / 2, -this.size, this.size, 0, this.size * 1.2);
      flCtx.bezierCurveTo(this.size, this.size, this.size, -this.size / 2, 0, 0);
      flCtx.fill();
    } else if (this.type === "sakura-petal") {
      // Kelopak sakura berlekuk di ujungnya
      flCtx.beginPath();
      flCtx.moveTo(0, 0);
      flCtx.bezierCurveTo(-this.size * 0.8, -this.size * 0.5, -this.size, this.size * 0.5, -this.size * 0.2, this.size * 1.1);
      flCtx.lineTo(0, this.size * 0.9);
      flCtx.lineTo(this.size * 0.2, this.size * 1.1);
      flCtx.bezierCurveTo(this.size, this.size * 0.5, this.size * 0.8, -this.size * 0.5, 0, 0);
      flCtx.fill();
    } else {
      // Menggambar bunga utuh bermahkota lima
      for (let i = 0; i < 5; i++) {
        flCtx.rotate((Math.PI * 2) / 5);
        flCtx.beginPath();
        flCtx.ellipse(this.size * 0.5, 0, this.size * 0.55, this.size * 0.28, 0, 0, Math.PI * 2);
        flCtx.fill();
      }
      // Putik kuning tengah
      flCtx.beginPath();
      flCtx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
      flCtx.fillStyle = "#fef08a";
      flCtx.fill();
    }

    flCtx.restore();
  }
}

function initFallingFlowers() {
  flowerPetals = [];
  // Isi jumlah awal kelopak bunga di langit-langit layar
  for (let i = 0; i < 85; i++) {
    flowerPetals.push(new FlowerPetal(Math.random() * flCanvas.width, Math.random() * flCanvas.height));
  }
}

function animateFlowers() {
  flCtx.clearRect(0, 0, flCanvas.width, flCanvas.height);

  if (!animationsEnabled) {
    requestAnimationFrame(animateFlowers);
    return;
  }

  flowerPetals.forEach((petal, index) => {
    petal.update();
    petal.draw();

    // Bersihkan sisa partikel ledakan burst yang berhamburan keluar layar
    if (petal.speedY > 2 && (petal.x < -100 || petal.x > flCanvas.width + 100)) {
      flowerPetals.splice(index, 1);
    }
  });

  // Pertahankan kuota kelopak melayang default di layar
  if (flowerPetals.length < 80) {
    flowerPetals.push(new FlowerPetal());
  }

  requestAnimationFrame(animateFlowers);
}

// Fungsi interaktif ledakan burst kelopak bunga saat buket disentuh
function triggerFlowerBurst(x, y) {
  let burstCount = 55;
  for (let i = 0; i < burstCount; i++) {
    flowerPetals.push(new FlowerPetal(x, y, true));
  }
}
// =======================================================

// SETUP PESAN MANIS BUKET BUNGA
const bouquetMessages = [
  '"Satu mawar murni untuk senyum terindahmu yang mengalahkan pelangi." 🌹',
  '"Kukirim buket cinta kosmik ini untuk menyelimuti mimpimu malam ini." ✨',
  '"Kamu berhak didekap oleh ribuan kebahagiaan setiap harinya, sayang!" 🌸',
  '"Di galaksi takdir kita, kamu adalah rasi bunga terharum di hatiku." 🌌',
  '"Tarik napas dalam-dalam, hirup cinta hangat yang kuselipkan di antara kelopak bunga ini." 💐',
  '"Jangan biarkan harimu layu, karena senyummu adalah mentari jiwaku." 🌻',
  '"Kelopak demi kelopak mawar ini melambangkan kekagumanku yang tak berujung padamu." 💕',
];

function initBouquetInteractivity() {
  const bouquetBtn = document.getElementById("interactiveBouquet");
  const bouquetText = document.getElementById("bouquetWisdom");

  bouquetBtn.onclick = (e) => {
    const rect = bouquetBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Trigger ledakan bunga interaktif pada canvas
    triggerFlowerBurst(centerX, centerY);

    // Trigger efek kembang api romantis sebagai penambah kemewahan
    triggerMassiveCelebration();

    // Ubah kutipan tulisan dengan transisi memudar romantis
    bouquetText.style.opacity = 0;
    bouquetText.style.transform = "scale(0.95)";

    setTimeout(() => {
      const randomMsg = bouquetMessages[Math.floor(Math.random() * bouquetMessages.length)];
      bouquetText.innerText = randomMsg;
      bouquetText.style.opacity = 1;
      bouquetText.style.transform = "scale(1)";
    }, 200);
  };
}

function updateCounter() {
  const start = new Date("2026-05-10T11:57:00");
  const now = new Date();
  let diff = now - start;

  if (diff < 0) diff = 0;

  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.44));
  const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30.44)) / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById("c-years").innerText = years;
  document.getElementById("c-months").innerText = months;
  document.getElementById("c-days").innerText = days;
  document.getElementById("c-hours").innerText = hours;
  document.getElementById("c-minutes").innerText = minutes;
  document.getElementById("c-seconds").innerText = seconds;
}

// Hitung Mundur Ulang Tahun Rifki & Arina
function updateBirthdayCountdown() {
  const now = new Date();
  const currentYear = now.getFullYear();

  // Ulang Tahun Rifki Al Azhari (15 Juli)
  let nextUltahKu = new Date(currentYear, 6, 15);
  if (now > nextUltahKu) {
    nextUltahKu.setFullYear(currentYear + 1);
  }
  let diffKu = nextUltahKu - now;
  let daysKu = Math.ceil(diffKu / (1000 * 60 * 60 * 24));
  let ageKu = nextUltahKu.getFullYear() - 2006;

  // Ulang Tahun Arina Husnul Nafisah (7 Juli)
  let nextUltahAlin = new Date(currentYear, 6, 7);
  if (now > nextUltahAlin) {
    nextUltahAlin.setFullYear(currentYear + 1);
  }
  let diffAlin = nextUltahAlin - now;
  let daysAlin = Math.ceil(diffAlin / (1000 * 60 * 60 * 24));
  let ageAlin = nextUltahAlin.getFullYear() - 2008;

  const timerText = document.getElementById("birthdayTimerText");

  const isUltahKu = now.getDate() === 15 && now.getMonth() === 6;
  const isUltahAlin = now.getDate() === 7 && now.getMonth() === 6;

  if (isUltahKu) {
    timerText.innerHTML = `🎉 <strong>Hari ini adalah hari ulang tahun Rifki Al Azhari (رفقى ال azhar) yang ke-${ageKu}!</strong> Momen yang sangat istimewa! 🎉`;
  } else if (isUltahAlin) {
    timerText.innerHTML = `💖 <strong>Hari ini adalah hari ulang tahun Arina Husnul Nafisah (ارna حسن النفسة) yang ke-${ageAlin}!</strong> Semoga bahagia selalu! 💖`;
  } else {
    if (daysKu < daysAlin) {
      timerText.innerHTML = `<i class="fa-regular fa-star text-yellow-300"></i> Momen Rifki terdekat: <strong>${daysKu} hari lagi</strong> (Ke-${ageKu} pada 15 Juli)`;
    } else {
      timerText.innerHTML = `<i class="fa-solid fa-heart text-pink-400"></i> Momen Arina terdekat: <strong>${daysAlin} hari lagi</strong> (Ke-${ageAlin} pada 7 Juli)`;
    }
  }
}

// Menghitung Umur Dinamis Berdasarkan Tanggal Lahir Secara Real-Time
function updateDynamicAges() {
  function getAge(birthDateString) {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  const ageRifkiEl = document.getElementById("age-rifki");
  const ageArinaEl = document.getElementById("age-arina");

  if (ageRifkiEl) ageRifkiEl.innerText = getAge("2006-07-15");
  if (ageArinaEl) ageArinaEl.innerText = getAge("2008-07-07");
}

// Daftar Lagu Romantis
const playlist = [
  { title: "Sesuatu Yang Sempurna", artist: "Hijau Daun", url: "musik/lagu1.mp3" },
  { title: "Bukan Cinta Biasa", artist: "Siti Nurhaliza", url: "musik/lagu2.mp3" },
  { title: "Sedia Aku Sebelum Hujan", artist: "Brigitta Meliala", url: "musik/lagu3.mp3" },
  { title: "Surat Cinta Untuk Starla", artist: "Virgoun Putra Tambunan", url: "musik/lagu4.mp3" },
  { title: "Celengan Rindu", artist: "Fiersa Besari", url: "musik/lagu5.mp3" },
];
let currentTrack = 0;
const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playPauseBtn");
const playIcon = document.getElementById("playIcon");

function loadTrack(i) {
  currentTrack = i;
  audio.src = playlist[i].url;
  document.getElementById("trackName").innerText = `${playlist[i].title} - ${playlist[i].artist}`;
  renderPlaylist();
}

function renderPlaylist() {
  const container = document.getElementById("playlistItems");
  container.innerHTML = "";
  playlist.forEach((track, i) => {
    const isActive = i === currentTrack;
    const div = document.createElement("div");
    div.className = `p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${isActive ? "bg-violet-500/20 border border-violet-500/30" : "hover:bg-white/5"}`;
    div.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                            <i class="fa-solid ${isActive ? "fa-volume-high text-violet-400" : "fa-play text-xs opacity-40"}"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold ${isActive ? "text-violet-300" : "text-white/80"}">${track.title}</p>
                            <p class="text-[9px] uppercase text-white/40">${track.artist}</p>
                        </div>
                    </div>
                `;
    div.onclick = () => {
      loadTrack(i);
      audio.play();
      playIcon.className = "fa-solid fa-pause";
    };
    container.appendChild(div);
  });
}

document.getElementById("togglePlaylist").onclick = () => {
  const p = document.getElementById("playlistWindow");
  p.classList.toggle("opacity-0");
  p.classList.toggle("pointer-events-none");
  p.classList.toggle("translate-y-10");
  // Tutup tema jika playlist dibuka
  document.getElementById("themeWindow").classList.add("opacity-0", "pointer-events-none", "translate-y-10");
};
document.getElementById("closePlaylist").onclick = () => {
  const p = document.getElementById("playlistWindow");
  p.classList.add("opacity-0", "pointer-events-none", "translate-y-10");
};

document.getElementById("toggleTheme").onclick = () => {
  const t = document.getElementById("themeWindow");
  t.classList.toggle("opacity-0");
  t.classList.toggle("pointer-events-none");
  t.classList.toggle("translate-y-10");
  // Tutup playlist jika tema dibuka
  document.getElementById("playlistWindow").classList.add("opacity-0", "pointer-events-none", "translate-y-10");
};
document.getElementById("closeTheme").onclick = () => {
  const t = document.getElementById("themeWindow");
  t.classList.add("opacity-0", "pointer-events-none", "translate-y-10");
};

playBtn.onclick = () => {
  if (audio.paused) {
    audio.play();
    playIcon.className = "fa-solid fa-pause";
  } else {
    audio.pause();
    playIcon.className = "fa-solid fa-play ml-1";
  }
};

// LOGIKA KUNJUNGAN STREAK HARIAN (DIHITUNG DINAMIS MENGIKUTI WAKTU)
function initVisitStreak() {
  // Diatur presisi ke tanggal 11 Mei 2026 Jam 11:57 agar sinkron sempurna
  const startStreak = new Date("2026-05-11T11:57:00");
  const now = new Date();

  const diffTime = now - startStreak;
  let count = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (count < 1) count = 1;

  // Update Tampilan DOM
  const streakNumEl = document.getElementById("streak-number");
  const modalStreakCountEl = document.getElementById("modal-streak-count");
  if (streakNumEl) streakNumEl.innerText = count;
  if (modalStreakCountEl) modalStreakCountEl.innerText = count;

  // Atur Evolusi Warna Api Cinta
  updateFlameTiers(count);
}

// Mengubah warna CSS Custom variables berdasarkan jumlah hari
function updateFlameTiers(count) {
  const root = document.documentElement;
  let flameColor, glow1, glow2, tierText;

  if (count < 30) {
    // Tier 1: Amber/Oranye TikTok (< 30 Hari)
    flameColor = "#f59e0b"; // Amber-500
    glow1 = "rgba(245, 158, 11, 0.6)";
    glow2 = "rgba(239, 68, 68, 0.95)";
    tierText = "Love Ember 🔥 (Kehangatan Mula-mula)";
  } else if (count >= 30 && count < 50) {
    // Tier 2: Merah Membara (30 - 49 Hari)
    flameColor = "#ef4444"; // Red-500
    glow1 = "rgba(239, 68, 68, 0.75)";
    glow2 = "rgba(185, 28, 28, 0.95)";
    tierText = "Scarlet Passion 🌹 (Makin Membara Indah!)";
  } else if (count >= 50 && count < 100) {
    // Tier 3: Ungu Amethyst (50 - 99 Hari)
    flameColor = "#c084fc"; // Purple/Violet
    glow1 = "rgba(139, 92, 246, 0.7)";
    glow2 = "rgba(76, 29, 149, 0.95)";
    tierText = "Cosmic Amethyst 🌌 (Satu Frekuensi Jiwa)";
  } else {
    // Tier 4: Nebula Supernova (100+ Hari)
    flameColor = "#f43f5e"; // Rose-500
    glow1 = "rgba(244, 63, 94, 0.85)";
    glow2 = "rgba(225, 29, 72, 0.98)";
    tierText = "Eternal Supernova ✨ (Abadi Tak Terhingga)";
  }

  root.style.setProperty("--flame-color", flameColor);
  root.style.setProperty("--flame-glow-1", glow1);
  root.style.setProperty("--flame-glow-2", glow2);

  const label = document.getElementById("flame-tier-label");
  if (label) {
    label.innerText = tierText;
    label.style.color = flameColor;
  }
}

function initStreakModalControls() {
  const streakModal = document.getElementById("streakInfoModal");
  const openBtn = document.getElementById("openStreakInfoBtn");
  const closeBtn = document.getElementById("closeStreakInfo");
  const claimBtn = document.getElementById("claimStreakBtn");

  openBtn.onclick = () => {
    streakModal.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  closeBtn.onclick = () => {
    streakModal.classList.remove("active");
    document.body.style.overflow = "";
  };

  claimBtn.onclick = () => {
    streakModal.classList.remove("active");
    document.body.style.overflow = "";
  };
}

// ==========================================
// SISTEM KEMBANG API MEWAH (FIREWORKS ENGINE)
// ==========================================
const fwCanvas = document.getElementById("fireworks-canvas");
const fwCtx = fwCanvas.getContext("2d");
let fireworks = [];
let fwParticles = [];

function resizeFwCanvas() {
  fwCanvas.width = window.innerWidth;
  fwCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeFwCanvas);
resizeFwCanvas();

class FireworkRocket {
  constructor(sx, sy, tx, ty) {
    this.x = sx;
    this.y = sy;
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.distanceToTarget = Math.sqrt(Math.pow(sx - tx, 2) + Math.pow(sy - ty, 2));
    this.distanceTraveled = 0;
    this.coordinates = [];
    this.coordinateCount = 3;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.atan2(ty - sy, tx - sx);
    this.speed = 2;
    this.acceleration = 1.04;
    this.brightness = Math.random() * 20 + 60;
    this.hue = Math.random() * 360;
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.acceleration;
    let vx = Math.cos(this.angle) * this.speed;
    let vy = Math.sin(this.angle) * this.speed;
    this.distanceTraveled = Math.sqrt(Math.pow(this.sx - (this.x + vx), 2) + Math.pow(this.sy - (this.y + vy), 2));

    if (this.distanceTraveled >= this.distanceToTarget) {
      createLuxuriousBurst(this.tx, this.ty, this.hue);
      fireworks.splice(index, 1);
    } else {
      this.x += vx;
      this.y += vy;
    }
  }

  draw() {
    fwCtx.beginPath();
    fwCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    fwCtx.lineTo(this.x, this.y);
    fwCtx.strokeStyle = `hsl(${this.hue}, 100%, ${this.brightness}%)`;
    fwCtx.lineWidth = 1.8;
    fwCtx.stroke();
  }
}

class LuxuriousParticle {
  constructor(x, y, hue) {
    this.x = x;
    this.y = y;
    this.coordinates = [];
    this.coordinateCount = 6;
    while (this.coordinateCount--) {
      this.coordinates.push([this.x, this.y]);
    }
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 8 + 2;
    this.friction = 0.94;
    this.gravity = 0.12; // Gravitasi mewah menarik partikel turun perlahan
    this.hue = Math.random() * 40 + (hue - 20); // Sedikit variasi gradasi warna
    this.brightness = Math.random() * 30 + 50;
    this.alpha = 1;
    this.decay = Math.random() * 0.01 + 0.008; // Perlahan memudar romantis
  }

  update(index) {
    this.coordinates.pop();
    this.coordinates.unshift([this.x, this.y]);
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= this.decay) {
      fwParticles.splice(index, 1);
    }
  }

  draw() {
    fwCtx.beginPath();
    fwCtx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
    fwCtx.lineTo(this.x, this.y);
    fwCtx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
    fwCtx.lineWidth = Math.random() * 2 + 1;
    fwCtx.stroke();
  }
}

function createLuxuriousBurst(x, y, hue) {
  let pCount = 95; // Banyaknya sebaran partikel mewah
  while (pCount--) {
    fwParticles.push(new LuxuriousParticle(x, y, hue));
  }
}

function launchSingleRocket() {
  let sx = Math.random() * (fwCanvas.width * 0.6) + fwCanvas.width * 0.2;
  let sy = fwCanvas.height;
  let tx = Math.random() * (fwCanvas.width * 0.8) + fwCanvas.width * 0.1;
  let ty = Math.random() * (fwCanvas.height * 0.45) + fwCanvas.height * 0.1;
  fireworks.push(new FireworkRocket(sx, sy, tx, ty));
}

function triggerMassiveCelebration() {
  let burstCount = 8;
  for (let i = 0; i < burstCount; i++) {
    setTimeout(() => {
      launchSingleRocket();
    }, i * 280);
  }
}

function runFireworksLoop() {
  if (!animationsEnabled) {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    requestAnimationFrame(runFireworksLoop);
    return;
  }

  fwCtx.globalCompositeOperation = "destination-out";
  fwCtx.fillStyle = "rgba(0, 0, 0, 0.18)"; // Menghasilkan efek ekor kembang api memudar elegan
  fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);
  fwCtx.globalCompositeOperation = "lighter";

  let rCount = fireworks.length;
  while (rCount--) {
    fireworks[rCount].draw();
    fireworks[rCount].update(rCount);
  }

  let pCount = fwParticles.length;
  while (pCount--) {
    fwParticles[pCount].draw();
    fwParticles[pCount].update(pCount);
  }

  requestAnimationFrame(runFireworksLoop);
}

// Tombol Rayakan Cinta manual trigger
document.getElementById("launchFireworksBtn").onclick = () => {
  triggerMassiveCelebration();
};

// Auto Launch Kembang Api Berkala (Menjaga keindahan langit malam vault)
setInterval(() => {
  if (Math.random() < 0.4) {
    launchSingleRocket();
  }
}, 12000);
// ==========================================

// Galeri Demo Romantis jika API belum terhubung atau error
const demoGalleryData = [
  {
    folder: "Januari 2026",
    images: [
      {
        url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600",
        time: "10 Januari 2026",
        note: "Momen manis saat kita menikmati senja di bawah rasi bintang yang sama.",
      },
      {
        url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600",
        time: "24 Januari 2026",
        note: "Tawa ceriamu hari ini adalah suara favoritku di seluruh alam semesta.",
      },
    ],
  },
  {
    folder: "Februari 2026",
    images: [
      {
        url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600",
        time: "14 Februari 2026",
        note: "Merayakan hari kasih sayang dengan secangkir cokelat hangat dan senyum termanismu.",
      },
    ],
  },
  {
    folder: "Maret 2026",
    images: [
      {
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=600",
        time: "05 Maret 2026",
        note: "Melangkah bersama, merekatkan jalinan kenangan yang indah.",
      },
    ],
  },
];

let allGalleryData = [];
let activeFolderFilter = "";

window.closeCurrentFolder = () => {
  activeFolderFilter = "";
  buildFolderNavigation(allGalleryData);
  renderFilteredGallery();
};

function buildFolderNavigation(data) {
  const nav = document.getElementById("folderNav");
  nav.innerHTML = "";

  const folderList = [{ name: "Semua", isAll: true }];
  data.forEach((folderObj) => {
    folderList.push({ name: folderObj.folder, isAll: false });
  });

  folderList.forEach((folderItem) => {
    const isActive = activeFolderFilter === folderItem.name;

    const folderContainer = document.createElement("div");
    folderContainer.className = `folder-container folder-wrapper relative flex flex-col items-center justify-end cursor-pointer ${isActive ? "active" : ""}`;

    folderContainer.innerHTML = `
            <div class="absolute inset-x-1 bottom-6 sm:bottom-8 top-5 sm:top-6 folder-back"></div>
            <div class="absolute inset-x-3 sm:inset-x-4 h-10 sm:h-12 bottom-9 sm:bottom-12 folder-paper-2 rounded-t-lg flex items-center justify-center">
              <i class="fa-solid fa-heart text-[7px] sm:text-[8px] text-pink-400/50"></i>
            </div>
            <div class="absolute inset-x-5 sm:inset-x-6 h-10 sm:h-12 bottom-8 sm:bottom-10 folder-paper-1 rounded-t-lg flex items-center justify-center">
              <i class="fa-solid fa-star text-[6px] sm:text-[7px] text-sky-400/50"></i>
            </div>
            <div class="absolute inset-x-1 bottom-6 sm:bottom-8 top-10 sm:top-12 folder-front shadow-lg">
              <div class="absolute -top-2 sm:-top-3 left-0 w-8 sm:w-12 h-2 sm:h-3 bg-inherit border-t border-l border-r border-violet-400/30 rounded-t-md"></div>
              <div class="absolute inset-0 flex items-center justify-center text-white/30 text-[10px] sm:text-xs">
                <i class="fa-solid ${folderItem.isAll ? "fa-globe" : "fa-images"}"></i>
              </div>
            </div>
            <span class="folder-title mt-2 text-[8px] sm:text-[10px] font-bold tracking-wider text-sky-200/80 uppercase text-center truncate w-full z-10 transition-colors px-1">
              ${folderItem.name}
            </span>
          `;

    folderContainer.onclick = () => {
      if (activeFolderFilter === folderItem.name) {
        activeFolderFilter = "";
      } else {
        activeFolderFilter = folderItem.name;
      }
      buildFolderNavigation(data);
      renderFilteredGallery();
    };

    nav.appendChild(folderContainer);
  });
}

function renderFilteredGallery() {
  const container = document.getElementById("galleryContainer");
  const status = document.getElementById("galleryStatus");
  container.innerHTML = "";

  if (!activeFolderFilter) {
    status.innerHTML = `
            <div class="glass p-6 sm:p-8 rounded-3xl max-w-sm sm:max-w-md mx-auto border border-violet-500/20 text-center animate-pulse py-10 sm:py-12 shadow-[0_0_30px_rgba(139,92,246,0.15)]">
              <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-violet-500/15 flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-folder-closed text-2xl sm:text-3xl text-violet-400"></i>
              </div>
              <p class="text-xs sm:text-sm text-sky-200/90 italic font-semibold tracking-wide px-2">
                "Ketuk salah satu folder di atas untuk membuka lembaran kenangan kita..." ✨
              </p>
            </div>
          `;
    status.classList.remove("hidden");
    return;
  }
  status.classList.add("hidden");

  const filteredData = activeFolderFilter === "Semua" ? allGalleryData : allGalleryData.filter((f) => f.folder === activeFolderFilter);

  if (!filteredData || filteredData.length === 0) {
    status.innerHTML = `
            <div class="text-center py-10 px-4">
              <p class="text-white/40 italic text-xs sm:text-sm mb-4">Belum ada kenangan di folder ini.</p>
              <button onclick="closeCurrentFolder()" class="text-[10px] sm:text-xs bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 text-white/60 hover:text-white transition-all flex items-center gap-2 mx-auto">
                <i class="fa-solid fa-folder-closed"></i> Tutup Folder
              </button>
            </div>
          `;
    status.classList.remove("hidden");
    return;
  }

  filteredData.forEach((folderObj) => {
    const section = document.createElement("section");
    section.className = "mb-12";
    section.innerHTML = `
                      <div class="flex items-center justify-between gap-3 mb-6 sm:mb-8 pb-3 border-b border-white/5">
                          <div class="flex items-center gap-3">
                              <h3 class="text-base sm:text-xl font-bold text-sky-300 uppercase tracking-[0.15em] sm:tracking-[0.2em]">${folderObj.folder}</h3>
                              <div class="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-sky-500/50 to-transparent"></div>
                          </div>
                          <button onclick="closeCurrentFolder()" class="text-[10px] sm:text-xs bg-violet-600/20 hover:bg-violet-600/40 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-violet-500/30 text-violet-200 hover:text-white transition-all flex items-center gap-1.5 shrink-0">
                              <i class="fa-solid fa-folder-closed"></i> Tutup
                          </button>
                      </div>
                      <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"></div>
                  `;

    const grid = section.querySelector(".grid");
    folderObj.images.forEach((img) => {
      const div = document.createElement("div");
      div.className = "gallery-item glass rounded-2xl sm:rounded-3xl overflow-hidden group hover:-translate-y-1.5 transition-all duration-500 cursor-pointer";
      div.innerHTML = `
                          <div class="relative aspect-[4/5] overflow-hidden bg-white/5">
                              <img src="${img.url}" loading="lazy" decoding="async" class="w-full h-full object-cover transition duration-700 group-hover:scale-110" onerror="this.src='https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600'">
                              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <i class="fa-solid fa-expand text-white text-lg sm:text-2xl animate-pulse"></i>
                              </div>
                          </div>
                          <div class="p-3 sm:p-5">
                              <p class="text-[8px] sm:text-[10px] font-bold text-sky-300 uppercase tracking-widest mb-1 truncate">${img.time}</p>
                              <p class="text-white/70 text-[10px] sm:text-xs italic line-clamp-2 leading-relaxed">"${img.note}"</p>
                          </div>
                      `;
      div.onclick = () => openPreview(img.url, img.note, folderObj.folder, img.time);
      grid.appendChild(div);
    });
    container.appendChild(section);
  });
}

async function fetchGallery() {
  try {
    const response = await fetch(BACKEND_URL);
    const data = await response.json();
    if (data && data.length > 0) {
      allGalleryData = data;
    } else {
      allGalleryData = demoGalleryData;
    }
  } catch (e) {
    allGalleryData = demoGalleryData;
  }
  buildFolderNavigation(allGalleryData);
  renderFilteredGallery();
}

const modal = document.getElementById("imagePreviewModal");
const previewImg = document.getElementById("previewImg");
const previewNote = document.getElementById("previewNote");
const previewDate = document.getElementById("previewDate");
const downloadBtn = document.getElementById("downloadBtn");

function openPreview(url, note, folder, time) {
  previewImg.src = url;
  previewNote.innerText = note;
  previewDate.innerText = `${folder} • ${time}`;
  downloadBtn.href = url;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

document.getElementById("closePreview").onclick = () => {
  modal.classList.remove("active");
  document.body.style.overflow = "";
};

const upModal = document.getElementById("uploadModal");
const fileInput = document.getElementById("fileInput");
const uploadPreview = document.getElementById("uploadPreview");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const removeFileBtn = document.getElementById("removeFile");
const submitBtn = document.getElementById("submitUpload");
const uploadMsg = document.getElementById("uploadMsg");
const noteInput = document.getElementById("noteInput");

document.getElementById("openUploadBtn").onclick = () => {
  upModal.classList.add("active");
  document.body.style.overflow = "hidden";
};
document.getElementById("closeUpload").onclick = () => {
  upModal.classList.remove("active");
  document.body.style.overflow = "";
  fileInput.value = "";
  uploadPreview.classList.add("hidden");
  uploadPlaceholder.classList.remove("hidden");
  removeFileBtn.classList.add("hidden");
  uploadMsg.classList.add("hidden");
  noteInput.value = "";
};

fileInput.onchange = () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadPreview.src = e.target.result;
      uploadPreview.classList.remove("hidden");
      uploadPlaceholder.classList.add("hidden");
      removeFileBtn.classList.remove("hidden");
    };
    reader.readAsDataURL(file);
  }
};

removeFileBtn.onclick = () => {
  fileInput.value = "";
  uploadPreview.src = "";
  uploadPreview.classList.add("hidden");
  uploadPlaceholder.classList.remove("hidden");
  removeFileBtn.classList.add("hidden");
};

submitBtn.onclick = async () => {
  const file = fileInput.files[0];
  if (!file) return;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> <span>Mengirim...</span>`;
  uploadMsg.innerText = "Diterbangkan ke galaksi...";
  uploadMsg.className = "p-3 rounded-xl text-[10px] uppercase text-sky-300 border border-sky-500/30";
  uploadMsg.classList.remove("hidden");

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    try {
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        body: JSON.stringify({ action: "upload", fileName: file.name, base64: reader.result, note: noteInput.value }),
      });
      const result = await res.json();
      if (result.success) {
        uploadMsg.innerText = "Sukses! Kenangan sudah tersimpan.";
        uploadMsg.className = "p-3 rounded-xl text-[10px] uppercase text-green-400 border border-green-500/30";

        setTimeout(async () => {
          upModal.classList.remove("active");
          document.body.style.overflow = "";
          fileInput.value = "";
          noteInput.value = "";
          uploadPreview.classList.add("hidden");
          uploadPlaceholder.classList.remove("hidden");
          removeFileBtn.classList.add("hidden");
          uploadMsg.classList.add("hidden");
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane text-xs"></i> <span>Kirim ke Vault</span>`;
          await fetchGallery();
        }, 1500);
      } else {
        throw new Error();
      }
    } catch (e) {
      uploadMsg.innerText = "Gagal! Coba lagi nanti ya.";
      uploadMsg.className = "p-3 rounded-xl text-[10px] uppercase text-red-400 border border-red-500/30";
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fa-solid fa-paper-plane text-xs"></i> <span>Kirim ke Vault</span>`;
    }
  };
};

window.addEventListener("load", () => {
  // Terapkan tema tersimpan atau default
  const savedTheme = localStorage.getItem("selectedThemeArina") || "midnight";
  applyTheme(savedTheme);

  initSpace();
  animateSpace();

  // Memulai sistem guguran bunga & kelopak mewah
  initFallingFlowers();
  animateFlowers();

  // Inisialisasi interaksi klik buket bunga
  initBouquetInteractivity();

  fetchGallery();
  loadTrack(0);

  // Menjalankan sistem kembang api mewah
  runFireworksLoop();

  setInterval(updateCounter, 1000);
  updateCounter();

  updateBirthdayCountdown();
  setInterval(updateBirthdayCountdown, 60000);

  // Menghitung umur dinamis Rifki & Arina
  updateDynamicAges();
  setInterval(updateDynamicAges, 3600000); // Diperbarui berkala

  initInteractiveMessageControls();

  // Memulai perhitungan streak harian & setup modals
  initVisitStreak();
  initStreakModalControls();

  const toggleAnimBtn = document.getElementById("toggleAnimationsBtn");
  const toggleAnimIcon = document.getElementById("toggleAnimIcon");
  const toggleAnimText = document.getElementById("toggleAnimText");

  toggleAnimBtn.onclick = () => {
    animationsEnabled = !animationsEnabled;
    if (animationsEnabled) {
      // Gaya Aktif (Emerald/Hijau)
      toggleAnimBtn.classList.remove("bg-rose-500/20", "border-rose-400/30", "shadow-[0_0_15px_rgba(244,63,94,0.2)]");
      toggleAnimBtn.classList.add("bg-emerald-500/20", "border-emerald-400/30", "shadow-[0_0_15px_rgba(16,185,129,0.2)]");
      toggleAnimIcon.className = "fa-solid fa-toggle-on text-emerald-400 text-sm sm:text-base";
      toggleAnimText.innerText = "Animasi: ON";

      // Berikan sambutan kembang api kecil saat diaktifkan kembali
      triggerMassiveCelebration();
    } else {
      // Gaya Nonaktif (Rose/Merah)
      toggleAnimBtn.classList.remove("bg-emerald-500/20", "border-emerald-400/30", "shadow-[0_0_15px_rgba(16,185,129,0.2)]");
      toggleAnimBtn.classList.add("bg-rose-500/20", "border-rose-400/30", "shadow-[0_0_15px_rgba(244,63,94,0.2)]");
      toggleAnimIcon.className = "fa-solid fa-toggle-off text-rose-400 text-sm sm:text-base";
      toggleAnimText.innerText = "Animasi: OFF";
    }
  };

  setInterval(() => {
    formingName = !formingName;
  }, 10000);

  setTimeout(() => {
    document.getElementById("preloader").classList.add("fade-out");
    if (window.AOS) AOS.init({ duration: 1000, once: true });

    // Kejutan kembang api mewah 2 detik setelah preloader hilang!
    setTimeout(() => {
      triggerMassiveCelebration();
    }, 2000);
  }, 3000);
});

window.addEventListener("resize", () => {
  initSpace();
  resizeFlowersCanvas();
  resizeFwCanvas();
});
