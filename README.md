# CVsmartfilter – CV Filter Systemy

A web-based tool that streamlines the recruitment process by allowing recruiters to upload, parse, and score candidate CVs automatically. Built with **Next.js** and deployed on **Vercel**, CVsmartfilter saves time by filtering applicants against job criteria so only the best matches make it to your shortlist.

---


##  Live Version

**Project live at:** [Vercel – CV Filter System](https://vercel.com/mellisas-projects-b938dd2d/v0-cv-filter-system)  
**Build or tweak on:** [v0.dev Project](https://v0.dev/chat/projects/ODgVqX763YR)

---

##  How It Works

1. Create or edit your app on **v0.dev**.  
2. Deploy via the v0 interface.  
3. Changes auto-sync to this GitHub repo.  
4. Vercel grabs it and deploys the latest. Magic.

---

##  Tech Stack & Project Structure

- **TypeScript** (around 93.7%) — keep those types tight  
- **CSS** (about 6%) — because style matters  
- A little sprinkle of **JavaScript** (~0.3%) — legacy flair  
  :contentReference[oaicite:0]{index=0}

- Standard Next.js organization:
  - `app/`, `components/`, `lib/`, `public/`, `styles/`
  - Core configs: `next.config.mjs`, `postcss.config.mjs`, `tsconfig.json`
  - Dependency game: `package.json`, `pnpm-lock.yaml`

---

##  Getting Started (Run Locally)

Wanna run it yourself? Here's the lowdown:

```bash
git clone https://github.com/beltasia/CVsmartfilter.git
cd CVsmartfilter
pnpm install
pnpm run dev
