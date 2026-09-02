const appStoreUrl = '__TALLI_APP_STORE_URL__';
const googlePlayUrl = 'https://play.google.com/store';
const inviteToken = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[A-Za-z0-9_-]+$/i;

function logo() { return '<a class="logo" href="/" aria-label="Talli home"><img src="/talli-logo.png" alt="Talli" /></a>'; }

function rootPage() {
  return `<nav>${logo()}<a class="nav-action" href="${appStoreUrl}">Get the app</a></nav>
    <section class="hero">
      <div class="hero-copy"><p class="eyebrow">Shared expenses, stronger connections</p><h1>Good times are better when they’re easy to split<span aria-hidden="true">.</span></h1><p class="lede">Talli keeps the money part clear, so your group can stay present for everything else.</p><a class="button primary" href="${appStoreUrl}">Get Talli for free <span aria-hidden="true">→</span></a><ul class="hero-points"><li>Fair for every group</li><li>Clear from the first expense</li><li>Settled without awkward IOUs</li></ul></div>
      <div class="hero-visual">
        <section class="expense-card" aria-label="Weekend away expenses, all settled">
          <header class="expense-card__header"><div><p>Weekend away</p><span>4 friends · all caught up</span></div><strong class="expense-status">All settled</strong></header>
          <div class="avatar-list" aria-label="Ava, Jules, Mia, and Theo"><span class="avatar avatar--ava">A</span><span class="avatar avatar--jules">J</span><span class="avatar avatar--mia">M</span><span class="avatar avatar--theo">T</span></div>
          <dl class="expense-list">
            <div class="expense-entry"><dt>Dinner <small>Food and drinks</small></dt><dd><span class="amount" data-amount="2480">₱2,480</span> <small>split equally</small></dd></div>
            <div class="expense-entry"><dt>Transport <small>To and from the stay</small></dt><dd><span class="amount" data-amount="1320">₱1,320</span> <small>split equally</small></dd></div>
            <div class="expense-entry"><dt>Villa <small>Two nights by the coast</small></dt><dd><span class="amount" data-amount="5600">₱5,600</span> <small>split equally</small></dd></div>
            <div class="expense-entry"><dt>Groceries <small>Breakfasts and snacks</small></dt><dd><span class="amount" data-amount="1760">₱1,760</span> <small>split equally</small></dd></div>
          </dl>
          <footer class="expense-card__footer"><div><strong>Settled up</strong><span>Everyone paid their share.</span></div><b aria-label="Settlement complete">✓</b></footer>
        </section>
      </div>
    </section>`;
}

function invitePage(token) {
  const deepLink = `talli://join/${encodeURIComponent(token)}`;
  return `<section class="invite-card">${logo()}<div class="invite-icon" aria-hidden="true">♧</div><h1>You’re invited.</h1><p>Open Talli to join this shared-expense group. You’ll be able to sign in or create an account first if you need to.</p><a class="button primary" href="${deepLink}">Open Talli <span aria-hidden="true">↗</span></a><a class="button secondary" href="${appStoreUrl}">Download Talli <span aria-hidden="true">↓</span></a><small>Don’t have Talli yet? Download it, then return to this invite to join.</small></section>`;
}

function invalidInvitePage() {
  return `<section class="invite-card">${logo()}<h1>This invite link is invalid.</h1><p>Ask the person who invited you to send a new Talli invite link.</p><a class="button primary" href="${appStoreUrl}">Get Talli <span aria-hidden="true">↓</span></a></section>`;
}

function render() {
  const match = window.location.pathname.match(/^\/join\/([^/]+)$/);
  if (!match) return rootPage();
  try { const token = decodeURIComponent(match[1]); return inviteToken.test(token) ? invitePage(token) : invalidInvitePage(); }
  catch { return invalidInvitePage(); }
}

function animateAmount(element, target, duration) {
  const startedAt = performance.now();
  const format = new Intl.NumberFormat('en-PH');

  function tick(now) {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `₱${format.format(Math.round(target * eased))}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function playHeroExpenseAnimation() {
  const card = document.querySelector('.expense-card');
  if (!card || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const amounts = [...card.querySelectorAll('.amount')];
  card.classList.add('will-animate');
  amounts.forEach((amount) => { amount.textContent = '₱0'; });

  requestAnimationFrame(() => {
    card.classList.add('is-animated');
    amounts.forEach((amount, index) => {
      window.setTimeout(() => animateAmount(amount, Number(amount.dataset.amount), 620), 1450 + index * 720);
    });
  });
}

const app = document.querySelector('#app');
app.innerHTML = render();
app.classList.toggle('landing-page', !window.location.pathname.startsWith('/join/'));
playHeroExpenseAnimation();
