/* vfx.js -- Shared visual effects for Turoyo Learn */
/* No dependencies. Exposes global VFX object.        */

const CONFETTI_COLORS = ['#34D399','#60A5FA','#FBBF24','#FB923C','#A78BFA','#F87171'];

const VFX = {
  screenFlash(color) {
    const el = document.createElement('div');
    el.className = 'va-flash va-flash-' + color;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  },

  floatingXP(amount) {
    const el = document.createElement('div');
    el.className = 'va-xp-float';
    el.textContent = '+' + amount + ' XP';
    el.style.top = '40%';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  },

  spawnConfetti(count, originY) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'va-confetti';
      el.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      el.style.left = (10 + Math.random() * 80) + '%';
      el.style.top = (originY || 30) + '%';
      el.style.width = (6 + Math.random() * 8) + 'px';
      el.style.height = (6 + Math.random() * 8) + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.setProperty('--drift', (Math.random() * 120 - 60) + 'px');
      el.style.setProperty('--drop', (200 + Math.random() * 300) + 'px');
      el.style.setProperty('--spin', (360 + Math.random() * 720) + 'deg');
      el.style.setProperty('--fall-dur', (1 + Math.random() * 1.5) + 's');
      el.style.animationDelay = (Math.random() * 0.3) + 's';
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }
};
