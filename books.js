/* Paisa Samjho Raj (www.paisasamjhoraj.com): Books store, book pages, email-code login and account (25 Nov 2026).
   Same shape as the Tech site Books store (cart.js + Dodo checkout via the Worker, Supabase email code), Paisa theme.
   English only. Prices are display-only and must match the Dodo products (Dodo adds tax on top).
   Rules: financial education only, no promised returns, no discount codes on the site, book PDFs never in this repo (only the free sample).
   Exposes window.PSRBOOKS.route(page, id, query) -> {html, title}. Loaded before app.js; uses BOOK, SHOP, LANG and openSample from app.js at call time. */
(function () {
  // Turn on only when Raj has made the Dodo product, the Worker knows it and accepts this site, and Raj says yes.
  const CART_LIVE = false || (location.hostname === "localhost" && /[?&]cart=1/.test(location.search));   // localhost test: ?cart=1
  const AUTH = { supabaseUrl: "https://vnktvgiordacnyxbwaae.supabase.co", anonKey: "sb_publishable_e4fMGkoBfVsvvWudF9JTsQ_iWj-l8iT" };   // public key, same account system as techsamjhoraj.com
  const K_USER = "psr-user", K_SESS = "psr-session";
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const put = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const user = () => { const u = get(K_USER, null); return u && u.email ? u : null; };

  const PG = "img/book/pages/";
  const BOOKS = [
    { id: "money-book-1", status: "live", fam: "family", price: 249,
      eds: [{ k: "en", label: "English", cart: "paisa-book-1-en", price: 249, gum: "https://samjhowithraj.gumroad.com/l/paisa-samjho-en", sample: "en", cover: "img/book/cover-en.jpg?v=3" },
            { k: "hi", label: "हिंदी", cart: "paisa-book-1-hi", price: 249, gum: "https://samjhowithraj.gumroad.com/l/paisa-samjho-hindi", sample: "hindi", cover: "img/book/cover-hindi.jpg?v=1" }],
      title: "Paisa Samjho: Salary se Savings tak", short: "Money Book 1", pill: "English · हिंदी",
      cover: "img/book/book-3d-en.jpg?v=1", w: 388, h: 520,
      meta: "PDF · 242 pages · 20 chapters · English and हिंदी editions",
      blurb: "Raj's money book for Indian families. Follow the Verma family through 20 chapters: the rule, worked rupee examples, real money mistakes, practice with answers, a worksheet and a free calculator in every chapter.",
      more: "Each edition is a separate PDF, so pick English, हिंदी or both. The Verma family is fictional and every number is an example to redo with your own. Financial education, not advice.",
      gallery: [["img/book/book-3d-en.jpg?v=1", "Money Book 1, English edition cover"], ["img/book/cover-hindi.jpg?v=1", "Money Book 1, हिंदी edition cover"], [PG + "en-ch1-open.webp", "Chapter 1 opening page"], [PG + "en-ch1-mistakes.webp", "Real money mistakes page"], [PG + "hi-ch1-open.webp", "हिंदी edition, chapter 1 opening page"]],
      pills: ["20 chapters, 242 pages", "Worked rupee examples", "Free sample: chapters 1 to 3", "English and हिंदी"],
      why: [["The Verma family", "One fictional family from Lucknow, so every idea is a real-life rupee example and not a lecture."], ["Rule, example, mistake", "Each chapter gives the rule, worked examples and the real mistakes families make, with a better habit."], ["Practice with answers", "Do the practice page first, then check the answers at the back."], ["A worksheet and a calculator", "Fill the worksheet in pencil, then try the free calculator on this site."]],
      who: ["Salaried families who reach the 25th with an empty account", "Couples starting a first family budget", "First-time savers who want plain words, not jargon", "Parents who want to talk money with the family", "Anyone who wants to learn before choosing any product"],
      learn: ["Where the salary goes, with a 30-day expense log and 3 jars", "Needs, wants and social pressure", "Whether 50-30-20 fits your family", "Inflation and why savings must grow", "How big an emergency fund should be, and where to keep it", "Health and term insurance basics", "Credit card minimum due, EMIs and which loan to repay first", "UPI fraud and 20 rules for a family money plan"],
      details: [["Title", "Paisa Samjho: Salary se Savings tak"], ["Author", "Raj"], ["Language", "English and हिंदी, as separate PDFs"], ["Format", "PDF, instant download"], ["Pages", "242"], ["Chapters", "20"], ["Free sample", "Chapters 1 to 3, in English and हिंदी"]],
      stats: [["20", "chapters"], ["242", "pages"], ["2", "editions"]],
      levels: [["Basic", [["Where does the salary go?", 1], ["Need, want or pressure?", 12], ["Does 50-30-20 fit your family?", 23], ["Diwali doesn't come \"suddenly\"", 34], ["Inflation: the silent thief", 45], ["The salary went up. Why didn't the savings?", 56], ["The 15-minute money meeting", 67]]],
               ["Intermediate", [["The family report card: net worth", 78], ["How big should the emergency fund be?", 89], ["How to save your first ₹50,000", 100], ["Where to keep the emergency money", 111], ["Is the company health insurance enough?", 122], ["How much term insurance?", 133], ["Keep insurance and investment separate", 144]]],
               ["Expert", [["The credit card minimum due is a trap", 155], ["Three loans: which one first?", 166], ["Is no-cost EMI really free?", 177], ["The repo rate went up: same EMI, longer loan?", 188], ["UPI fraud: 5 mistakes", 199], ["20 rules, 1 family plan", 210]]]],
      pages: [[PG + "en-ch1-story.webp", "The Verma family story", "Chapter 1, English"], [PG + "en-ch1-jars.webp", "The 3 jars", "Chapter 1: one rule, three jars"], [PG + "en-ch3-example.webp", "A worked example", "Chapter 3: does 50-30-20 fit?"], [PG + "hi-ch1-story.webp", "हिंदी edition", "वर्मा परिवार की कहानी"]],
      faq: [["Which language should I pick?", "Money Book 1 comes in English and हिंदी. Each is a separate PDF with the same 20 chapters, so pick the one you read easiest, or both."], ["Can I read a free preview first?", "Yes. Chapters 1 to 3 are free, in English and हिंदी. Use the Read free buttons on this page."], ["Will this make me rich or promise returns?", "No. It is financial education, not advice. The numbers are examples with a fictional family, and nothing here is a promise of returns."], ["What do I get after paying?", "A PDF ebook. The download link is shown after payment and also sent to your email. Nothing is printed or shipped."], ["Something wrong with my copy?", "If the file does not arrive or does not open, write to us within 7 days. See the <a href=\"refund.html\">refund policy</a>."]],
      sample: true },
    { id: "kauri-pocket-money", status: "soon", fam: "kids", title: "Kauri's Pocket Money Adventure", short: "For kids", pill: "Ages 9–13",
      cover: "img/book/kauri-pocket-money.jpg", w: 600, h: 600, meta: "Kids' money book · ages 9 to 13 · English",
      blurb: "A story book for kids about pocket money: three jars, saving for something special and smart choices, with Kauri as the guide.",
      gallery: [["img/book/kauri-pocket-money.jpg", "Kauri's Pocket Money Adventure, book art"]], pills: ["Ages 9 to 13", "Story format", "English edition"] },
    { id: "kauri-levels-up", status: "soon", fam: "kids", title: "Kauri Levels Up: Money Smarts for Teens", short: "For teens", pill: "Teens",
      cover: "img/gullak3d/read.webp", w: 128, h: 128, icon: true, meta: "Teen money book · English",
      blurb: "Kauri is back for teens: first earnings, UPI and online spending, saving goals and avoiding money traps.",
      gallery: [["img/gullak3d/read.webp", "Gullak Bhai reading, placeholder art while the cover is made"]], pills: ["For teens", "UPI and online spending", "English edition"] }
  ];
  const find = id => BOOKS.find(b => b.id === id);
  const canCart = () => !!window.Cart;   // the cart always works; CART_LIVE only decides whether checkout is open
  window.CART_LIVE = CART_LIVE;

  /* Buy buttons. While checkout is off, the cart still collects items and the drawer sends people to Gumroad. */
  function buyBtns(b, big) {
    if (b.status !== "live") return `<span class="bk-btn" aria-disabled="true">Coming soon</span>`;
    if (canCart()) return b.eds.map((e, i) => `<button type="button" class="bk-btn${i ? "" : " pri"}" data-bk-cart="${e.cart}" aria-label="Add ${e.label} edition to cart, ₹${e.price}">${big ? "Add " : "+ "}${e.label} · ₹${e.price}</button>`).join("");
    return b.eds.map((e, i) => `<a class="bk-btn${i ? "" : " pri"}" href="${e.gum}" target="_blank" rel="noopener">Buy ${e.label} · ₹${e.price} ↗</a>`).join("");
  }
  const gumNote = b => CART_LIVE || !canCart() ? "" : `<p class="bk-note">Checkout opens soon. Buy now on Gumroad: ${b.eds.map(e => `<a href="${e.gum}" target="_blank" rel="noopener">${e.label} ↗</a>`).join(" · ")}</p>`;

  function card(b) {
    const stage = b.icon ? `<img class="ic" src="${b.cover}" alt="" width="${b.w}" height="${b.h}" loading="lazy">` : `<img class="cv" src="${b.cover}" alt="${esc(b.title)} book cover" width="${b.w}" height="${b.h}" loading="lazy">`;
    return `<article class="bk-card" data-cats="${b.fam}"><div class="bk-stage${b.icon ? " gold" : ""}"><span class="bk-pill">${esc(b.pill)}</span><span class="bk-badge">${b.status === "live" ? "Out now" : "Coming soon"}</span>${stage}</div>
      <div class="bk-body"><h3><a href="#books/${b.id}">${esc(b.title)}</a></h3><p class="bk-meta">${esc(b.meta)}</p>
      ${b.status === "live" ? `<div class="bk-price"><b>₹${b.price}</b><span>per edition · plus tax at checkout</span></div>` : `<div class="bk-price"><span>Price announced at launch</span></div>`}
      <div class="bk-btns" style="display:grid;grid-template-columns:${b.status === "live" ? "1fr 1fr" : "1fr"};gap:8px">${buyBtns(b)}</div>
      ${b.sample ? `<div class="bk-links"><a class="bk-link" href="#books/${b.id}">Read the free sample →</a></div>` : ""}</div></article>`;
  }
  function sheetCard(x) {
    return `<article class="bk-card" data-cats="sheets"><div class="bk-stage gold"><span class="bk-pill">${esc(x.tag)}</span><img class="ic" src="img/gullak3d/${x.pose}.webp" alt="" width="128" height="128" loading="lazy"></div>
      <div class="bk-body"><h3><a href="${x.link}" target="_blank" rel="noopener">${esc(x.title)}</a></h3><p class="bk-meta">${esc(x.sub)}</p>
      <div class="bk-price"><b>₹${x.price}</b><span>sold on Gumroad</span></div><a class="bk-btn pri" href="${x.link}" target="_blank" rel="noopener">${esc(x.cta)} ↗</a></div></article>`;
  }
  function store() {
    const sheets = typeof SHOP !== "undefined" ? SHOP : [];
    const B = BOOKS[0];
    return `<div class="bk" id="bk-top">
      <div class="hm-hero"><div class="hm-copy"><div class="bk-eyebrow">Books by Raj</div><h1>Money books for Indian families, in <em>plain words.</em></h1>
        <p class="bk-lead">Follow the Verma family from the salary credit to a family plan. Worked rupee examples, real mistakes and practice with answers, in English and हिंदी. Read the first chapters free before you buy.</p>
        <div class="bk-btns"><a class="bk-btn pri" href="#bk-lib" data-bk-go="bk-lib">Shop all books →</a><a class="bk-btn" href="#books/${B.id}">See inside Money Book 1</a></div>
        <ul class="hm-facts"><li><b>Instant</b> PDF download</li><li><b>Free</b> sample chapters</li><li><b>English</b> and <b>हिंदी</b></li></ul></div>
        <div class="hm-art" aria-hidden="true"><img class="a" src="img/book/cover-hindi.jpg?v=1" alt="" width="260" height="368"><img class="b" src="img/book/book-3d-en.jpg?v=1" alt="" width="300" height="402"><img class="c" src="img/book/kauri-pocket-money.jpg" alt="" width="240" height="240"><img class="g" src="img/gullak3d/happy.webp" alt="" width="76" height="76"><span class="hm-chip">Salary · Savings · Family</span></div></div>
      <section class="hm-trust" aria-label="Why buy here"><div><b>Instant download</b><span>Ebooks, nothing is shipped</span></div><div><b>Free previews</b><span>Read chapters 1 to 3 first</span></div><div><b>Your own numbers</b><span>Examples you redo for your family</span></div><div><b>Secure checkout</b><span>Payments by Dodo Payments</span></div></section>
      <section aria-labelledby="hm-g"><div class="bk-eyebrow">Pick a goal</div><h2 id="hm-g">What do you want to do?</h2>
        <div class="hm-gcards"><a class="hm-g" href="#bk-lib" data-bk-tab="family"><b>Fix the family budget</b><span>Salary, jars, emergency fund, insurance and loans.</span><i>Money Book 1 →</i></a><a class="hm-g" href="#bk-lib" data-bk-tab="kids"><b>Teach kids and teens</b><span>Pocket money and first earnings with Kauri, coming soon.</span><i>See the kids books →</i></a>${sheets.length ? `<a class="hm-g" href="#bk-lib" data-bk-tab="sheets"><b>Track it in a sheet</b><span>Ready-made Excel and Google Sheets files.</span><i>See the sheets →</i></a>` : ""}</div></section>
      <section id="bk-lib" aria-labelledby="bk-l"><div class="bk-libhead"><div><div class="bk-eyebrow">Our books</div><h2 id="bk-l">Every book, one shelf.</h2></div>
        <div class="bk-tabs" role="tablist" aria-label="Filter books">${[["all", "All"], ["family", "Family money"], ["kids", "Kids and teens"]].concat(sheets.length ? [["sheets", "Sheets"]] : []).map((t, i) => `<button type="button" class="bk-tab" role="tab" data-tab="${t[0]}" aria-selected="${i === 0}">${t[1]}</button>`).join("")}</div></div>
        <div class="bk-grid" id="bk-grid">${BOOKS.map(card).join("")}${sheets.map(sheetCard).join("")}</div>
        ${gumNote(B)}<p class="bk-note" style="margin-top:8px">Prices are in rupees, plus tax at checkout. Technology and exam books are on <a href="https://www.techsamjhoraj.com/#shop">our Tech site</a> and <a href="https://www.dimaagdada.com/reasoning-puzzles/">Dimaag Dada</a>.</p></section>
      <section aria-labelledby="bk-sets"><div class="bk-eyebrow">Sets</div><h2 id="bk-sets">Both editions together</h2>
        <div class="bk-set" style="margin-top:12px"><div class="im" aria-hidden="true"><img src="img/book/cover-en.jpg?v=3" alt="" width="60" height="85"><img src="img/book/cover-hindi.jpg?v=1" alt="" width="60" height="85"></div>
          <div class="tx"><h3>Money Book 1: English + हिंदी</h3><p>Both PDFs of Salary se Savings tak in one purchase. Sold on Gumroad.</p><div class="pr"><b>₹399</b> <span class="bk-note">for both editions</span></div><a class="bk-btn pri" href="https://samjhowithraj.gumroad.com/l/paisa-samjho-both" target="_blank" rel="noopener">Buy both on Gumroad ↗</a></div></div></section>
      <section aria-labelledby="bk-i"><h2 id="bk-i">Real pages from Money Book 1</h2><p class="bk-lead" style="margin:6px 0 0">Pages from the free sample. Swipe to see more.</p>
        <div class="bk-pages" role="list">${B.pages.map(g => `<figure role="listitem"><img src="${g[0]}" alt="${esc(g[1])}" width="642" height="909" loading="lazy"><figcaption><b>${esc(g[1])}</b> ${esc(g[2])}</figcaption></figure>`).join("")}</div>
        <div class="bk-btns" style="margin-top:8px"><button class="bk-btn" type="button" onclick="openSample('en')">Read free: English</button><button class="bk-btn" type="button" onclick="openSample('hindi')">Read free: हिंदी</button></div></section>
      <section aria-labelledby="bk-w"><h2 id="bk-w">Why our books</h2><ul class="bk-ticks"><li>Plain words and one family you can picture</li><li>Every sum uses rupees, and you redo it with your own numbers</li><li>A free sample of chapters 1 to 3 before you pay</li><li>Written by Raj, a technology architect with 20 years of experience</li></ul></section>
      ${faq()}
      <p class="bk-disc">Financial education only, not advice. No product tips and no promised returns. ${CART_LIVE ? "Checkout is by Dodo Payments and needs a free login; tax is added on the payment page. We never see your card or UPI details." : "Checkout on this site opens soon; until then payment is on Gumroad. We never see your card or UPI details."}</p></div>`;
  }
  function faq(list) {
    list = list || [["What do I get after paying?", "A PDF ebook. The download link is shown after payment and also sent to your email. Nothing is printed or shipped."],
      ["Why do I need to log in?", CART_LIVE ? "So your download goes to an email you have confirmed. Register or log in with your email and a 6-digit code; no password." : "Checkout on this site opens soon and will ask you to register or log in with your email (a 6-digit code, no password). Buying on Gumroad today needs no login."],
      ["Which languages?", "Money Book 1 comes in English and हिंदी (Hindi). Each edition is a separate PDF; pick the one you want, or both."],
      ["Refunds?", "If the file does not arrive or does not open, write to us within 7 days. See the <a href=\"refund.html\">refund policy</a>."]];
    return `<section class="bk-faq" aria-labelledby="bk-f"><h2 id="bk-f" style="margin-bottom:12px">Questions</h2>${list.map(q => `<details><summary>${esc(q[0])}</summary><p>${/<a /.test(q[1]) ? q[1] : esc(q[1])}</p></details>`).join("")}</section>`;
  }
  function page(b) {
    const live = b.status === "live", g = b.gallery;
    const imgs = g.map((x, i) => `<img src="${x[0]}" alt="${esc(x[1])}" ${i ? 'loading="lazy"' : ""} decoding="async">`).join("");
    const nav = g.length > 1 ? `<button type="button" class="pp-arrow l" data-pp-nav="-1" disabled aria-label="Previous picture">‹</button><button type="button" class="pp-arrow r" data-pp-nav="1" aria-label="Next picture">›</button>` : "";
    const price = live ? `<div class="pp-price"><b>₹${b.price}</b><span>per edition · plus tax at checkout</span></div>` : `<div class="pp-price"><span class="pp-soon">Price announced at launch</span></div>`;
    const rows = live ? b.eds.map((e, i) => `<label class="pp-row"><input type="checkbox" data-pp-pick="${e.cart}" ${i ? "" : "checked"}><img src="${e.cover}" alt="" width="40" height="52" loading="lazy"><span class="t">${esc(b.short)}: ${esc(e.label)}</span><span class="p">₹${e.price}</span></label>`).join("") : "";
    const others = BOOKS.filter(x => x.id !== b.id);
    const chap = b.levels ? `<section aria-labelledby="pp-ch"><h2 id="pp-ch">Inside the book: 20 chapters</h2><ol class="pp-chs" style="margin-top:12px">${b.levels.map(l => `<li class="lvl">${l[0]}</li>` + l[1].map(c => `<li><small>p.${c[1]}</small>${esc(c[0])}</li>`).join("")).join("")}</ol></section>` : "";
    return `<div class="bk bk-has-sticky pp">
      <p class="bk-note"><a class="bk-link" href="#books">← All books</a></p>
      <section class="pp-hero"><div class="pp-left"><div class="pp-gal"><span class="pp-badge">${live ? "Out now" : "Coming soon"}</span><div class="pp-track" tabindex="0" aria-label="Book pictures">${imgs}</div>${nav}${g.length > 1 ? `<span class="pp-count" id="pp-count">1 / ${g.length}</span>` : ""}</div>
        ${g.length > 1 ? `<div class="pp-thumbs" role="tablist" aria-label="All pictures">${g.map((x, i) => `<button type="button" class="pp-th" data-pp-th="${i}" aria-label="Show ${esc(x[1])}" aria-selected="${i === 0}"><img src="${x[0]}" alt="" width="58" height="72" loading="lazy"></button>`).join("")}</div>` : ""}</div>
        <div class="pp-info"><div class="bk-eyebrow">E-book · by Raj · ${esc(b.short)}</div><h1>${esc(b.title)}</h1>${price}
          <p class="pp-desc">${esc(b.blurb)}</p>${b.more ? `<details class="pp-more"><summary>View more</summary><p>${esc(b.more)}</p></details>` : ""}
          <ul class="pp-pills">${b.pills.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
          <div class="bk-btns" id="pp-cta">${buyBtns(b, true)}</div>${gumNote(b)}
          ${b.sample ? `<div class="bk-btns">${b.eds.map(e => `<button class="bk-btn" type="button" onclick="openSample('${e.sample}')">Read free: ${e.label}</button>`).join("")}</div><p class="bk-note">Free sample: chapters 1 to 3. Or download the PDF: <a href="books/paisa-samjho-sample-en.pdf" download>English</a> · <a href="books/paisa-samjho-sample-hindi.pdf" download>हिंदी</a></p>` : ""}
          <p class="bk-note">Ebook: nothing is printed or shipped. Financial education, not advice. No promised returns.</p></div></section>
      ${live ? `<section class="pp-pick" aria-labelledby="pp-h"><h2 id="pp-h">Choose your editions</h2><p class="bk-lead" style="margin:6px 0 12px">Tick the editions you want and add them to your cart together.</p><div class="pp-rows">${rows}</div><div class="pp-sum"><span id="pp-sum">1 selected · ₹${b.price} + tax</span><button type="button" class="bk-btn pri" data-pp-add>Add selected to cart</button></div><p class="bk-note" id="pp-msg" aria-live="polite"></p></section>` : ""}
      ${b.stats ? `<section class="pp-stats" aria-label="At a glance">${b.stats.map(t => `<div><b>${esc(t[0])}</b><span>${esc(t[1])}</span></div>`).join("")}</section>` : ""}
      ${b.why ? `<section aria-labelledby="pp-why"><h2 id="pp-why">Why choose this book</h2><div class="pp-cards">${b.why.map(t => `<div class="pp-card"><b>${esc(t[0])}</b><p>${esc(t[1])}</p></div>`).join("")}</div></section>` : ""}
      ${b.who ? `<section aria-labelledby="pp-who"><h2 id="pp-who">Who is it for</h2><ul class="pp-pills">${b.who.map(t => `<li>${esc(t)}</li>`).join("")}</ul></section>` : ""}
      ${b.learn ? `<section aria-labelledby="pp-learn"><h2 id="pp-learn">What you will learn</h2><ul class="pp-ticks">${b.learn.map(t => `<li>${esc(t)}</li>`).join("")}</ul></section>` : ""}
      ${b.details ? `<section aria-labelledby="pp-det"><h2 id="pp-det">Book details</h2><table class="pp-table"><tbody>${b.details.map(t => `<tr><th scope="row">${esc(t[0])}</th><td>${esc(t[1])}</td></tr>`).join("")}</tbody></table></section>` : ""}
      ${chap}
      ${b.pages ? `<section aria-labelledby="pp-pg"><h2 id="pp-pg">See a real page</h2><div class="pp-pages">${b.pages.map(x => `<figure><img src="${x[0]}" alt="${esc(x[1])}" width="642" height="909" loading="lazy"><figcaption><b>${esc(x[1])}</b> ${esc(x[2])}</figcaption></figure>`).join("")}</div></section>` : ""}
      ${b.faq ? faq(b.faq) : ""}
      <section aria-labelledby="pp-like"><h2 id="pp-like">You may also like</h2><div class="pp-like">${others.map(o => `<a class="pp-lk" href="#books/${o.id}"><img src="${o.cover}" alt="" width="64" height="64" loading="lazy"><b>${esc(o.short)}</b><span>${o.status === "live" ? "₹" + o.price : "Coming soon"}</span></a>`).join("")}</div></section>
      <div class="pp-bar" role="region" aria-label="Buy"><img src="${b.cover}" alt="" width="36" height="48"><div class="t"><b>${esc(b.short)}</b><span>${live ? "₹" + b.price + " · plus tax" : "Coming soon"}</span></div>${live ? (canCart() ? `<button type="button" class="bk-btn pri" data-bk-scroll="pp-cta">Buy</button>` : `<a class="bk-btn pri" href="${b.eds[0].gum}" target="_blank" rel="noopener">Buy on Gumroad</a>`) : `<span class="bk-btn" aria-disabled="true">Coming soon</span>`}</div>
      </div>`;
  }
  function thanks() {
    const u = user();
    try { if (window.Cart) Cart.clear(); } catch (e) {}
    return `<div class="page-head"><div><div class="eyebrow">Books</div><h1>Thank you!</h1>
      <p class="lead">If your payment went through, Dodo Payments shows the download link on the payment page and emails it${u ? ` to <b>${esc(u.email)}</b>` : ""}. Check your spam folder if it isn't there in a few minutes.</p></div></div>
      <p>Didn't get it within an hour? <a href="contact.html">Write to us</a> with the email you used and we'll send it again.</p>
      <p><a class="btn" href="#books">Back to the books</a></p>`;
  }

  /* ---- login: email, then a 6-digit code (Supabase email OTP) ---- */
  async function sb(path, body) {
    const r = await fetch(AUTH.supabaseUrl + "/auth/v1/" + path, { method: "POST", headers: { "Content-Type": "application/json", apikey: AUTH.anonKey }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.msg || j.error_description || "Something went wrong. Please try again."); return j;
  }
  function login(q) {
    const u = user();
    if (u) return `<div class="page-head"><div><div class="eyebrow">Account</div><h1>You're logged in</h1><p class="lead">As <b>${esc(u.email)}</b>.</p></div></div><p><a class="btn cta" href="#books">Go to the books</a> <a class="btn" href="#account">Account</a></p>`;
    setTimeout(() => wireLogin(q));
    return `<div class="bk-login item"><div class="eyebrow">Register or log in</div><h1>Register or log in with your email</h1>
      <p>New here or coming back, it works the same: we send a 6-digit code to your email. No password needed.</p>
      <form id="bk-l1"><label>Email<input id="bk-em" type="email" required maxlength="80" autocomplete="email" placeholder="you@example.com"></label><button class="btn cta" type="submit">Send the code</button></form>
      <form id="bk-l2" hidden><p id="bk-sent"></p><label>6-digit code<input id="bk-code" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required></label><button class="btn cta" type="submit">Log in</button> <button class="btn ghost sm" type="button" id="bk-re">Send a new code</button></form>
      <p class="bk-err" id="bk-err" role="alert"></p>
      <small>We use your email only to log you in and deliver your books. See the <a href="privacy.html">privacy policy</a>.</small></div>`;
  }
  function wireLogin(q) {
    const f1 = document.getElementById("bk-l1"), f2 = document.getElementById("bk-l2"), err = document.getElementById("bk-err"); if (!f1) return;
    let email = "";
    const send = async btn => { if (btn) btn.disabled = true; err.textContent = ""; try { await sb("otp", { email, create_user: true }); f1.hidden = true; f2.hidden = false; document.getElementById("bk-sent").textContent = "We sent a code to " + email + "."; document.getElementById("bk-code").focus(); } catch (x) { err.textContent = x.message; } if (btn) btn.disabled = false; };
    f1.addEventListener("submit", e => { e.preventDefault(); email = document.getElementById("bk-em").value.trim().toLowerCase(); send(f1.querySelector("button")); });
    document.getElementById("bk-re").addEventListener("click", () => send().then(() => { err.textContent = "A new code is on its way."; }));
    f2.addEventListener("submit", async e => {
      e.preventDefault(); const b = f2.querySelector("button[type=submit]"); b.disabled = true; err.textContent = "";
      try { const j = await sb("verify", { type: "email", email, token: document.getElementById("bk-code").value.trim() }); put(K_SESS, { at: j.access_token, exp: j.expires_at }); put(K_USER, { email });
        if (/(^|&)next=cart/.test(q || "")) { location.hash = "#books"; setTimeout(() => window.Cart && Cart.open(), 300); } else location.hash = "#books"; }
      catch (x) { err.textContent = x.message; b.disabled = false; }
    });
  }
  function account() {
    const u = user(); if (!u) { setTimeout(() => { location.hash = "#login"; }); return ""; }
    return `<div class="page-head"><div><div class="eyebrow">Account</div><h1>Your account</h1><p class="lead">Logged in as <b>${esc(u.email)}</b>.</p></div></div>
      <div class="item"><h3>Your books</h3><p>Your download links come by email from Dodo Payments after each purchase. Lost one? <a href="contact.html">Write to us</a> with this email and we'll send it again.</p></div>
      <p style="margin-top:14px"><a class="btn" href="#books">Books</a> <button class="btn ghost" type="button" data-bk-logout>Log out</button></p>`;
  }

  function ppSum() {
    const el = document.getElementById("pp-sum"); if (!el) return;
    const n = document.querySelectorAll("[data-pp-pick]:checked").length;
    el.textContent = n ? `${n} selected · ₹${n * 249} + tax` : "Nothing selected";
  }
  function ppSync(t) {
    const i = Math.round(t.scrollLeft / Math.max(1, t.clientWidth)), n = t.children.length, c = document.getElementById("pp-count");
    if (c) c.textContent = (i + 1) + " / " + n;
    document.querySelectorAll("[data-pp-th]").forEach(b => b.setAttribute("aria-selected", String(+b.dataset.ppTh === i)));
    const l = document.querySelector(".pp-arrow.l"), r = document.querySelector(".pp-arrow.r"); if (l) l.disabled = i === 0; if (r) r.disabled = i >= n - 1;
  }
  document.addEventListener("scroll", e => { if (e.target && e.target.classList && e.target.classList.contains("pp-track")) ppSync(e.target); }, true);
  document.addEventListener("keydown", e => { const t = e.target; if (t && t.classList && t.classList.contains("pp-track") && (e.key === "ArrowRight" || e.key === "ArrowLeft")) { e.preventDefault(); t.scrollBy({ left: (e.key === "ArrowRight" ? 1 : -1) * t.clientWidth, behavior: "smooth" }); } });
  document.addEventListener("change", e => { if (e.target.closest && e.target.closest("[data-pp-pick]")) ppSum(); });
  function setTab(t) {
    document.querySelectorAll(".bk-tab").forEach(b => b.setAttribute("aria-selected", String(b.dataset.tab === t)));
    document.querySelectorAll("#bk-grid .bk-card").forEach(c => { c.hidden = !(t === "all" || c.dataset.cats.split(" ").indexOf(t) >= 0); });
  }
  const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  function goTo(id) { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" }); }
  document.addEventListener("click", e => {
    const n = e.target.closest("[data-pp-nav]"); if (n) { const t = document.querySelector(".pp-track"); if (t) t.scrollBy({ left: +n.dataset.ppNav * t.clientWidth, behavior: "smooth" }); return; }
    const th = e.target.closest("[data-pp-th]"); if (th) { const t = document.querySelector(".pp-track"); if (t) t.scrollTo({ left: +th.dataset.ppTh * t.clientWidth, behavior: "smooth" }); return; }
    if (e.target.closest("[data-pp-add]")) {
      const ids = [...document.querySelectorAll("[data-pp-pick]:checked")].map(r => r.dataset.ppPick), m = document.getElementById("pp-msg");
      if (!ids.length) { if (m) m.textContent = "Tick at least one edition first."; return; }
      if (!window.Cart) { if (m) m.textContent = "The cart is not available right now. Please reload the page."; return; }
      ids.forEach(id => Cart.add(id)); Cart.open(); return;
    }
    const tab = e.target.closest(".bk-tab"); if (tab) { setTab(tab.dataset.tab); return; }
    const gt = e.target.closest("[data-bk-tab]"); if (gt) { e.preventDefault(); setTab(gt.dataset.bkTab); goTo("bk-lib"); return; }
    const sc = e.target.closest("[data-bk-go]"); if (sc) { e.preventDefault(); goTo(sc.dataset.bkGo); return; }
    const sb = e.target.closest("[data-bk-scroll]"); if (sb) { goTo(sb.dataset.bkScroll); return; }
    const c = e.target.closest("[data-bk-cart]"); if (c && window.Cart) { Cart.add(c.dataset.bkCart); Cart.open(); return; }
    const b = e.target.closest("[data-bk-buy]"); if (b && window.Cart) { Cart.add(b.dataset.bkBuy); Cart.open(); Cart.checkout(); return; }
    if (e.target.closest("[data-bk-open]") && window.Cart) { Cart.open(); return; }
    if (e.target.closest("[data-bk-logout]")) { put(K_USER, null); put(K_SESS, null); location.hash = "#books"; }
  });

  /* ---- header: Register / log in + cart, on every page (desktop bar and phone title bar) ---- */
  function header() {
    const u = user(), acct = u ? `<a class="hdr-acct" href="#account" title="${esc(u.email)}">👤 <span>Account</span></a>` : `<a class="hdr-acct" href="#login"><span>Register / Log in</span></a>`;
    const cart = `<button type="button" class="hdr-cart" data-bk-open aria-label="Cart">🛒<span data-cart-count></span></button>`;
    document.querySelectorAll(".bar-right, .app-title").forEach(el => {
      let h = el.querySelector(":scope > .hdr-acts"); if (!h) { h = document.createElement("div"); h.className = "hdr-acts"; el.classList.contains("app-title") ? el.querySelector("details").before(h) : el.prepend(h); }
      h.innerHTML = acct + cart;
    });
    try { window.dispatchEvent(new Event("storage")); } catch (e) {}
    if (window.Cart) { const n = Cart.count(); document.querySelectorAll("[data-cart-count]").forEach(x => { x.textContent = n ? String(n) : ""; x.setAttribute("data-n", String(n)); }); }
  }
  document.addEventListener("DOMContentLoaded", header);
  addEventListener("hashchange", () => setTimeout(header));
  addEventListener("cart:change", header);

  window.PSRBOOKS = {
    books: BOOKS, user,
    route(p, id, q) {
      if (p === "login") return { html: login(q), title: "Register or log in · Paisa Samjho Raj" };
      if (p === "account") return { html: account(), title: "Account · Paisa Samjho Raj" };
      if (id === "thanks") return { html: thanks(), title: "Thank you · Paisa Samjho Raj" };
      const b = id && find(id);
      if (b) return { html: page(b), title: `${b.title} · Paisa Samjho Raj` };
      return { html: store(), title: "Money books by Raj · Paisa Samjho Raj" };
    }
  };
})();
