const hero = document.querySelector<HTMLElement>('[data-hero-parallax]');
const copy = hero?.querySelector<HTMLElement>('[data-hero-parallax-copy]');
const artwork = hero?.querySelector<HTMLElement>('[data-hero-parallax-artwork]');
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (hero && copy && artwork) {
  let frame = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let enabled = false;

  const render = () => {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    copy.style.transform = `translate3d(${(currentX * 8).toFixed(2)}px, ${(currentY * 8).toFixed(2)}px, 0)`;
    artwork.style.transform = `translate3d(${(-currentX * 20).toFixed(2)}px, ${(-currentY * 20).toFixed(2)}px, 0) scale(1.09)`;

    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      frame = requestAnimationFrame(render);
    } else {
      currentX = targetX;
      currentY = targetY;
      frame = 0;
    }
  };

  const requestRender = () => {
    if (!frame) frame = requestAnimationFrame(render);
  };

  const onPointerMove = (event: PointerEvent) => {
    const bounds = hero.getBoundingClientRect();
    targetX = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1));
    targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));
    requestRender();
  };

  const reset = () => {
    targetX = 0;
    targetY = 0;
    requestRender();
  };

  const resetStyles = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    targetX = targetY = currentX = currentY = 0;
    copy.style.transform = '';
    artwork.style.transform = '';
  };

  const disable = () => {
    if (enabled) {
      hero.removeEventListener('pointermove', onPointerMove);
      hero.removeEventListener('pointerleave', reset);
      enabled = false;
    }
    hero.classList.remove('hero--parallax-active');
    resetStyles();
  };

  const enable = () => {
    if (enabled || !canHover.matches || reducedMotion.matches) return;
    enabled = true;
    hero.classList.add('hero--parallax-active');
    hero.addEventListener('pointermove', onPointerMove, { passive: true });
    hero.addEventListener('pointerleave', reset, { passive: true });
  };

  const updateCapability = () => {
    if (canHover.matches && !reducedMotion.matches) enable();
    else disable();
  };

  canHover.addEventListener('change', updateCapability);
  reducedMotion.addEventListener('change', updateCapability);
  updateCapability();

  window.addEventListener('pagehide', () => {
    disable();
    canHover.removeEventListener('change', updateCapability);
    reducedMotion.removeEventListener('change', updateCapability);
  }, { once: true });
}
