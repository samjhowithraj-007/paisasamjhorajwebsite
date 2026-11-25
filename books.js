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

  const BOOKS = [
    { id: "money-book-1", status: "live", price: 249,
      eds: [{ k: "en", label: "English", cart: "paisa-book-1-en", price: 249, gum: "https://samjhowithraj.gumroad.com/l/paisa-samjho-en", sample: "en" },
            { k: "hi", label: "हिंदी", cart: "paisa-book-1-hi", price: 249, gum: "https://samjhowithraj.gumroad.com/l/paisa-samjho-hindi", sample: "hindi" }],
      title: "Paisa Samjho: Salary se Savings tak", short: "Money Book 1",
      cover: "img/book/book-3d-en.jpg?v=1", flat: "img/book/cover-en.jpg?v=3", w: 388, h: 520,
      meta: "PDF · 242 pages · 20 chapters · English and हिंदी editions",
      blurb: "Raj's money book for Indian families. Follow the Verma family through 20 chapters: the rule, worked rupee examples, real money mistakes, practice with answers, a worksheet and a free calculator in every chapter.",
      inside: ["Where the salary goes, and a budget that fits a real family", "Needs, wants and social pressure", "Emergency fund: how much, and where to keep it", "Insurance basics: health and term cover", "Credit cards, EMIs and paying off loans in the right order", "SIP, mutual funds and index funds in plain words", "Goals: children's education, a home and retirement"],
      sample: true, pages: "Free sample: chapters 1 to 3, in English and हिंदी" },
    { id: "kauri-pocket-money", status: "soon", title: "Kauri's Pocket Money Adventure", short: "For kids",
      cover: "img/book/kauri-pocket-money.jpg", w: 600, h: 600, meta: "Kids' money book · ages 9 to 13 · English",
      blurb: "A story book for kids about pocket money: three jars, saving for something special and smart choices, with Kauri as the guide.", inside: [] },
    { id: "kauri-levels-up", status: "soon", title: "Kauri Levels Up: Money Smarts for Teens", short: "For teens",
      cover: "img/gullak3d/read.webp", w: 128, h: 128, art: true, meta: "Teen money book · English",
      blurb: "Kauri is back for teens: first earnings, UPI and online spending, saving goals and avoiding money traps.", inside: [] }
  ];
  const find = id => BOOKS.find(b => b.id === id);
  const canCart = () => !!window.Cart;   // the cart always works; CART_LIVE only decides whether checkout is open
  window.CART_LIVE = CART_LIVE;

  function buyBtns(b, big) {
    if (b.status !== "live") return `<span class="btn" aria-disabled="true">Coming soon</span>`;
    const sm = big ? "" : " sm";
    if (canCart()) return b.eds.map((e, i) => `<button type="button" class="btn${i ? "" : " cta"}${sm}" data-bk-cart="${e.cart}">Add to cart: ${e.label} · ₹${e.price}</button>`).join("") +
      (CART_LIVE ? "" : `<p class="bk-meta" style="width:100%">Checkout opens soon. Buy now on Gumroad: ${b.eds.map(e => `<a href="${e.gum}" target="_blank" rel="noopener">${e.label} ↗</a>`).join(" · ")}</p>`);
    return b.eds.map((e, i) => `<a class="btn${i ? "" : " cta"}${sm}" href="${e.gum}" target="_blank" rel="noopener">Buy: ${e.label} · ₹${e.price} ↗</a>`).join("");   // until the cart is live, both editions stay on Gumroad
  }
  function card(b) {
    const img = `<img src="${b.cover}" alt="${b.art ? "" : esc(b.title) + " book cover"}" width="${b.w}" height="${b.h}" loading="lazy"${b.art ? ' class="bk-art"' : ""}>`;
    return `<div class="item bk-card"><a class="art" href="#books/${b.id}">${img}</a>
      <div class="row" style="justify-content:flex-start"><span class="tag">${b.status === "live" ? "Out now" : "Coming soon"}</span><span class="tag">${esc(b.short)}</span></div>
      <h3><a href="#books/${b.id}">${esc(b.title)}</a></h3><p class="bk-meta">${esc(b.meta)}</p><p>${esc(b.blurb)}</p>
      ${b.status === "live" ? `<div class="row bk-price"><span class="price">₹${b.price}</span><small>per edition, plus tax at checkout</small></div>` : ""}
      <div class="row buy-row">${buyBtns(b)}</div>
      ${b.sample ? `<a class="bk-link" href="#books/${b.id}">See inside and read the free sample →</a>` : ""}</div>`;
  }
  function sheets() {
    if (typeof SHOP === "undefined" || !SHOP.length) return "";
    return `<h2 class="bk-h2">Money sheets</h2><p class="lead">Ready-made Excel / Google Sheets files that follow the lessons. Sold on Gumroad.</p><div class="shop">` +
      SHOP.map(x => `<div class="item"><div class="art"><img src="img/gullak3d/${x.pose}.webp" alt="" width="128" height="128" loading="lazy"></div>
      <div class="row" style="justify-content:flex-start"><span class="tag">${x.tag}</span><span class="tag">${x.sub}</span></div>
      <h3>${x.title}</h3><p>${x.text}</p><div class="row"><span class="price">₹${x.price}</span><a class="btn cta sm" href="${x.link}" target="_blank" rel="noopener">${x.cta} ↗</a></div></div>`).join("") + `</div>`;
  }
  function topbar() { return ""; }
  function store() {
    return `<div class="page-head"><div><div class="eyebrow">Books</div><h1>Money books from <em>Raj.</em></h1>
      <p class="lead">Plain-language money books for Indian families, kids and teens, with the Verma family and Gullak Bhai. Instant PDF download, nothing is printed or shipped.</p></div></div>
      ${topbar()}
      <div class="shop bk-grid">${BOOKS.map(card).join("")}</div>
      ${sheets()}
      ${faq()}
      <p class="disc" style="margin-top:18px">Financial education only, not advice. No product tips and no promised returns. ${CART_LIVE ? "Checkout is by Dodo Payments and needs a free login; tax is added on the payment page. We never see your card or UPI details." : "Checkout on this site opens soon; until then payment is on Gumroad. We never see your card or UPI details."}</p>`;
  }
  function faq() {
    return `<div class="bk-faq"><h2 class="bk-h2">Questions</h2>
      <details><summary>What do I get after paying?</summary><p>A PDF ebook. The download link is shown after payment and also sent to your email. Nothing is printed or shipped.</p></details>
      <details><summary>Why do I need to log in?</summary><p>${CART_LIVE ? "So your download goes to an email you have confirmed. Register or log in with your email and a 6-digit code; no password." : "Checkout on this site opens soon and will ask you to register or log in with your email (a 6-digit code, no password). Buying on Gumroad today needs no login."}</p></details>
      <details><summary>Which languages?</summary><p>Money Book 1 comes in English and हिंदी (Hindi). Each edition is a separate PDF; pick the one you want, or both.</p></details>
      <details><summary>Refunds?</summary><p>If the file does not arrive or does not open, write to us within 7 days. See the <a href="refund.html">refund policy</a>.</p></details></div>`;
  }
  function page(b) {
    return `<p class="bk-crumb"><a href="#books">Books</a> / ${esc(b.short)}</p>${topbar()}
      <div class="bk-page"><div class="bk-cover"><img src="${b.flat || b.cover}" alt="${b.art ? "" : esc(b.title) + " book cover"}" width="${b.flat ? 400 : b.w}" height="${b.flat ? 566 : b.h}"${b.art ? ' class="bk-art"' : ""}></div>
      <div><div class="eyebrow">${esc(b.short)}</div><h1>${esc(b.title)}</h1><p class="bk-meta">${esc(b.meta)}</p><p class="lead">${esc(b.blurb)}</p>
      ${b.status === "live" ? `<div class="row bk-price"><span class="price">₹${b.price}</span><small>per edition, plus tax at checkout · instant PDF</small></div>` : `<p><span class="tag">Coming soon</span></p>`}
      <div class="row buy-row">${buyBtns(b, true)}</div>
      ${b.sample ? `<h2 class="bk-h2">Read before you buy</h2><p>${esc(b.pages)}.</p><div class="row" style="justify-content:flex-start">${b.eds.map(e => `<button class="btn" type="button" onclick="openSample('${e.sample}')">Read free: ${e.label}</button>`).join("")}</div><small>Or download the sample PDF: <a href="books/paisa-samjho-sample-en.pdf" download>English</a> · <a href="books/paisa-samjho-sample-hindi.pdf" download>हिंदी</a></small>` : ""}
      ${b.inside.length ? `<h2 class="bk-h2">What's inside</h2><ul>${b.inside.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
      ${b.status === "soon" ? `<p>Want a note when it's out? Follow Paisa Samjho Raj on WhatsApp or Telegram (links at the bottom of the page).</p>` : ""}
      <p class="disc">Financial education only, not advice. No promised returns.</p></div></div>`;
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

  document.addEventListener("click", e => {
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
