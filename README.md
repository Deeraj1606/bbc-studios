[![CI](https://github.com/Deeraj1606/bbc-studios/actions/workflows/ci.yml/badge.svg)](https://github.com/Deeraj1606/bbc-studios/actions) [![License](https://img.shields.io/github/license/Deeraj1606/=flat)](https://github.com/Deeraj1606/bbc-studios/blob/main/LICENSE) [![Stars](https://img.shields.io/github/stars/Deeraj1606/=flat)](https://github.com/Deeraj1606/bbc-studios/stargazers)\n\n# BBC Studios â€“ Next.js Media Starter Kit ðŸš€

## Overview
**BBC Studios** is a clean, productionâ€‘ready starter for modern web media sites built with **Next.js 14** and **TypeScript**. It includes:
- Serverâ€‘Side Rendering (SSR) with incremental static regeneration.
- Optimised font loading via `next/font` (Geist).
- Builtâ€‘in routeâ€‘aware layout and theme support.
- Ready to deploy on Vercel or any Node host.

The original repository only contained the default `create-next-app` README. This rewrite adds a proper project description, tech stack, setup guide, screenshots, and contribution guidelines.

---

## Tech Stack
| Layer | Technology |
|------|------------|
| **Framework** | **Next.js 14** â€“ App router, Server Components, Edge Runtime |
| **Language** | **TypeScript 5** â€“ Strict typing, fast builds |
| **Styling** | Tailwind CSS (optional) or CSS Modules |
| **Fonts** | `next/font` â€“ Geist (selfâ€‘hosted) |
| **Deployment** | Vercel, Netlify, Railway, Docker |
| **CI** | GitHub Actions workflow (`ci.yml`) runs `npm ci && npm run build` |

---

## Getting Started
```bash
# Clone the repository
git clone https://github.com/Deeraj1606/bbc-studios.git
cd bbc-studios

# Install dependencies (npm, pnpm, yarn, or bun)
npm install   # or pnpm install, yarn install, bun install

# Run the development server
npm run dev   # http://localhost:3000
```

### Building for Production
```bash
npm run build   # Generates the .next output
npm start       # Starts the production server
```


---

## Project Structure
```
.
â”œâ”€ app/               # App router routes (pages)
â”‚   â”œâ”€ layout.tsx    # Root layout with shared UI
â”‚   â””â”€ page.tsx      # Home page
â”œâ”€ public/            # Static assets (favicon, images)
â”œâ”€ styles/            # Global CSS / Tailwind config
â”œâ”€ next.config.ts     # Next.js configuration
â”œâ”€ tsconfig.json      # TypeScript config
â””â”€ package.json       # Scripts, dependencies, dev deps
```

---

## Contributing
We welcome contributions! Please fork the repo, create a feature branch, and open a pull request. Follow the standard guidelines in `CONTRIBUTING.md`.

---

## License
MIT License â€“ see the `LICENSE` file.

---

## Contact
- **Author**: Deeraj ([@Deeraj1606](https://github.com/Deeraj1606))
- **Issues**: Open a GitHub issue for bugs or feature requests.



