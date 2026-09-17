const appStoreUrl = '__TALLI_APP_STORE_URL__';
const googlePlayUrl = 'https://play.google.com/store';
let apiBaseUrl = '__TALLI_API_BASE_URL__';
if (apiBaseUrl.startsWith('__')) {
  apiBaseUrl = 'https://api.talli.hamfri.me';
}
const inviteToken = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[A-Za-z0-9_-]+$/i;
const verificationToken = /^[A-Za-z0-9_-]{20,100}$/;

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

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

function verifyEmailLoadingPage() {
  return `<section class="invite-card verify-card">${logo()}<div class="invite-icon loading-icon" aria-hidden="true">⏳</div><h1>Verifying your email…</h1><p>Please wait a moment while we confirm your account.</p></section>`;
}

function verifyEmailSuccessPage(token) {
  const deepLink = token ? `talli://verify-email/${encodeURIComponent(token)}` : 'talli://';
  return `<section class="invite-card verify-card">${logo()}<div class="invite-icon success-icon" aria-hidden="true">✓</div><h1>Email verified!</h1><p>Your email address has been confirmed. You can now return to the Talli app and sign in.</p><a class="button primary" href="${deepLink}">Open Talli <span aria-hidden="true">↗</span></a><a class="button secondary" href="${appStoreUrl}">Download Talli <span aria-hidden="true">↓</span></a></section>`;
}

function verifyEmailErrorPage(message) {
  return `<section class="invite-card verify-card">${logo()}<div class="invite-icon error-icon" aria-hidden="true">✕</div><h1>Link expired or invalid</h1><p>${escapeAttr(message || 'Verification links can only be used once and expire after 30 minutes. Request a new link from the Talli app.')}</p><a class="button primary" href="${appStoreUrl}">Get Talli <span aria-hidden="true">↓</span></a></section>`;
}

function render() {
  const joinMatch = window.location.pathname.match(/^\/join\/([^/]+)\/?$/);
  if (joinMatch) {
    try {
      const token = decodeURIComponent(joinMatch[1]);
      return inviteToken.test(token) ? invitePage(token) : invalidInvitePage();
    } catch {
      return invalidInvitePage();
    }
  }

  const verifyMatch = window.location.pathname.match(/^\/verify-email\/([^/]+)\/?$/);
  if (verifyMatch) {
    try {
      const token = decodeURIComponent(verifyMatch[1]);
      return verificationToken.test(token) ? verifyEmailLoadingPage() : verifyEmailErrorPage();
    } catch {
      return verifyEmailErrorPage();
    }
  }

  return rootPage();
}

async function autoVerifyEmail(token) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/auth/email-verification/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });

    if (response.ok) {
      document.querySelector('#app').innerHTML = verifyEmailSuccessPage(token);
    } else {
      let message = 'Verification links can only be used once and expire after 30 minutes. Request a new link from the Talli app.';
      try {
        const problem = await response.json();
        if (problem.detail) message = problem.detail;
      } catch {}
      document.querySelector('#app').innerHTML = verifyEmailErrorPage(message);
    }
  } catch {
    document.querySelector('#app').innerHTML = `<section class="invite-card verify-card">${logo()}<div class="invite-icon error-icon" aria-hidden="true">!</div><h1>Connection error</h1><p>We couldn’t reach the server to confirm your email. Please check your connection or open Talli directly.</p><button id="retry-verify-btn" class="button primary" type="button">Try again <span aria-hidden="true">↻</span></button><a class="button secondary" href="${appStoreUrl}">Get Talli <span aria-hidden="true">↓</span></a></section>`;
    const retryBtn = document.querySelector('#retry-verify-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        document.querySelector('#app').innerHTML = verifyEmailLoadingPage();
        void autoVerifyEmail(token);
      });
    }
  }
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
const isFallbackPage = window.location.pathname.startsWith('/join/') || window.location.pathname.startsWith('/verify-email/');
app.classList.toggle('landing-page', !isFallbackPage);

const verifyMatch = window.location.pathname.match(/^\/verify-email\/([^/]+)\/?$/);
if (verifyMatch) {
  try {
    const token = decodeURIComponent(verifyMatch[1]);
    if (verificationToken.test(token)) {
      void autoVerifyEmail(token);
    }
  } catch {}
}

playHeroExpenseAnimation();
