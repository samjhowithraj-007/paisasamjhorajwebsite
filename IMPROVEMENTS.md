# paisasamjhoraj.com: improvement ideas

Ranked by impact vs effort. Ideas come from studying professional money sites (19 Oct 2026). **Ideas only: never copy their designs, text or images.**
Status: ✅ done (not live until Raj OKs the push) · ⬜ to do.
Rules for every change: keep the "educational, not advice" message, never promise returns, check every rate or rule against a primary source and write the date, test at phone (375 px) and desktop width, bump `sw.js` VERSION.

Sites studied: Groww SIP calculator, ET Money SIP calculator, Zerodha Varsity, NerdWallet, Ramsey Solutions (budget guide), Freefincal. Value Research and Investopedia blocked automated reading.

## Ranked list

| # | Idea | Seen on | Impact | Effort | Status |
|---|---|---|---|---|---|
| 1 | **"How this calculator works" + FAQ under every calculator**: plain formula, assumptions, 2 common questions. Helps trust and Google. | Groww, ET Money (definition → formula → example → FAQ → disclaimer) | High | Medium | ✅ |
| 2 | **Calculators grouped by purpose** (Grow · Plan · Protect and borrow) instead of one long row of 11 pills; same groups on the home page. | Groww, ET Money (related-calculator clusters) | High | Low | ✅ |
| 3 | **Share these numbers**: a link that opens the calculator with your inputs filled in (WhatsApp share on phones, copy link on desktop). | ET Money / Groww share icons; WhatsApp is how Indian families share | High | Low | ✅ |
| 4 | **Link preview card** (`img/og.png`, Open Graph + X card) so WhatsApp/X/Facebook show a proper image and title; plus WebSite/Organization structured data and a canonical link. | Every site studied | High | Low | ✅ |
| 5 | **Breadcrumbs + byline**: "Learn › Module" and "By Raj · N min read · Educational, not advice" on lessons; "Calculators › Group" on calculators; "Maths checked on <date>" under each calculator. | NerdWallet (author/editor bylines), Groww/ET Money (breadcrumbs) | Medium | Low | ✅ |
| 6 | **"Checked on" date + sources on each lesson**: verify every rule/rate in the 17 lessons against primary sources (RBI, SEBI, AMFI, Income Tax Dept, IRDAI), then show "Facts checked on <date>" with a short sources list. Don't show a date before the check is done. | NerdWallet (reviewer), Freefincal (sourcing policy) | High | Medium | ⬜ |
| 7 | **Worked example under each calculator** ("Verma family: ₹5,000 a month for 15 years…") using the calculator's own maths. | Groww, ET Money | Medium | Low | ⬜ |
| 8 | **Lesson table of contents + "Key takeaways" box at the top** (we only have "Remember" at the end). | Ramsey (guide contents), NerdWallet (summary under title) | Medium | Low | ⬜ |
| 9 | **About page as a trust page**: who Raj is, why the site exists, how content is made and checked (editorial note), how the site earns (sponsors labelled, no ads), corrections email. | NerdWallet / Freefincal (editorial policies), Zerodha Varsity (named creator) | High | Low | ⬜ |
| 10 | **Real per-page URLs for Google**: each lesson and calculator is a hash route today, so Google sees one page. Pre-render static pages (`/learn/sip/`, `/calculators/sip/`) with their own title, description and OG tags; add them to sitemap.xml. | All big sites (one URL per topic) | High | High | ⬜ |
| 11 | **Footer with columns** (Learn · Calculators · Money Plan · About/Privacy/Contact) instead of two lines of text. | Groww, ET Money, Varsity | Medium | Low | ⬜ |
| 12 | **Episode notes pages**: each Money Plan episode gets its own notes page with the video, notes and its calculator (the 50-episode plan). | Varsity (video + module pairing) | High | Medium | ⬜ |
| 13 | **"Start here" page** for first-time visitors: 3 steps (emergency fund → insurance → SIP) and which calculator to use. | Freefincal ("Start Here") | Medium | Low | ⬜ |
| 14 | **Calculator result as a downloadable/printable summary** (print stylesheet: inputs, results, disclaimer). | Bank and AMC calculators | Low | Low | ⬜ |
| 15 | **Speed check**: test with PageSpeed Insights on a phone profile; lazy-load below-the-fold images, keep the single-file approach. | General | Medium | Low | ⬜ |
| 16 | **Glossary** (NAV, expense ratio, XIRR, CAGR, MITC…) linked from lessons and FAQs. | Groww/ET Money A–Z and glossary links, Investopedia | Medium | Medium | ⬜ |

## Queued (from Raj via the Content Planner, 19 Oct 2026)

- ✅ **Fintech-grade redesign** (live 19 Oct 2026, same style family as techsamjhoraj.com; Lighthouse phone 97/100/100/100) ("professional and high tech"): polished hero with one CTA, card calculators with instant animated results, sticky summary, strong type scale, trust blocks; Lighthouse ≥ 90, reduced-motion, phone first, no heavy libraries. Before/after (phone + desktop) for Raj.
- ⬜ **Shop section** (in the new design): the money book when ready, Family Money Planner + Budget/EMI tracker templates once Payments sends the links; a soft "Get the full planner sheet" link on each calculator page.
- ⬜ **Gullak Bhai mascot** (clay piggy bank, kit in C:\samjhowithraj\brand\mascots\gullak-bhai\) once Raj approves the kit: hero, Ask Raj avatar or empty states, calculator results ("Gullak full!"), Shop. Keep the logo badge. Before/after + Raj OK before push.
- ⬜ **Link to the Workshops page** on techsamjhoraj.com ("Money + AI workshops").
- Never: investment, insurance or credit-card affiliate links, or AdSense (registration rules and trust).

Not doing: big "Invest now" buttons or fund recommendations (Groww/ET Money do this; we are education only), ad networks, login walls.

## Weekly ideas

New ideas from the weekly check (every Wednesday) go here, newest first, with "seen on" and a date. When Raj says "do the website ideas", pick from the ranked list and this section.
