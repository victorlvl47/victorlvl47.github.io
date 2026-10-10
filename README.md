# Victor Maldonado portfolio

Iteration 1 of the Backrooms redesign. This is a static Astro site for GitHub Pages and `victorlvl.xyz`.

## Local development

```sh
npm ci
npm run dev
npm run check
npm run build
```

The build emits `dist/index.html`, `dist/projects.json`, and `dist/CNAME`. The Pages workflow in `.github/workflows/pages.yml` is prepared for deployment from `main`; it has not been run as part of this local iteration.

## Content

`src/data/portfolio.json` is the only source for published portfolio copy, ordered projects, image URLs and alt text, contacts, and footer copy. `src/lib/portfolio.ts` validates required fields, URLs, image files, unique project IDs, seven contact entries, and the exact footer quote during the build. `src/pages/projects.json.ts` emits only projects after the first six for the browser's Load more control. Set `PORTFOLIO_CONTENT_URL` to a public raw JSON URL at build time to use the same data shape from Cloudinary later.

The first six cards and all contact information are in the initial HTML. The browser loads the remaining projects only after a visitor selects Load more. The batch size is `3` in `src/scripts/load-more.ts`.

### Content provenance and open confirmations

The nine published projects are selected from the previous portfolio data and cross-checked against public project repositories. The owner confirmed the first-six order: HEIC to PNG Converter, Alt Tags Generator, CV Hand Tracking, CV Pose Detection, CV Face Detection, CV Face Mesh. Those six link to distinct public repositories. The later three link to specific sections of the Hand Tracking and Pose MediaPipe repositories. Project categories are descriptive editorial labels; technology names come from the legacy data and repository README or files. The legacy site contained additional CodePen projects and a Field Lead Tracker entry. Their current destination or technologies could not all be independently confirmed during this pass, so they are not included in the published JSON. Whether those entries should be added remains an owner decision.

The seven contact URLs are copied from the existing portfolio. GitHub and the X handle are corroborated by the public GitHub profile. The owner confirmed that the existing Facebook, YouTube, LinkedIn, and Reddit destinations are current. The Email URL matches the visible address from the previous site.

## Placeholder image slots

The three local SVGs in `public/images/placeholders/` are intentional layout assets. Their empty HTML alt text makes them decorative. Replace the URLs and add descriptive alt text for meaningful final screenshots. Keep the CSS aspect ratios or remeasure before preparing artwork.

| Slot | CSS aspect ratio | Crop |
| --- | --- | --- |
| Hero corridor | 4:3 desktop, 7:6 mobile | Centered `object-fit: cover`; keep doorway near center. |
| Project card | 16:9 at all widths | Centered `object-fit: cover`; keep important UI away from edges. |
| Contact / footer room | 5:4 desktop, 7:6 mobile | Centered `object-fit: cover`; keep exit near center. |

Measured with headless Edge at the 1440 × 900 and 390 × 900 reference viewports, including the browser's vertical scrollbar:

| Slot | Desktop rendered size | Mobile rendered size | Final artwork crop guidance |
| --- | --- | --- | --- |
| Hero corridor | 647.31 × 485.48 px (4:3) | 335 × 287.14 px (7:6) | A 4:3 source loses about 6.25% at each side on mobile. Keep the doorway and exit sign in the central 87.5% of the source. |
| Each project card | 418.33 × 235.30 px (16:9) | 333 × 187.31 px (16:9) | Use 16:9 artwork. The centered cover fit does not crop a matching source. Keep project details away from the edges. |
| Contact / footer room | 616.50 × 493.19 px (5:4) | 335 × 287.14 px (7:6) | A 5:4 source loses about 3.33% at each side on mobile. Keep the open doorway near center. |

The mobile column has a 335 px content width at 390 px viewport width; the project image is 333 px wide because the card has 1 px borders. The desktop project tracks are about 420.33 px wide, also with 1 px borders. CSS `object-fit: cover` and the default centered `object-position` control all three crops. The build reserves these ratios before images load.
