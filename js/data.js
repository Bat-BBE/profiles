// BATERDENE.EXE — бүх агуулга нэг дор (MN / EN). Текстээ эндээс засна.
// Өнгө аяс: өөрийгөө магтах биш, тайван танилцуулах.

export const taglines = [
  "Still Becoming.",
  "Built in Silence.",
  "My Mind. My World.",
  "Creating My Own Path.",
];

// 3D бөмбөрцгийг тойрох 5 чанар
export const traits = {
  mn: [
    {
      k: "CREATIVE",
      t: "Бүтээлч",
      d: "Санаа толгойд минь удаан тогтдоггүй — код, дизайн эсвэл жижигхэн ч гэсэн бүтээл болох хүртэл.",
    },
    {
      k: "CURIOUS",
      t: "Сониуч",
      d: "Ямар нэг зүйл хэрхэн ажилладгийг ойлгох хүртлээ тайван суудаггүй.",
    },
    {
      k: "AMBITIOUS",
      t: "Тэмүүлэлтэй",
      d: "Өөртөө зорилго тавьж, түүнд хүрэх замаа өөрөө зурах дуртай.",
    },
    {
      k: "QUIET",
      t: "Нам гүм",
      d: "Чанга дуунаас илүү чимээгүй орчинд бодол минь тодордог.",
    },
    {
      k: "INDEPENDENT",
      t: "Бие даасан",
      d: "Сонголтоо өөрөө хийж, үр дүнг нь өөрөө хариуцахыг хүсдэг.",
    },
  ],
  en: [
    {
      k: "CREATIVE",
      t: "Creative",
      d: "An idea doesn't stay in my head for long — not until it becomes code, a design or some small thing I made.",
    },
    {
      k: "CURIOUS",
      t: "Curious",
      d: "I can't quite rest until I understand how something works.",
    },
    {
      k: "AMBITIOUS",
      t: "Ambitious",
      d: "I like setting my own goals and drawing my own way to them.",
    },
    {
      k: "QUIET",
      t: "Quiet",
      d: "My thoughts get clearer in silence than in noise.",
    },
    {
      k: "INDEPENDENT",
      t: "Independent",
      d: "I want to make my own choices and own their outcomes.",
    },
  ],
};

// Бодлын ертөнцийн гаригууд (3D дээр дарахад тайлбар гарна)
export const interests = {
  mn: [
    {
      icon: "</>",
      title: "Код",
      d: "Санааг бодит зүйл болгох миний хэрэгсэл.",
      color: "#9fe8ff",
    },
    {
      icon: "♪",
      title: "Хөгжим",
      d: "Бодлоо цэгцэлж, анхаарлаа төвлөрүүлдэг орон зай.",
      color: "#a99bff",
    },
    {
      icon: "▶",
      title: "Кино",
      d: "Ертөнцийг өөр хүний нүдээр харах боломж.",
      color: "#ff9ad5",
    },
    {
      icon: "?",
      title: "Судлах",
      d: "Шинэ зүйлийн цаана юу байгааг ухаж ойлгох.",
      color: "#8fffc1",
    },
    {
      icon: "…",
      title: "Бодох",
      d: "Чимээгүй мөчид санаанууд хоорондоо холбогддог газар.",
      color: "#ffd38a",
    },
  ],
  en: [
    {
      icon: "</>",
      title: "Code",
      d: "My tool for turning ideas into real things.",
      color: "#9fe8ff",
    },
    {
      icon: "♪",
      title: "Music",
      d: "The space where my thoughts settle and focus.",
      color: "#a99bff",
    },
    {
      icon: "▶",
      title: "Films",
      d: "A chance to see the world through someone else's eyes.",
      color: "#ff9ad5",
    },
    {
      icon: "?",
      title: "Exploring",
      d: "Digging into what's behind something new.",
      color: "#8fffc1",
    },
    {
      icon: "…",
      title: "Thinking",
      d: "Where ideas quietly connect.",
      color: "#ffd38a",
    },
  ],
};

export const values = {
  mn: [
    {
      k: "FREEDOM",
      t: "Эрх чөлөө",
      d: "Сонголтоо өөрөө хийж, замаа өөрөө бүтээх боломж.",
    },
    {
      k: "GROWTH",
      t: "Хөгжил",
      d: "Өчигдрийн өөрөөсөө жаахан ч гэсэн илүүг мэдэх.",
    },
    {
      k: "CONNECTION",
      t: "Харилцаа",
      d: "Итгэж болох хүмүүс, ойр дотно холбоо.",
    },
    {
      k: "ACHIEVEMENT",
      t: "Амжилт",
      d: "Хийсэн зүйлээрээ бодит үр дүн гаргах.",
    },
    {
      k: "MEANING",
      t: "Утга учир",
      d: "Зүгээр завгүй байх биш, яагаад хийж байгаагаа мэдэх.",
    },
    {
      k: "STABILITY",
      t: "Тогтвортой байдал",
      d: "Ирээдүй рүүгээ итгэлтэй, тайван алхах суурь.",
    },
  ],
  en: [
    {
      k: "FREEDOM",
      t: "Freedom",
      d: "Making my own choices and building my own path.",
    },
    {
      k: "GROWTH",
      t: "Growth",
      d: "Knowing a little more than yesterday's me.",
    },
    {
      k: "CONNECTION",
      t: "Connection",
      d: "People I can trust, and bonds that are close.",
    },
    {
      k: "ACHIEVEMENT",
      t: "Achievement",
      d: "Real results from the things I make.",
    },
    {
      k: "MEANING",
      t: "Meaning",
      d: "Not just being busy — knowing why I'm doing it.",
    },
    {
      k: "STABILITY",
      t: "Stability",
      d: "A steady base to walk into the future calmly.",
    },
  ],
};

// Хувь хүний бүлгүүд
export const text = {
  mn: {
    heroSub: "Өөрийн ертөнцийг алхам алхмаар бүтээж яваа нэгэн.",
    heroTrans:
      "Чи миний нэрийг мэднэ. Харин миний ертөнцийг хараахан мэдэхгүй.",
    hint: "доош гүйлгэ эсвэл бөмбөрцөгт хүр",
    who: {
      obj: "OBJECT 01 · IDENTITY · THE CORE",
      kicker: "01 — WHO AM I?",
      quote: "Би хэн болохоо бүтээж яваа хүн.",
      body: [
        "Сайн байна уу. Намайг Бат-Эрдэнэ гэдэг. Дундговьд өсөж, 2022–2026 онд МУИС-ийн Мэдээллийн технологи, электроникийн сургуульд суралцсан. Одоо веб хөгжүүлэгчээр ажиллаж байна.",
        "Технологи, бүтээлч санаа, дижитал ертөнц намайг татдаг. Чөлөөт цагаараа код бичиж, шинэ зүйл судалж, кино үзэж, хөгжим сонсож, заримдаа зүгээр л бодолтойгоо хамт ганцаараа байх дуртай.",
        "Өөрийгөө ганц үгээр тодорхойлж чадахгүй. Учир нь би одоо ч суралцаж, өөрчлөгдөж, хэн болохоо илүү сайн ойлгох замдаа явж байна.",
      ],
      outro:
        "Тиймээс энэ бол бүрэн танилцуулга биш — миний өнөөдрийн хувилбар.",
      traitsHint: "бөмбөрцгийг тойрох үгс дээр дарж нэг бүрчлэн уншаарай",
    },
    mind: {
      obj: "OBJECT 02 · MIND · THE THOUGHTS",
      kicker: "02 — INSIDE MY MIND",
      quote: "Чимээгүй байна гэдэг бодолгүй гэсэн үг биш.",
      body: [
        "Миний санаанууд ихэвчлэн чимээгүй мөчүүдэд төрдөг — хөгжим сонсож байхад, кино дуусах үед, эсвэл зүгээр л ганцаараа бодож суухад.",
        "Аливаа зүйлийг гаднаас нь хараад өнгөрөхөөс илүү цаана нь юу байгааг, яагаад ийм болсныг ойлгохыг хүсдэг.",
      ],
      outro:
        "Би бүх хариултыг мэддэггүй. Гэхдээ асуулт тавьж, туршиж, суралцах дуртай.",
      hint: "гаригууд дээр дарж үзээрэй",
    },
    builder: {
      obj: "OBJECT 03 · CREATION · THE BUILDER",
      kicker: "03 — THE BUILDER",
      quote: "Санаа бодит болох мөч.",
      body: [
        "Код миний хувьд зүгээр нэг команд биш — толгойд байгаа санааг бусад хүн ашиглаж болох зүйл болгох арга.",
        "Бүтээл бүр төгс байх албагүй. Гол нь бүтээл бүрээс нэг юм сурч, түүнийгээ дараагийн алхамдаа авч явах.",
      ],
      motto: "Imagine it. Build it. Improve it.",
      hint: "← чирж эргүүл · карт дээр дарж дэлгэрэнгүйг үз →",
    },
    quiet: {
      kicker: "04 — MY QUIET WORLD",
      quote: "Зарим зүйл зүгээр л мэдрэгдэхэд хангалттай.",
      body: [
        "Чөлөөт цагаа ихэвчлэн код, хөгжим, кино, бодолтойгоо өнгөрүүлдэг.",
        "Миний хувьд нам гүм гэдэг хоосон орон зай биш. Сонирхсон зүйлдээ бүрэн анхаарч, өөрийн хэмнэлээр байх боломж.",
        "Ертөнцийн бүх зүйл чанга, хурдан, анхаарал татам байх албагүй гэж би боддог.",
      ],
    },
    values: {
      kicker: "05 — WHAT MATTERS TO ME",
      quote: "Миний хувьд чухал зүйлс.",
      outro: "Эдгээрийн хооронд тэнцвэр олох нь миний замын нэг хэсэг.",
    },
    record: {
      kicker: "06 — THE RECORD",
      quote: "Замналын тэмдэглэл.",
      lead: "Энд хийж туулсан зүйлсээ товч тэмдэглэв — сурлага, тэмцээн, ажил, хамт ажилласан хүмүүсийн үг.",
      voicesHint:
        "Багш нар болон хамт ажилласан хүмүүсийн бичсэн тодорхойлолтоос · ← гүйлгэ →",
    },
    path: {
      obj: "OBJECT 04 · FUTURE · NEXT VERSION",
      kicker: "07 — MY OWN PATH",
      quote: "Би хүрсэн газраараа хязгаарлагдахгүй.",
      body: [
        "Одоогийн миний хамгийн том зорилго бол бие даасан байдал — чадвартаа тулгуурлан боломжоо бий болгож, шийдвэрээ өөрөө гаргаж, ирээдүйгээ өөрийн бүтээсэн зүйл дээр босгох.",
        "Хаана хүрэхээ бүрэн мэдэхгүй ч сурах зүйл, турших санаа, бүтээх юм надад хангалттай бий.",
      ],
      outro:
        "Бие даасан байдал миний хувьд очих цэг биш — алхам алхмаар бүтээх амьдралын хэв маяг.",
      done: "● Туулсан",
      plan: "◌ Дараагийн хувилбар",
    },
    vault: {
      kicker: "08 — UNKNOWN · ACCESS RESTRICTED",
      title: "ДАЛД ХЭСЭГ",
      lead: "Энэ ертөнцийн дөрвөн өнцөгт ◆ хэлтэрхий нуугдсан. Бүгдийг нь олбол код бүрдэнэ.",
      hint: "Hint: миний төрсөн сар + өдөр (MMDD).",
    },
    becoming: {
      kicker: "09 — STILL BECOMING",
      quote: "Би одоо ч өөрчлөгдсөөр.",
      body: [
        "Сонирхол минь өөрчлөгдөж магадгүй. Бодол минь шинэчлэгдэж магадгүй. Өнөөдөр мэдэхгүй байгаа зүйлээ маргааш сурна.",
        "Өөрийгөө бүрэн таньж дууссан гэж хэлэхгүй. Харин өөрийн ертөнцөө үргэлжлүүлэн бүтээсээр байна.",
      ],
      end: "Энэ бол төгсгөл биш — дараагийн хувилбарын эхлэл.",
      contact: "Холбогдох",
      invite: "Санаа хуваалцах, хамтдаа ямар нэг юм бүтээх бол — бичээрэй.",
    },
  },
  en: {
    heroSub: "Building my own universe, one step at a time.",
    heroTrans: "",
    hint: "scroll or touch the core",
    who: {
      obj: "OBJECT 01 · IDENTITY · THE CORE",
      kicker: "01 — WHO I AM",
      quote: "Still building who I am.",
      body: [
        "Hi, I'm Baterdene — a curious mind with an interest in technology, creative ideas, and digital experiences. I studied IT at the National University of Mongolia (2022–2026) and work as a web developer.",
        "I enjoy coding, music, films, and the quiet moments that leave room for thought.",
        "I'm still learning, still exploring, and still figuring out who I want to become.",
      ],
      outro: "So this isn't a full introduction — it's today's version of me.",
      traitsHint: "tap the words orbiting the core",
    },
    mind: {
      obj: "OBJECT 02 · MIND · THE THOUGHTS",
      kicker: "02 — HOW I THINK",
      quote: "Quiet doesn't mean empty.",
      body: [
        "I'm drawn to ideas that can become something real.",
        "Code gives me a way to build. Curiosity gives me a reason to explore. Creativity gives me room to imagine what doesn't exist yet.",
      ],
      outro:
        "I don't have all the answers. I like asking, testing and learning.",
      hint: "tap the planets",
    },
    builder: {
      obj: "OBJECT 03 · CREATION · THE BUILDER",
      kicker: "03 — THE BUILDER",
      quote: "The moment an idea becomes real.",
      body: [
        "To me, code isn't just commands. It's a way to turn an idea into something other people can use.",
        "Not every build has to be perfect. What matters is learning something from each one and carrying it into the next.",
      ],
      motto: "Imagine it. Build it. Improve it.",
      hint: "← drag to spin · tap a card →",
    },
    quiet: {
      kicker: "04 — MY WORLD",
      quote: "Some things only need to be felt.",
      body: [
        "I appreciate quiet spaces, personal freedom, meaningful connections, and the opportunity to keep growing.",
        "I don't believe I need to have everything figured out to keep moving forward.",
      ],
    },
    values: {
      kicker: "05 — WHAT MATTERS",
      quote: "What matters to me.",
      outro: "Finding the balance between these is part of my path.",
    },
    record: {
      kicker: "06 — THE RECORD",
      quote: "Notes from the road so far.",
      lead: "A short log of what I've been through — study, competitions, work, and words from people I've worked with.",
      voicesHint:
        "From reference letters by teachers and colleagues · ← swipe →",
    },
    path: {
      obj: "OBJECT 04 · FUTURE · NEXT VERSION",
      kicker: "07 — MY DIRECTION",
      quote: "Not limited by where I've been.",
      body: [
        "My goal is independence — building the skills, experience, and opportunities to shape my own future.",
        "I don't know every destination yet. But I have plenty to learn, ideas to test and things to build.",
      ],
      outro:
        "Independence isn't a finish line for me. It's a way of living, built step by step.",
      done: "● Been there",
      plan: "◌ Next version",
    },
    vault: {
      kicker: "08 — UNKNOWN · ACCESS RESTRICTED",
      title: "HIDDEN LAYER",
      lead: "Four fragments ◆ are hidden around this world. Find them all and the code assembles itself.",
      hint: "Hint: my birth month + day (MMDD).",
    },
    becoming: {
      kicker: "09 — STILL BECOMING",
      quote: "A snapshot of who I am becoming.",
      body: ["This website is not a finished definition of who I am."],
      end: "Not the end — the start of the next version.",
      contact: "Get in touch",
      invite:
        "If you'd like to share an idea or build something together — write to me.",
    },
  },
};

export const projects = [
  {
    id: "digipay",
    code: "PRJ-01",
    short: "DigiPay Hackathon",
    title: {
      mn: "Future of DigiPay Hackathon 2025",
      en: "Future of DigiPay Hackathon 2025",
    },
    tag: "FinTech · Hackathon",
    img: "assets/images/digipay.jpg",
    color: "#9fe8ff",
    badges: ["Top 7", "72h", "4th / Special"],
    desc: {
      mn: "ХААН Банкны DigiPay hackathon. Багаараа 72 цагийн дотор санаагаа prototype болгож, шилдэг 7 багийн нэгээр шалгарсан. Богино хугацаанд шийдвэр гаргах, санаагаа ойлгомжтой танилцуулахыг эндээс бодитоор сурсан.",
      en: "Khan Bank's DigiPay hackathon. Our team turned an idea into a prototype in 72 hours and made the top 7. It taught me how to decide fast and present an idea clearly.",
    },
    stack: ["Prototype", "Pitch", "FinTech UX", "Teamwork"],
    doc: "assets/docs/digipay-hackathon.pdf",
  },
  {
    id: "techsprint",
    code: "PRJ-02",
    short: "TechSprint 2026",
    title: {
      mn: "Санхүүгийн инновац TechSprint 2026",
      en: "Financial Innovation TechSprint 2026",
    },
    tag: "Innovation · Prototype",
    img: "assets/images/techprint.jpg",
    color: "#a99bff",
    badges: ["Top 10", "72h", "Prototype"],
    desc: {
      mn: "Санхүүгийн инновацын TechSprint. Бүтээгдэхүүний санаагаа хурдан туршиж, ажиллах prototype гаргасан. Шилдэг 10 багт багтсан.",
      en: "A financial-innovation sprint. We tested a product idea quickly and shipped a working prototype; our team was among the top 10.",
    },
    stack: ["Product", "Development", "Team"],
    doc: "assets/docs/techsprint-2026.pdf",
  },
  {
    id: "spark",
    code: "PRJ-03",
    short: "SPARK DAY 2026",
    title: {
      mn: "SPARK DAY 2026 төслийн уралдаан",
      en: "SPARK DAY 2026 project competition",
    },
    tag: "Product · Special Award",
    img: "assets/images/sparkday.jpg",
    color: "#ff9ad5",
    badges: ["Special award", "Product dev"],
    desc: {
      mn: "Оюутны төслийн уралдаан. Санаагаа бүтээгдэхүүний талаас нь бодож боловсруулан танилцуулж, тусгай байр авсан.",
      en: "A student project competition. I worked the idea through from a product point of view and received a special award.",
    },
    stack: ["Product Dev", "Pitch", "UX"],
    doc: "assets/docs/spark-day-2026.pdf",
  },
  {
    id: "diploma",
    code: "PRJ-04",
    short: "Дипломын ажил",
    title: {
      mn: "Монгол уламжлалт тоглоомын веб хөгжүүлэлт",
      en: "Traditional Mongolian games on the web",
    },
    tag: "Web · Game · Diploma",
    img: "assets/images/diploma.png",
    color: "#ffd38a",
    badges: ["4.0", "6 credits", "Web Game"],
    desc: {
      mn: "Дипломын ажлаараа Монгол уламжлалт тоглоомуудыг веб орчинд буулгасан. Өв соёлыг шинэ үеийнхэнд ойр болгох нь гол санаа байсан. Үнэлгээ 4.0.",
      en: "For my diploma I brought traditional Mongolian games to the browser — the idea was to bring heritage closer to a new generation. Graded 4.0.",
    },
    stack: ["Web", "Game Logic", "UI/UX"],
    doc: "assets/docs/diploma.pdf",
  },
  {
    id: "mmt",
    code: "PRJ-05",
    short: "ММТ 2026 Poster",
    title: {
      mn: "ММТ 2026 эрдэм шинжилгээний хурал",
      en: "MMT 2026 research conference",
    },
    tag: "Research · Poster",
    img: "assets/images/logos/mmta.png",
    logo: true,
    color: "#8fffc1",
    badges: ["Poster", "Research"],
    desc: {
      mn: "Судалгааны ажлаа ММТ 2026 эрдэм шинжилгээний хуралд poster хэлбэрээр танилцуулсан.",
      en: "Presented my research as a poster at the MMT 2026 IT research conference.",
    },
    stack: ["Research", "Presentation"],
    doc: "assets/docs/mmt-2026-poster.pdf",
  },
  {
    id: "coremind",
    code: "PRJ-06",
    short: "CoreMind",
    title: {
      mn: "CoreMind ХХК — Web Developer",
      en: "CoreMind LLC — Web Developer",
    },
    tag: "Work · 5+ projects",
    img: "assets/images/logos/coremind.png",
    logo: true,
    color: "#8cc4ff",
    badges: ["2026 →", "5+ projects"],
    desc: {
      mn: "Дадлагаа хийсэн газартаа үргэлжлүүлэн ажиллаж байна. Бодит хэрэглэгчтэй веб бүтээгдэхүүн дээр багтайгаа хамт ажилладаг.",
      en: "I stayed on where I did my internship. I work with the team on web products that real people use.",
    },
    stack: ["Frontend", "Web", "Production"],
    doc: null,
  },
];

// THE RECORD — бодит мэдээлэл нэг хэсэгт
export const record = {
  tabs: {
    mn: ["Сурлага", "Тэмцээн", "Ажил", "Бусдын үг", "Чөлөөт цаг"],
    en: ["Study", "Competitions", "Work", "Others' words", "Free time"],
  },
  study: {
    mn: {
      school: "МУИС · Мэдээллийн технологи, электроникийн сургууль",
      years: "2022 — 2026",
      gpa: [
        ["3.7", "Нийт голч дүн"],
        ["3.925", "Сүүлийн 4 улирал"],
        ["4.0", "Сүүлийн 2 улирал"],
        ["4.0", "Дипломын ажил"],
      ],
      note: "Төгсөх жилдээ ажил, дипломын ажил, тэмцээнээ зэрэг авч явсан. 2022 онд Дундговийн Эрдмийн далай цогцолбор 1-р сургуулийг “Шилдэг төгсөгч”-өөр төгссөн.",
    },
    en: {
      school: "National University of Mongolia · School of IT & Electronics",
      years: "2022 — 2026",
      gpa: [
        ["3.7", "Overall GPA"],
        ["3.925", "Last 4 semesters"],
        ["4.0", "Last 2 semesters"],
        ["4.0", "Diploma project"],
      ],
      note: "In my final year I balanced work, the diploma and competitions. Finished high school in Dundgovi in 2022 as best graduate.",
    },
  },
  wins: {
    mn: [
      ["2025", "DigiPay Hackathon", "Шилдэг 7 баг · 4-р байр / тусгай байр"],
      ["2026", "TechSprint", "Шилдэг 10 баг"],
      ["2026", "SPARK DAY", "Тусгай байр"],
      ["2026", "ММТ 2026", "Poster илтгэл"],
    ],
    en: [
      ["2025", "DigiPay Hackathon", "Top 7 · 4th / special place"],
      ["2026", "TechSprint", "Top 10 team"],
      ["2026", "SPARK DAY", "Special award"],
      ["2026", "MMT 2026", "Research poster"],
    ],
  },
  work: {
    mn: {
      role: "CoreMind ХХК — Web Developer",
      when: "2026 оноос · 5+ бодит төсөл",
      text: "Дадлагын дараа ажлын санал авч үргэлжлүүлэн ажиллаж байна. Мөн Хаан Банк, MCS/Unitel, Тэсо, Монос зэрэг байгууллагаас дадлага, ажлын санал ирж байсан.",
    },
    en: {
      role: "CoreMind LLC — Web Developer",
      when: "Since 2026 · 5+ real projects",
      text: "After my internship I was offered a job and stayed on. I also received internship and job offers from Khan Bank, MCS/Unitel, Teso and Monos.",
    },
  },
  life: {
    mn: [
      [
        "Сайн дурын ажил",
        "Улаан Загалмай, Best клубээр дамжуулан мод тарих, гудамж талбай цэвэрлэх ажилд оролцсон.",
      ],
      [
        "Спорт",
        "Волейболын II зэрэгтэй. Сагсан бөмбөг, теннис, шатар тоглох дуртай.",
      ],
      [
        "Хэлнүүд",
        "Англи хэлээ сайжруулж, хятад, япон, орос хэлийг анхан шатнаас нь сурч байна.",
      ],
      [
        "Гэр бүл",
        "Айлын дунд хүүхэд. Гэр бүлээрээ хүүхдүүдэд зориулж хашаа, байшин засах ажилд гар бие оролцсон.",
      ],
    ],
    en: [
      [
        "Volunteering",
        "Planted trees and cleaned up public spaces with the Red Cross and Best Club.",
      ],
      [
        "Sport",
        "Volleyball 2nd rank. I also enjoy basketball, tennis and chess.",
      ],
      [
        "Languages",
        "Improving my English; learning Chinese, Japanese and Russian from the basics.",
      ],
      [
        "Family",
        "The middle child. With my family I helped repair fences and homes for children.",
      ],
    ],
  },
};

export const logos = [
  ["num", "МУИС"],
  ["coremind", "CoreMind"],
  ["khanbank", "Хаан Банк"],
  ["unitel", "MCS / Unitel"],
  ["teso", "Тэсо"],
  ["monos", "Монос"],
  ["digipay", "DigiPay"],
  ["techsprints", "TechSprint"],
  ["spark", "SPARK DAY"],
  ["mmta", "ММТ 2026"],
];

// Тодорхойлолтоос авсан ишлэлүүд (бусдын үг — өөрчлөхгүй)
export const voices = [
  {
    name: "Дэд Проф. Б. Сувдаа",
    role: "Багш · МУИС",
    img: "assets/images/suvdaa.jpg",
    quote:
      "Мэргэжлийн ур чадвар, хариуцлага, бие даан суралцах чадвар, бүтээлч хандлагаараа үе тэнгийнхнээсээ онцгой ялгардаг.",
  },
  {
    name: "Д. Пүрэвсүрэн",
    role: "Гүйцэтгэх захирал · CoreMind ХХК",
    img: "assets/images/purvee.png",
    quote:
      "Хариуцлагатай, суралцах хурд сайтай, бодит төслийн орчинд хурдан дасан зохицож чаддаг залуу хөгжүүлэгч.",
  },
  {
    name: "Ц. Энхтуяа",
    role: "Багш · МУИС",
    img: "assets/images/enkhtuya.png",
    quote:
      "Идэвхтэй, хариуцлагатай, судалгааны сэтгэлгээтэй. Үр дүнгээ цэгцтэй, ойлгомжтой танилцуулдаг.",
  },
  {
    name: "Г. Энхзориг",
    role: "Вэб хөгжүүлэгчийн дарга · CoreMind ХХК",
    img: "assets/images/zorigoo.png",
    quote:
      "Шинэ технологи, шаардлагыг богино хугацаанд ойлгож, бодит хөгжүүлэлтэд үр дүнтэй оролцдог.",
  },
];

export const roadmap = {
  mn: [
    { year: "2022", title: "МУИС-д элсэж, IT-ийн суурь тавьсан", done: true },
    {
      year: "2025",
      title: "Hackathon-оор анхны бодит prototype-уудаа хийсэн",
      done: true,
    },
    {
      year: "2026",
      title: "CoreMind-д бодит бүтээгдэхүүн дээр ажиллаж эхэлсэн",
      done: true,
    },
    {
      year: "2028",
      title: "Frontend, backend, system design-ийг гүнзгийрүүлэх",
      done: false,
    },
    {
      year: "2030",
      title: "Бүтээгдэхүүн, баг, системийн түвшинд сэтгэдэг болох",
      done: false,
    },
    {
      year: "→",
      title: "Бие даасан байдалд хүрч, туршлагаа залуустай хуваалцах",
      done: false,
    },
  ],
  en: [
    {
      year: "2022",
      title: "Started university, built my IT foundations",
      done: true,
    },
    {
      year: "2025",
      title: "First real prototypes through hackathons",
      done: true,
    },
    {
      year: "2026",
      title: "Started building real products at CoreMind",
      done: true,
    },
    {
      year: "2028",
      title: "Go deeper into frontend, backend and system design",
      done: false,
    },
    {
      year: "2030",
      title: "Learn to think at the level of products, teams and systems",
      done: false,
    },
    {
      year: "→",
      title: "Reach independence and share what I've learned",
      done: false,
    },
  ],
};

export const docs = [
  { id: "cv", label: "CV", file: "assets/docs/cv.pdf" },
  {
    id: "transcript",
    label: { mn: "Дүнгийн хуулбар", en: "Transcript" },
    file: "assets/docs/transcript.pdf",
  },
  {
    id: "offers",
    label: { mn: "Ажлын санал", en: "Offers" },
    file: "assets/docs/offers.pdf",
  },
  {
    id: "diploma",
    label: { mn: "Диплом", en: "Diploma" },
    file: "assets/docs/diploma.pdf",
  },
  {
    id: "mmt",
    label: { mn: "ММТ poster", en: "MMT poster" },
    file: "assets/docs/mmt-2026-poster.pdf",
  },
];

// Нууц хэсэг: 4 хэлтэрхий цуглуулж кодыг тайлна (төрсөн сар+өдөр, ММDD).
export const SECRET_CODE = "0612";

export const secrets = {
  mn: [
    "Би айлын дунд хүүхэд. Сонсох, хүмүүсийг холбох нь миний чимээгүй давуу тал байж магадгүй.",
    "Санаанууд маань ихэвчлэн хөгжим сонсож, ганцаараа бодож байх үед төрдөг.",
    "Энэ сайт ч гэсэн “дараагийн хувилбар” руу чиглэсэн нэг алхам.",
    "Энд хүртэл ирсэн бол чи сониуч хүн байх нь. Хамтдаа ямар нэг юм бүтээвэл ямар вэ? →",
  ],
  en: [
    "I'm the middle child. Listening and connecting people might be my quiet strength.",
    "My ideas usually show up while I'm listening to music and thinking alone.",
    "Even this site is just one step toward the next version.",
    "If you made it this far, you must be curious. How about we build something together? →",
  ],
};

// Хувийн зургууд — бүлэг бүрт болон 3D далайн дээр хөвөх "дурсамжууд"
export const photos = [
  {
    id: "selfie",
    src: "assets/images/life/selfie.jpg",
    tag: "TODAY",
    caption: { mn: "Өнөөдрийн хувилбар.", en: "Today's version." },
    pos: "50% 40%",
  },
  {
    id: "graduation",
    src: "assets/images/life/graduation.jpg",
    tag: "2026 · NUM",
    caption: { mn: "Төгсөлтийн өдөр — нэг бүлгийн төгсгөл, дараагийнх нь эхлэл.", en: "Graduation day — one chapter ends, the next begins." },
    pos: "50% 44%",
  },
  {
    id: "together",
    src: "assets/images/life/together.jpg",
    tag: "CONNECTION",
    caption: { mn: "Ойр дотны хүмүүстэйгээ.", en: "With people close to me." },
    pos: "50% 45%",
  },
];
