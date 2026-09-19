# Abhinandana Bhatta Portfolio

Personal portfolio for **Abhinandana Bhatta (Abhivocopedia)** — CSE Student, Full-Stack Developer, Independent Builder.

## Design Reference

This portfolio is built in the visual language of [DSU DevHack 3.0](https://www.dsudevhack3.0/) — warm cream/off-white base, strong black typography, saturated mustard/yellow accents, deep green accents, bold filled color sections, and editorial spacing.

## Features

- **Hero** — Oversized typography with identity statement and interactive code visual
- **About** — Editorial layout with focus areas and current status
- **Education Train** — Horizontal scroll-driven railway journey (SSLC → PUC → ECE → CSE)
- **Skills** — 3D flip cards with 7 technical categories
- **Projects** — Editorial color-block compositions with 5 featured projects
- **Recognition** — Award card for DSU DevHack 2.0 Vultr Best Build (Weighnix)
- **Vex-R Manifesto** — Embedded in footer: MAKE SOMETHING, MAKE IT MATTER, MAKE MONEY
- **Beyond Code** — Compact strip: Tabla · Piano · Flute · Emcee
- **Contact** — Direct links to GitHub, LinkedIn, Instagram, YouTube, X, Photography, Email
- **Responsive** — Tested at 1440, 1280, 1024, 768, 430, 390, 360
- **Accessible** — Semantic HTML, keyboard navigation, ARIA labels, prefers-reduced-motion support

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build**: Vite 5
- **Styling**: CSS Modules with custom properties (no Tailwind)
- **Animation**: Framer Motion (selective use)
- **Fonts**: Space Grotesk (display), Inter (body), IBM Plex Mono (metadata)

## Project Structure

```
portfolio/
├── public/
│   ├── favicon.svg
│   └── images/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── EducationTrain.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Recognition.tsx
│   │   ├── BeyondCode.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   ├── profile.ts
│   │   ├── projects.ts
│   │   ├── education.ts
│   │   └── skills.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Commands

```bash
# Install dependencies
pnpm install
# or
npm install

# Development server
pnpm dev
# or
npm run dev

# Production build
pnpm build
# or
npm run build

# Preview production build
pnpm preview
# or
npm run preview
```

## Deployment

The project builds to static files in `dist/` and can be deployed to any static hosting:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

For GitHub Pages, set `base: '/repository-name/'` in `vite.config.ts`.

## Customization

### Profile Data
Edit `src/data/profile.ts` for:
- Name, identity, tagline, location
- Hero statement and bio
- Current education status
- Social links
- Vex-R philosophy lines
- Beyond Code items

### Projects
Edit `src/data/projects.ts` to add/modify projects:
- Title, description, category
- Tech stack
- Live/GitHub URLs
- Visual color theme
- Contribution, team, award info

### Education
Edit `src/data/education.ts` for timeline stations.

### Skills
Edit `src/data/skills.ts` for skill categories and technologies.

### Colors
Modify CSS custom properties in `src/styles/globals.css`:
```css
:root {
  --paper: #F5F0E2;
  --warm-white: #FFFDF6;
  --ink: #171717;
  --deep-green: #274D3A;
  --teal: #2C7C7A;
  --mustard: #E0AE3E;
  --orange: #C85C38;
  --brick-red: #A9493E;
  --olive: #72784E;
}
```

## Content Safety

All factual information is sourced from the user's profile README. No fictional employers, awards, metrics, or achievements are invented. Placeholders (`ADD LINK`, `COMING SOON`, `—`, `PROJECT DETAILS`) are used where source data is not available.

## License

MIT License — feel free to use as a reference for your own portfolio.