import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

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
  contact: { eyebrow: string; heading: string; intro: string; email: string; emailAction: string; linksLabel: string; links: { id: string; label: string; url: string }[] };
  footer: { mark: string; location: string; quote: string; quoteAttribution: string; topAction: string; image: ImageContent };
  ui: { skipToContent: string; mainNavigationLabel: string; backToTopLabel: string; technologiesLabel: string; opensInNewTab: string; projectCount: string; copyEmailLabel: string; copyEmailAction: string; emailCopied: string; emailCopyError: string; languageSelectorLabel: string };
}

const sourceFile = path.resolve(process.cwd(), 'src/data/portfolio.json');
const publicDir = path.resolve(process.cwd(), 'public');
const requiredContactIds = ['facebook', 'github', 'x', 'email', 'youtube', 'linkedin', 'reddit'];
const exactQuotes: Record<Locale, string> = {
  en: 'Self-education is, I firmly believe, the only kind of education there is.',
  es: 'La autoeducación es, creo firmemente, el único tipo de educación que existe.'
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

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
function localized(value: unknown, at: string, locale: Locale, allowEmpty = false): string {
  const translations = object(value, at);
  for (const language of locales) string(translations[language], `${at}.${language}`, allowEmpty);
  return translations[locale] as string;
}
function url(value: unknown, at: string, allowMailto = false): string {
  const raw = string(value, at);
  let parsed: URL;
  try { parsed = new URL(raw); } catch { throw new Error(`${at} must be a valid URL`); }
  if (allowMailto && parsed.protocol === 'mailto:') return raw;
  if (parsed.protocol !== 'https:' || !parsed.hostname) throw new Error(`${at} must be an HTTPS URL`);
  return raw;
}
function localizedUrl(value: unknown, at: string, locale: Locale): string {
  const translations = object(value, at);
  for (const language of locales) url(translations[language], `${at}.${language}`);
  return translations[locale] as string;
}
async function image(value: unknown, at: string, locale: Locale): Promise<ImageContent> {
  const data = object(value, at);
  const imageUrl = string(data.url, `${at}.url`);
  const alt = localized(data.alt, `${at}.alt`, locale, true);
  if (imageUrl.startsWith('/')) {
    const resolved = path.resolve(publicDir, `.${imageUrl}`);
    if (!resolved.startsWith(`${publicDir}${path.sep}`)) throw new Error(`${at}.url escapes public/`);
    try { await access(resolved); } catch { throw new Error(`${at}.url does not exist: ${imageUrl}`); }
  } else url(imageUrl, `${at}.url`);
  return { url: imageUrl, alt };
}
function localizedFields(source: Record<string, unknown>, names: string[], at: string, locale: Locale): Record<string, string> {
  return Object.fromEntries(names.map((name) => [name, localized(source[name], `${at}.${name}`, locale)]));
}

export async function validatePortfolio(raw: unknown, locale: Locale): Promise<Portfolio> {
  const data = object(raw, 'portfolio');
  const siteSource = object(data.site, 'site');
  const site = {
    name: string(siteSource.name, 'site.name'),
    ...localizedFields(siteSource, ['role', 'tagline', 'description'], 'site', locale)
  } as Portfolio['site'];
  const navigation = array(data.navigation, 'navigation').map((item, index) => {
    const source = object(item, `navigation[${index}]`);
    const href = string(source.href, `navigation[${index}].href`);
    if (!['#about', '#projects', '#contact'].includes(href)) throw new Error(`navigation[${index}].href is not a section link`);
    return { label: localized(source.label, `navigation[${index}].label`, locale), href };
  });
  const heroSource = object(data.hero, 'hero');
  const hero = {
    ...localizedFields(heroSource, ['eyebrow', 'primaryAction', 'secondaryAction', 'previewLabel', 'previewText', 'previewLinkLabel'], 'hero', locale),
    previewLinkUrl: localizedUrl(heroSource.previewLinkUrl, 'hero.previewLinkUrl', locale),
    image: await image(heroSource.image, 'hero.image', locale)
  } as Portfolio['hero'];
  const work = localizedFields(object(data.work, 'work'), ['eyebrow', 'heading', 'intro', 'projectAction', 'loadAction', 'loadingAction', 'retryAction', 'loadError', 'endMessage'], 'work', locale) as Portfolio['work'];
  const projects = await Promise.all(array(data.projects, 'projects').map(async (item, index) => {
    const at = `projects[${index}]`;
    const source = object(item, at);
    const technologies = array(source.technologies, `${at}.technologies`).map((tech, techIndex) => string(tech, `${at}.technologies[${techIndex}]`));
    return {
      id: string(source.id, `${at}.id`),
      title: string(source.title, `${at}.title`),
      category: localized(source.category, `${at}.category`, locale),
      description: localized(source.description, `${at}.description`, locale),
      technologies,
      image: await image(source.image, `${at}.image`, locale),
      projectUrl: url(source.projectUrl, `${at}.projectUrl`)
    } as Project;
  }));
  if (projects.length < 6) throw new Error('projects needs at least six real entries');
  if (new Set(projects.map(({ id }) => id)).size !== projects.length) throw new Error('projects has duplicate IDs');
  const contactSource = object(data.contact, 'contact');
  const email = string(contactSource.email, 'contact.email');
  const contact = {
    ...localizedFields(contactSource, ['eyebrow', 'heading', 'intro', 'emailAction', 'linksLabel'], 'contact', locale),
    email,
    links: array(contactSource.links, 'contact.links').map((item, index) => {
      const at = `contact.links[${index}]`;
      const source = object(item, at);
      const id = string(source.id, `${at}.id`);
      return { id, label: localized(source.label, `${at}.label`, locale), url: url(source.url, `${at}.url`, id === 'email') };
    })
  } as Portfolio['contact'];
  if (contact.email !== 'victor.lvl47@gmail.com') throw new Error('contact.email differs from the confirmed address');
  if (contact.links.map(({ id }) => id).join('|') !== requiredContactIds.join('|')) throw new Error('contact.links must contain the seven required destination IDs in order');
  if (contact.links.find(({ id }) => id === 'email')?.url !== `mailto:${contact.email}`) throw new Error('Email link must match contact.email');
  const footerSource = object(data.footer, 'footer');
  const quoteAttribution = string(footerSource.quoteAttribution, 'footer.quoteAttribution');
  const footer = {
    mark: string(footerSource.mark, 'footer.mark'),
    ...localizedFields(footerSource, ['location', 'quote', 'topAction'], 'footer', locale),
    quoteAttribution,
    image: await image(footerSource.image, 'footer.image', locale)
  } as Portfolio['footer'];
  for (const language of locales) {
    const quote = localized(footerSource.quote, 'footer.quote', language);
    if (quote !== exactQuotes[language]) throw new Error(`footer.quote.${language} must match the approved quotation exactly`);
  }
  if (footer.quoteAttribution !== 'Isaac Asimov') throw new Error('footer.quoteAttribution must match the original exactly');
  const ui = localizedFields(object(data.ui, 'ui'), ['skipToContent', 'mainNavigationLabel', 'backToTopLabel', 'technologiesLabel', 'opensInNewTab', 'projectCount', 'copyEmailLabel', 'copyEmailAction', 'emailCopied', 'emailCopyError', 'languageSelectorLabel'], 'ui', locale) as Portfolio['ui'];
  if (!ui.projectCount.includes('{shown}') || !ui.projectCount.includes('{total}')) throw new Error(`ui.projectCount.${locale} must include {shown} and {total}`);
  return { site, navigation, hero, work, projects, contact, footer, ui };
}

// A remote source can replace the local file, but it must use the same complete bilingual schema.
export async function loadPortfolio(locale: Locale): Promise<Portfolio> {
  if (!isLocale(locale)) throw new Error(`Unsupported portfolio locale: ${locale}`);
  const remote = import.meta.env.PORTFOLIO_CONTENT_URL;
  const raw = remote
    ? await (async () => {
        const sourceUrl = url(remote, 'PORTFOLIO_CONTENT_URL');
        const response = await fetch(sourceUrl);
        if (!response.ok) throw new Error(`Portfolio source returned HTTP ${response.status}`);
        try { return await response.json(); } catch { throw new Error('Portfolio source did not return valid JSON'); }
      })()
    : JSON.parse(await readFile(sourceFile, 'utf8'));
  return validatePortfolio(raw, locale);
}
