// Nav scroll behavior
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Fade-up scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.pillar, .pathway-card, .how-item, .fact-card, .partner-cat, .involved-card'
).forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// Hero canvas — animated signal wave network
const canvas = document.getElementById('signalCanvas');
const ctx = canvas.getContext('2d');
let W, H, nodes = [], frame = 0;

function resize() {
  W = canvas.width = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
  initNodes();
}

function initNodes() {
  nodes = [];
  const count = Math.floor((W * H) / 18000);
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 1,
    });
  }
}

function drawFrame() {
  ctx.clearRect(0, 0, W, H);
  frame++;

  // Update positions
  nodes.forEach(n => {
    n.x += n.vx;
    n.y += n.vy;
    if (n.x < 0 || n.x > W) n.vx *= -1;
    if (n.y < 0 || n.y > H) n.vy *= -1;
  });

  // Draw connections
  const maxDist = 160;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.25;
        // Alternate teal/orange for signal feel
        const isTeal = (i + j) % 3 !== 0;
        ctx.strokeStyle = isTeal
          ? `rgba(0,212,255,${alpha})`
          : `rgba(255,107,43,${alpha * 0.6})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  nodes.forEach((n, i) => {
    const pulse = Math.sin(frame * 0.02 + i) * 0.5 + 0.5;
    const isTeal = i % 3 !== 0;
    ctx.fillStyle = isTeal
      ? `rgba(0,212,255,${0.4 + pulse * 0.3})`
      : `rgba(255,107,43,${0.3 + pulse * 0.25})`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawFrame);
}

const ro = new ResizeObserver(resize);
ro.observe(canvas.parentElement);
resize();
drawFrame();
