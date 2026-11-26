/* Paisa Samjho Raj: book cart (adapted from the Tech site cart, 25 Nov 2026). Items are ids only (no prices stored). Prices below are display-only and must match the Dodo products;
   the Worker action "checkout" maps ids to Dodo products and Dodo charges its own price. English by default.
   API: Cart.add(id) Cart.remove(id) Cart.items() Cart.count() Cart.clear() Cart.open() Cart.close() Cart.checkout() Cart.total() Cart.info(id)
   Events on window: "cart:change" (detail {items}), "cart:login" (cancelable; fired when checkout needs a login first). */
(function () {
  var WORKER = window.CART_WORKER || "https://naukri-saathi.techsamjhoraj.workers.dev", KEY = "psr-cart";   // CART_WORKER is only set on local test pages
  var PRODUCTS = window.CART_PRODUCTS = window.CART_PRODUCTS || [
    { id: "paisa-book-1-en", title: "Paisa Samjho: Salary se Savings tak (Money Book 1, English PDF)", price: 249, cover: "img/book/cover-en.jpg?v=3", gum: "https://samjhowithraj.gumroad.com/l/paisa-samjho-en" },
    { id: "paisa-book-1-hi", title: "पैसा समझो: सैलरी से सेविंग्स तक (Money Book 1, हिंदी PDF)", price: 249, cover: "img/book/cover-hindi.jpg?v=1", gum: "https://samjhowithraj.gumroad.com/l/paisa-samjho-hindi" }
  ];
  var ALIAS = {};
  function norm(id) { id = String(id || ""); return ALIAS[id] || id; }
  function info(id) { id = norm(id); for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function load() { try { var a = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(a) ? a.filter(function (x) { return info(x); }) : []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
  function fire() { badge(); render(); try { window.dispatchEvent(new CustomEvent("cart:change", { detail: { items: items() } })); } catch (e) {} }
  function items() {
    var a = load();
    return a;
  }
  function add(id) { id = norm(id); if (!info(id)) return false; var a = load(); if (a.indexOf(id) < 0) a.push(id); save(a); fire(); return true; }
  function remove(id) { id = norm(id); save(load().filter(function (x) { return x !== id; })); fire(); }
  function clear() { save([]); fire(); }
  function total() { return items().reduce(function (s, id) { return s + info(id).price; }, 0); }
  function user() { try { var u = JSON.parse(localStorage.getItem("psr-user") || "null"); return u && u.email ? u : null; } catch (e) { return null; } }

  /* ---- drawer + badge (Tech drawer layout, Paisa colours) ---- */
  var box, st;
  function css() {
    if (st) return; st = document.createElement("style");
    st.textContent = ".tsr-cart-badge{display:inline-block;min-width:18px;padding:0 5px;margin-left:4px;border-radius:9px;background:#eca722;color:#2a1b00;font:700 12px/18px system-ui,sans-serif;text-align:center}.tsr-cart-badge:empty,.tsr-cart-badge[data-n=\"0\"]{display:none}" +
      ".tsr-cart{position:fixed;inset:0;z-index:99999;display:none}.tsr-cart.on{display:block}.tsr-cart .bg{position:absolute;inset:0;background:rgba(10,25,18,.5)}" +
      ".tsr-cart .pn{position:absolute;right:0;top:0;bottom:0;width:min(440px,100%);background:#fffdf8;color:#153c2a;overflow:auto;font:15px/1.45 system-ui,sans-serif;box-shadow:-6px 0 30px rgba(0,0,0,.28);display:flex;flex-direction:column}" +
      ".tsr-cart .hd{display:flex;align-items:center;gap:10px;padding:18px 20px;border-bottom:1px solid #dfe3d2}.tsr-cart .hd h2{margin:0;font-size:24px;color:#153c2a!important}:root[data-theme=\"dark\"] .tsr-cart .hd h2{color:#e9f1ec!important}.tsr-cart .cnt{min-width:26px;height:26px;border-radius:13px;background:#eca722;color:#2a1b00;font:700 14px/26px system-ui,sans-serif;text-align:center;padding:0 7px}" +
      ".tsr-cart .xx{margin-left:auto;width:38px;height:38px;border-radius:50%;border:0;background:transparent;font-size:26px;line-height:1;cursor:pointer;color:inherit}" +
      ".tsr-cart .strip{background:#e7edd9;padding:11px 20px;font-size:14px;text-align:center;color:#2f4a3a}.tsr-cart .strip b{color:#15803d}" +
      ".tsr-cart .items{padding:6px 20px;flex:1}.tsr-cart .row{display:grid;grid-template-columns:52px 1fr auto;gap:12px;align-items:center;padding:14px 0;border-bottom:1px solid #dfe3d2}" +
      ".tsr-cart .row img{width:52px;height:68px;object-fit:contain;border-radius:6px;background:#e7edd9}.tsr-cart .row .tt{font-weight:600}.tsr-cart .row .pr{font-weight:700;text-align:right}" +
      ".tsr-cart .rm{border:0;background:none;color:#b91c1c;padding:4px 0;font:inherit;font-size:13px;cursor:pointer;text-decoration:underline}" +
      ".tsr-cart .sum{padding:14px 20px 20px;border-top:1px solid #dfe3d2}.tsr-cart .ln{display:flex;justify-content:space-between;gap:10px;margin:6px 0}.tsr-cart .ln.big{font-size:20px;font-weight:700;margin:10px 0}" +
      ".tsr-cart .note{font-size:13px;color:#536459;margin:8px 0 0}.tsr-cart .go{display:block;width:100%;box-sizing:border-box;margin-top:12px;min-height:52px;line-height:52px;border-radius:14px;border:0;background:#104732;color:#fff!important;font:700 17px system-ui,sans-serif;text-align:center;text-decoration:none;cursor:pointer;padding:0 10px}.tsr-cart .go[disabled]{opacity:.6}.tsr-cart a.go{margin-top:8px;display:flex;align-items:center;justify-content:center;line-height:1.25;padding:10px}" +
      ".tsr-cart .trust{margin-top:12px;text-align:center;font-size:13px;color:#536459}.tsr-cart .empty{padding:40px 20px;text-align:center}.tsr-cart .empty a{color:#104732;font-weight:700}.tsr-cart .soon{margin:12px 0 0}" +
      ":root[data-theme=\"dark\"] .tsr-cart .pn{background:#101915;color:#e9f1ec}:root[data-theme=\"dark\"] .tsr-cart .hd,:root[data-theme=\"dark\"] .tsr-cart .row,:root[data-theme=\"dark\"] .tsr-cart .sum{border-color:#24332b}:root[data-theme=\"dark\"] .tsr-cart .strip{background:#16241d;color:#c9dacf}:root[data-theme=\"dark\"] .tsr-cart .strip b{color:#4ade80}:root[data-theme=\"dark\"] .tsr-cart .row img{background:#1d2c24}:root[data-theme=\"dark\"] .tsr-cart .go{background:#3ccf8e;color:#04140c!important}:root[data-theme=\"dark\"] .tsr-cart .note,:root[data-theme=\"dark\"] .tsr-cart .trust{color:#9fb1a7}:root[data-theme=\"dark\"] .tsr-cart .rm{color:#f87171}:root[data-theme=\"dark\"] .tsr-cart .empty a{color:#3ccf8e}";
    document.head.appendChild(st);
  }
  function ensure() {
    if (box) return; css(); box = document.createElement("div"); box.className = "tsr-cart"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Your cart");
    box.innerHTML = "<div class='bg'></div><div class='pn'></div>"; document.body.appendChild(box);
    box.querySelector(".bg").addEventListener("click", close);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function render() {
    if (!box) return; var a = items(), p = box.querySelector(".pn"), off = window.CART_LIVE === false;
    p.innerHTML = "<div class='hd'><h2>Cart</h2>" + (a.length ? "<span class='cnt'>" + a.length + "</span>" : "") + "<button type='button' class='xx' data-close aria-label='Close cart'>&times;</button></div>" +
      (a.length ? "<div class='strip'><b>Instant download</b> after payment &middot; ebooks, nothing is shipped</div><div class='items'>" +
        a.map(function (id) { var i = info(id); return "<div class='row'>" + (i.cover ? "<img src='" + esc(i.cover) + "' alt='' width='52' height='68'>" : "<span></span>") + "<div><div class='tt'>" + esc(i.title) + "</div><button type='button' class='rm' data-rm='" + id + "'>Remove</button></div><div class='pr'>Rs " + i.price + "</div></div>"; }).join("") + "</div>" +
        "<div class='sum'><div class='ln big'><span>Estimated total</span><span>Rs " + total() + "</span></div>" +
        "<p class='note'>Plus tax. The final amount is shown on the " + (off ? "payment page" : "secure Dodo Payments page") + ".</p>" +
        (off
          ? "<p class='soon'><b>Checkout on this site opens soon.</b> Buy on Gumroad now:</p>" + a.map(function (id) { var i = info(id); return i.gum ? "<a class='go gum' href='" + i.gum + "' target='_blank' rel='noopener'>Buy on Gumroad: " + esc(i.title.replace(/^.*\((Money Book 1, )?/, "").replace(/\)$/, "")) + " &#8599;</a>" : ""; }).join("")
          : "<button type='button' class='go' data-go>Check out</button><p class='trust'>Secure payment by Dodo Payments</p>") + "<p class='note' id='tsrCartMsg' aria-live='polite'></p></div>"
        : "<div class='empty'><p>Your cart is empty.</p><p><a href='#books' data-close>See the books</a></p></div>");
    p.onclick = function (e) {
      var t = e.target; if (t.hasAttribute("data-close")) close(); var r = t.getAttribute("data-rm"); if (r) remove(r); if (t.hasAttribute("data-go")) checkout();
    };
  }
  function badge() { var n = items().length; [].forEach.call(document.querySelectorAll("[data-cart-count]"), function (el) { el.textContent = n ? String(n) : ""; el.setAttribute("data-n", String(n)); if (!/tsr-cart-badge/.test(el.className)) el.className += " tsr-cart-badge"; }); }
  var last; function open() { ensure(); render(); last = document.activeElement; box.classList.add("on"); var f = box.querySelector("[data-close]"); if (f) f.focus(); }
  function close() { if (box) box.classList.remove("on"); try { if (last && last.focus) last.focus(); } catch (e) {} }
  function msg(t) { var m = document.getElementById("tsrCartMsg"); if (m) m.textContent = t; }

  function checkout(opts) {
    opts = opts || {}; if (window.CART_LIVE === false) { open(); return Promise.resolve(false); } var a = items(); if (!a.length) { msg("Your cart is empty."); return Promise.resolve(false); }
    var u = user();
    if (!u) {   // log in first, so the key email is a verified one
      var ok = true; try { ok = window.dispatchEvent(new CustomEvent("cart:login", { cancelable: true })); } catch (e) {}
      if (ok) location.href = "/#login?next=cart"; else close();
      return Promise.resolve(false);
    }
    var btn = box && box.querySelector("[data-go]"); if (btn) { btn.disabled = true; btn.textContent = "Opening payment..."; }
    return fetch(WORKER, { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "checkout", items: a, email: u.email, return_url: opts.return_url || "https://www.paisasamjhoraj.com/#books/thanks" }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
      .then(function (x) {
        if (x.ok && x.d.checkout_url) { try { window.dispatchEvent(new CustomEvent("cart:checkout")); } catch (e) {} location.href = x.d.checkout_url; return true; }
        throw new Error(x.d && x.d.error || "failed");
      }).catch(function (e) {
        if (btn) { btn.disabled = false; btn.textContent = "Check out"; }
        msg(String(e.message) === "limit" ? "Too many tries. Please wait a little and try again." : "Payment could not be opened right now. Please try again in a minute.");
        return false;
      });
  }

  window.Cart = { add: add, remove: remove, items: items, count: function () { return items().length; }, clear: clear, open: open, close: close, checkout: checkout, total: total, info: info, products: PRODUCTS };
  document.addEventListener("DOMContentLoaded", function () { badge(); });
  window.addEventListener("storage", function (e) { if (e.key === KEY) fire(); });
  badge();
})();
