# paisasamjhoraj.com

Source of https://www.paisasamjhoraj.com, the money side of Samjho with Raj: free plain-English lessons
(budget, emergency fund, insurance, debt, compounding, inflation, mutual funds, SIP, costs, index funds, ETFs,
asset allocation, goals, retirement, global investing), calculators (SIP, step-up SIP, lumpsum, goal, inflation,
fee impact, EMI), the family Money Planner and the "Middle-Class Family Ka Money Plan" episode list.

- One static page: `index.html` (hash routes `#learn/<id>`, `#calculators/<id>`, `#planner`, `#series`, `#about`).
- Everything runs in the visitor's browser; nothing is sent anywhere.
- Every push to `main` publishes through `.github/workflows/pages.yml` (GitHub Pages, custom domain in repo Settings → Pages).
- Educational only, not investment advice. Keep the disclaimers when editing.

Tech lessons live in a separate repo and site: https://www.techsamjhoraj.com

## Deploy rules for everyone who pushes (25 Nov 2026)
1. Batch your changes into ONE push, then wait for the "Publish website" run to go green before the next push (runs now queue instead of cancelling each other).
2. If a run fails, "Re-run failed jobs" ONCE. The workflow already retries the deploy step once by itself, so a manual re-run is rarely needed; never re-run the same run twice (it leaves duplicate artifacts).
3. Never push empty "retry" commits; check the run page for the error first. Workflow changes need Raj's typed yes.
