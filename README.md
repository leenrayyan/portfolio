# Leen Rayyan — Portfolio

A cinematic WebGL portfolio. Solar system metaphor: the user is the sun, projects orbit as planets, research is a distant star, the NASA competition is a comet, skills form the nebula.

## Stack

- Vite + React 19 + TypeScript
- react-three-fiber + drei + react-postprocessing
- GSAP for camera transitions
- three-custom-shader-material for stylized surfaces
- maath for orbital math
- detect-gpu for lite-mode fallback

## Dev

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Deploys to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.
