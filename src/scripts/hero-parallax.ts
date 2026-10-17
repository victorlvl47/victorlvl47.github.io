const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

document.querySelectorAll<HTMLElement>('[data-parallax-section]').forEach((section) => {
  const copy = section.querySelector<HTMLElement>('[data-parallax-copy]');
  const artwork = section.querySelector<HTMLElement>('[data-parallax-artwork]');
  const activeClass = section.classList.contains('hero') ? 'hero--parallax-active' : 'contact--parallax-active';

  if (!copy || !artwork) return;

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
    const bounds = section.getBoundingClientRect();
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
      section.removeEventListener('pointermove', onPointerMove);
      section.removeEventListener('pointerleave', reset);
      enabled = false;
    }
    section.classList.remove(activeClass);
    resetStyles();
  };

  const enable = () => {
    if (enabled || !canHover.matches || reducedMotion.matches) return;
    enabled = true;
    section.classList.add(activeClass);
    section.addEventListener('pointermove', onPointerMove, { passive: true });
    section.addEventListener('pointerleave', reset, { passive: true });
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
});
