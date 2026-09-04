const COLORS = ['#4fd8c8', '#f2b84b', '#ef6f6c', '#8b8ff0', '#5cd68a'];

export function fireConfetti(count = 36) {
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:300;overflow:hidden;';
  document.body.appendChild(host);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const left = Math.random() * 100;
    const size = 6 + Math.random() * 6;
    const duration = 1400 + Math.random() * 900;
    const delay = Math.random() * 250;
    const rotate = Math.random() * 360;
    const drift = (Math.random() - 0.5) * 120;
    piece.style.cssText = `
      position:absolute; top:-20px; left:${left}%;
      width:${size}px; height:${size * 0.6}px; background:${color};
      opacity:.9; border-radius:2px;
      transform:rotate(${rotate}deg);
      animation: confetti-fall ${duration}ms ease-in ${delay}ms forwards;
      --drift:${drift}px;
    `;
    host.appendChild(piece);
  }

  setTimeout(() => host.remove(), 2600);
}

// inject keyframes once
if (!document.getElementById('confetti-keyframes')) {
  const style = document.createElement('style');
  style.id = 'confetti-keyframes';
  style.textContent = `
    @keyframes confetti-fall {
      0% { transform: translate(0,0) rotate(0deg); opacity:.95; }
      100% { transform: translate(var(--drift), 110vh) rotate(540deg); opacity:0; }
    }
  `;
  document.head.appendChild(style);
}
