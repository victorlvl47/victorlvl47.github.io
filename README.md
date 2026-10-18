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

All 23 projects from the previous portfolio are now included. The owner confirmed the first-six order: HEIC to PNG Converter, Alt Tags Generator, CV Hand Tracking, CV Pose Detection, CV Face Detection, CV Face Mesh. The remaining 17 follow their original v1 order. Titles, descriptions, and destination URLs for restored entries come from the previous repository JSON. Project categories are descriptive editorial labels. The Field Lead Tracker and CV Mouse GitHub links return successfully; their README files and CV Mouse source corroborate the descriptions and technology names.

CodePen blocks automated requests with HTTP 403 in this environment. Its twelve project URLs are preserved exactly from v1, but their current availability could not be independently confirmed. Nine CodePen entries have an empty `technologies` array because the old data does not specify a stack and the CodePen sources could not be inspected. The card omits the technology row in those cases rather than inventing a stack. React is retained for the other three CodePen projects because their v1 descriptions explicitly name it.

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
