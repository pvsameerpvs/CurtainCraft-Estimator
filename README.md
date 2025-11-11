# CurtainCraft — Static Instant Estimate (React + TS + Tailwind)

A single-screen, non-scrollable homepage UI that estimates curtain pricing from size in **cm** and product type. It also lets you type a competitor price and instantly shows **our price at 40% less**.

## Features
- Width/Height in **centimeters**
- Product selector with four options
- Market estimate (AED/m²) and CurtainCraft price (40% lower)
- Optional competitor quote → automatic 40% lower price
- Clean, modern Tailwind UI; single screen; responsive

## Tech
- React 18 + TypeScript + Vite
- Tailwind CSS 3

## Run locally
```bash
npm install
npm run dev
```
Then open the printed local URL.

## Build
```bash
npm run build
npm run preview
```

## Deploy / Upload to Git
1. Create a new empty repo on GitHub.
2. In this folder:
```bash
git init
git add -A
git commit -m "Initial commit: CurtainCraft estimator"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```
