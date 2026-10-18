import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

export interface ImageContent { url: string; alt: string }
export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  image: ImageContent;
  projectUrl: string;
}
export interface Portfolio {
  site: { name: string; role: string; tagline: string; description: string };
  navigation: { label: string; href: string }[];
  hero: { eyebrow: string; primaryAction: string; secondaryAction: string; previewLabel: string; previewText: string; previewLinkLabel: string; previewLinkUrl: string; image: ImageContent };
  work: { eyebrow: string; heading: string; intro: string; projectAction: string; loadAction: string; loadingAction: string; retryAction: string; loadError: string; endMessage: string };
  projects: Project[];
  contact: { eyebrow: string; heading: string; intro: string; email: string; emailAction: string; linksLabel: string; links: { label: string; url: string }[] };
  footer: { mark: string; location: string; quote: string; quoteAttribution: string; topAction: string; image: ImageContent };
}

// Vite relocates server modules during an Astro build, so resolve the local source from the project root.
const sourceFile = path.resolve(process.cwd(), 'src/data/portfolio.json');
const publicDir = path.resolve(process.cwd(), 'public');
const requiredContacts = ['Facebook', 'GitHub', 'X', 'Email', 'YouTube', 'LinkedIn', 'Reddit'];
const exactQuote = 'Self-education is, I firmly believe, the only kind of education there is.';

function object(value: unknown, at: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`${at} must be an object`);
  return value as Record<string, unknown>;
}
function string(value: unknown, at: string, allowEmpty = false): string {
  if (typeof value !== 'string' || (!allowEmpty && (!value.trim() || value.includes('REPLACE_BEFORE_PUBLISHING')))) {
    throw new Error(`${at} must be a non-empty, approved string`);
  }
  return value;
}
function array(value: unknown, at: string): unknown[] {
  if (!Array.isArray(value)) throw new Error(`${at} must be an array`);
  return value;
}
function url(value: unknown, at: string, email = false): string {
  const raw = string(value, at);
  if (email && raw === 'mailto:victor.lvl47@gmail.com') return raw;
  let parsed: URL;
  try { parsed = new URL(raw); } catch { throw new Error(`${at} must be a valid URL`); }
  if (parsed.protocol !== 'https:' || !parsed.hostname) throw new Error(`${at} must be an HTTPS URL`);
  return raw;
}
async function image(value: unknown, at: string): Promise<ImageContent> {
  const data = object(value, at);
  const imageUrl = string(data.url, `${at}.url`);
  const alt = string(data.alt, `${at}.alt`, true);
  if (imageUrl.startsWith('/')) {
    const resolved = path.resolve(publicDir, `.${imageUrl}`);
    if (!resolved.startsWith(`${publicDir}${path.sep}`)) throw new Error(`${at}.url escapes public/`);
    try { await access(resolved); } catch { throw new Error(`${at}.url does not exist: ${imageUrl}`); }
  } else url(imageUrl, `${at}.url`);
  return { url: imageUrl, alt };
}
function fields(source: Record<string, unknown>, names: string[], at: string): Record<string, string> {
  return Object.fromEntries(names.map((name) => [name, string(source[name], `${at}.${name}`)]));
}

export async function validatePortfolio(raw: unknown): Promise<Portfolio> {
  const data = object(raw, 'portfolio');
  const site = fields(object(data.site, 'site'), ['name', 'role', 'tagline', 'description'], 'site') as Portfolio['site'];
  const navigation = array(data.navigation, 'navigation').map((item, index) => {
    const source = object(item, `navigation[${index}]`);
    const href = string(source.href, `navigation[${index}].href`);
    if (!['#about', '#projects', '#contact'].includes(href)) throw new Error(`navigation[${index}].href is not a section link`);
    return { label: string(source.label, `navigation[${index}].label`), href };
  });
  const heroSource = object(data.hero, 'hero');
  const hero = { ...fields(heroSource, ['eyebrow', 'primaryAction', 'secondaryAction', 'previewLabel', 'previewText', 'previewLinkLabel'], 'hero'), previewLinkUrl: url(heroSource.previewLinkUrl, 'hero.previewLinkUrl'), image: await image(heroSource.image, 'hero.image') } as Portfolio['hero'];
  const work = fields(object(data.work, 'work'), ['eyebrow', 'heading', 'intro', 'projectAction', 'loadAction', 'loadingAction', 'retryAction', 'loadError', 'endMessage'], 'work') as Portfolio['work'];
  const projects = await Promise.all(array(data.projects, 'projects').map(async (item, index) => {
    const at = `projects[${index}]`;
    const source = object(item, at);
    const technologies = array(source.technologies, `${at}.technologies`).map((tech, techIndex) => string(tech, `${at}.technologies[${techIndex}]`));
    // An empty list records a real project whose stack is not yet verified.
    return {
      ...fields(source, ['id', 'title', 'category', 'description'], at), technologies,
      image: await image(source.image, `${at}.image`), projectUrl: url(source.projectUrl, `${at}.projectUrl`)
    } as Project;
  }));
  if (projects.length < 6) throw new Error('projects needs at least six real entries');
  if (new Set(projects.map(({ id }) => id)).size !== projects.length) throw new Error('projects has duplicate IDs');
  const contactSource = object(data.contact, 'contact');
  const contact = {
    ...fields(contactSource, ['eyebrow', 'heading', 'intro', 'email', 'emailAction', 'linksLabel'], 'contact'),
    links: array(contactSource.links, 'contact.links').map((item, index) => {
      const source = object(item, `contact.links[${index}]`);
      const label = string(source.label, `contact.links[${index}].label`);
      return { label, url: url(source.url, `contact.links[${index}].url`, label === 'Email') };
    })
  } as Portfolio['contact'];
  if (contact.email !== 'victor.lvl47@gmail.com') throw new Error('contact.email differs from the confirmed address');
  if (contact.links.map(({ label }) => label).join('|') !== requiredContacts.join('|')) throw new Error('contact.links must contain the seven required destinations in order');
  if (contact.links.find(({ label }) => label === 'Email')?.url !== `mailto:${contact.email}`) throw new Error('Email link must match contact.email');
  const footerSource = object(data.footer, 'footer');
  const footer = { ...fields(footerSource, ['mark', 'location', 'quote', 'quoteAttribution', 'topAction'], 'footer'), image: await image(footerSource.image, 'footer.image') } as Portfolio['footer'];
  if (footer.quote !== exactQuote || footer.quoteAttribution !== 'Isaac Asimov') throw new Error('footer quote must match the original exactly');
  return { site, navigation, hero, work, projects, contact, footer };
}

// A Cloudinary raw JSON URL can replace the local source without changing the content shape.
export async function loadPortfolio(): Promise<Portfolio> {
  const remote = import.meta.env.PORTFOLIO_CONTENT_URL;
  const raw = remote
    ? await (async () => {
        const response = await fetch(remote);
        if (!response.ok) throw new Error(`Portfolio source returned HTTP ${response.status}`);
        return response.json();
      })()
    : JSON.parse(await readFile(sourceFile, 'utf8'));
  return validatePortfolio(raw);
}
