import type { Project } from '../lib/portfolio';

const control = document.querySelector<HTMLElement>('[data-load-more]');
const grid = document.querySelector<HTMLElement>('#project-grid');

if (control && grid) {
  const button = control.querySelector<HTMLButtonElement>('button')!;
  const status = control.querySelector<HTMLElement>('[role="status"]')!;
  const total = Number(control.dataset.total);
  const batchSize = 3;
  let remaining: Project[] | null = null;
  let appended = 0;
  let loading = false;

  const label = (key: string) => control.dataset[key] ?? '';
  const projectCount = (shown: number) => label('countLabel')
    .replace('{shown}', String(shown))
    .replace('{total}', String(total));
  const setLoadButtonLabel = (text: string) => {
    const icon = element('span', 'load-more-icon');
    icon.setAttribute('aria-hidden', 'true');
    button.replaceChildren(document.createTextNode(text), icon);
  };
  const initialCount = grid.children.length;
  if (total > initialCount) button.hidden = false;
  else status.textContent = label('endLabel');

  function element<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, value?: string): HTMLElementTagNameMap[K] {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value) node.textContent = value;
    return node;
  }

  function projectCard(project: Project, number: number): HTMLElement {
    const card = element('article', 'project-card');
    card.dataset.projectId = project.id;
    const imageWrap = element('div', 'project-card__image');
    const image = element('img');
    image.src = project.image.url;
    image.alt = project.image.alt;
    image.width = 800;
    image.height = 450;
    image.loading = 'lazy';
    image.decoding = 'async';
    imageWrap.append(image);
    card.append(imageWrap);

    const body = element('div', 'project-card__body');
    if (project.technologies.length === 0) body.classList.add('project-card__body--no-tech');
    body.append(element('p', 'project-card__index mono', `${String(number).padStart(3, '0')} /`));
    body.append(element('h3', undefined, project.title));
    body.append(element('p', 'project-card__category mono', project.category));
    body.append(element('p', 'project-card__description', project.description));
    if (project.technologies.length > 0) {
      const tech = element('ul', 'project-card__technologies mono');
      tech.setAttribute('aria-label', label('technologiesLabel'));
      for (const item of project.technologies) tech.append(element('li', undefined, item));
      body.append(tech);
    }
    const link = element('a', 'project-card__link mono', `${label('action')} `);
    link.href = project.projectUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `${label('action')}: ${project.title} (${label('newTabLabel')})`);
    const externalIcon = element('span', 'external-link-icon');
    externalIcon.setAttribute('aria-hidden', 'true');
    link.append(externalIcon);
    body.append(link);
    card.append(body);
    return card;
  }

  button.addEventListener('click', async () => {
    if (loading) return;
    loading = true;
    button.disabled = true;
    button.textContent = label('loadingLabel');
    status.textContent = label('loadingLabel');
    try {
      if (!remaining) {
        const response = await fetch(control.dataset.url!, { headers: { Accept: 'application/json' }, cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload: unknown = await response.json();
        if (!payload || typeof payload !== 'object' || !('projects' in payload) || !Array.isArray(payload.projects) || payload.projects.length !== total - initialCount) throw new Error('Unexpected project data');
        remaining = payload.projects as Project[];
      }
      const next = remaining.slice(appended, appended + batchSize);
      grid.append(...next.map((project, index) => projectCard(project, initialCount + appended + index + 1)));
      appended += next.length;
      const shown = initialCount + appended;
      status.textContent = shown >= total ? label('endLabel') : projectCount(shown);
      if (shown >= total) button.hidden = true;
      else setLoadButtonLabel(label('loadLabel'));
    } catch {
      status.textContent = label('errorLabel');
      button.textContent = label('retryLabel');
    } finally {
      button.disabled = false;
      loading = false;
    }
  });
}
