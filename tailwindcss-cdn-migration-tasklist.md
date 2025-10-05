# Tailwind CSS CDN → Local Build Migration Task List

## 🔹 Preparation
- [ ] Ensure prerequisites: Node.js ≥16, npm ≥7, Git, modern browser, VS Code with Tailwind IntelliSense
- [ ] Create a Git backup branch before migration

## 🔹 Migration Steps
1. **Install Dependencies**
   - [ ] Install Tailwind CSS (v3), PostCSS, and Autoprefixer
   - [ ] Verify installation with `npm list`

2. **Create Configurations**
   - [ ] Add `tailwind.config.js` with correct `content` paths
   - [ ] Add `postcss.config.js` with Tailwind + Autoprefixer

3. **Set Up Styles**
   - [ ] Create `styles.css` with `@tailwind base; @tailwind components; @tailwind utilities;`
   - [ ] Add any custom base styles (background, icons, focus states)

4. **Integrate Styles**
   - [ ] Import `./styles.css` in `index.tsx` **before** `App`

5. **Remove CDN**
   - [ ] Remove `<script src="https://cdn.tailwindcss.com"></script>` from `index.html`
   - [ ] Remove any inline `<style>` tags used for base resets
   - [ ] Remove `class="bg-[#F0F1F5]"` or other CDN-specific inline styles

6. **Update Imports**
   - [ ] Remove external CDN import maps (if used)
   - [ ] Ensure all dependencies resolve from `node_modules`

7. **Update Build Tool**
   - [ ] Update `vite.config.ts` to include PostCSS and optimize dependencies

8. **Reset & Restart**
   - [ ] Clear Vite cache (`rm -rf node_modules/.vite`)
   - [ ] Restart dev server with `npm run dev`

9. **Browser Refresh**
   - [ ] Perform hard refresh (Ctrl+Shift+R / Cmd+Shift+R) to clear cached styles

## 🔹 Verification
- [ ] Visual inspection: colors, spacing, typography, icons, shadows
- [ ] Check hover states (`group-hover`, buttons, overlays)
- [ ] Test responsive breakpoints (mobile, tablet, desktop)
- [ ] Verify keyboard navigation & focus outlines
- [ ] Build for production (`npm run build`) and confirm reduced CSS size (~45KB)
- [ ] Run Lighthouse or DevTools audit (performance >90, no CDN requests, no console warnings)

## 🔹 Rollback Options
- [ ] Revert migration commit in Git
- [ ] Temporarily restore CDN script in `index.html`
- [ ] Switch back to backup branch if needed

## 🔹 Post-Migration Checklist
- [ ] All dependencies installed and configs created
- [ ] `styles.css` working and imported
- [ ] CDN removed from project
- [ ] Vite/PostCSS integration successful
- [ ] Dev + prod builds styling intact
- [ ] Git commits pushed and documentation updated

