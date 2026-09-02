const appStoreUrl = '__TALLI_APP_STORE_URL__';
const inviteToken = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[A-Za-z0-9_-]+$/i;

function logo() { return '<a class="logo" href="/" aria-label="Talli home"><img src="/talli-logo.png" alt="Talli" /></a>'; }

function rootPage() {
  return `<nav>${logo()}<a class="text-link" href="${appStoreUrl}">Get the app</a></nav>
    <section class="hero">
      <div><p class="eyebrow">Shared expenses, made clear</p><h1>Keep the good times.<br />Split the rest.</h1><p class="lede">Talli helps groups track what they share, understand who owes what, and settle up without the awkward maths.</p><a class="button primary" href="${appStoreUrl}">Download on the App Store <span aria-hidden="true">→</span></a></div>
      <aside class="expense-card" aria-label="Example group expense summary"><div class="expense-card__top"><strong>Weekend away</strong><span>All settled</span></div><div class="expense-row"><b>⌁</b><span>Dinner</span><strong>₱2,480</strong></div><div class="expense-row"><b>◌</b><span>Shared fairly</span><strong>4 people</strong></div><p>One place for every shared expense.</p></aside>
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

document.querySelector('#app').innerHTML = render();
