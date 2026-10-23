# Ayah & Khaled — Engagement Invitation

React + TypeScript + Vite + MUI + Framer Motion.

## Run locally
```
npm install
npm run dev
```
Production build: `npm run build` (output in `dist/`).

## Google Form
`GOOGLE_FORM_URL` in `src/data/invitation.ts` (must be the responder `/viewform` link, not `/edit`).

## Replace artwork
Replace `public/images/couple.svg` (photo placeholder) and `public/images/owl.svg` (owl placeholder), then update the paths in `IMAGES` in `src/data/invitation.ts` if the file extension changes.

## Deploy
```
git init && git add . && git commit -m "Invitation"
git remote add origin <your-github-repo-url>
git push -u origin main
```
On vercel.com: Add New Project, import the repo, keep the Vite defaults, Deploy. Share the resulting `*.vercel.app` link with guests.
