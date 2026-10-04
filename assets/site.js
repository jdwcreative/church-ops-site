// Preserve bookmarks after moving long-page categories to dedicated screens.
(() => {
  const destinations = {"/churchops.html#product-tour": "/churchops-tour.html", "/churchops.html#platforms": "/churchops-devices.html", "/churchops.html#faq": "/churchops-faq.html", "/churchops.html#hub-portals": "/churchops-web.html", "/live.html#product-tour": "/live-tour.html", "/live.html#platforms": "/live-devices.html", "/live.html#faq": "/live-faq.html", "/music.html#product-tour": "/music-tour.html", "/music.html#platforms": "/music-devices.html", "/music.html#support": "/music-faq.html", "/music.html#faq": "/music-faq.html", "/music.html#workflow": "/music-tour.html", "/count.html#product-tour": "/count-tour.html", "/count.html#platforms": "/count-devices.html", "/count.html#faq": "/count-faq.html", "/count.html#how-it-works": "/count-tour.html", "/staff-portal.html#product-tour": "/staff-portal-tour.html", "/staff-portal.html#platforms": "/staff-portal-devices.html", "/staff-portal.html#faq": "/staff-portal-faq.html", "/request-portal.html#product-tour": "/request-portal-tour.html", "/request-portal.html#platforms": "/request-portal-devices.html", "/request-portal.html#faq": "/request-portal-faq.html", "/resources.html#access": "/resources.html", "/resources.html#forms": "/forms.html", "/resources.html#help": "/help.html", "/pricing.html#future": "/suite-pricing.html", "/pricing.html#pricing-questions": "/faq-pricing.html", "/pricing.html#hub": "/pricing.html", "/faq.html#faq-0": "/faq.html", "/faq.html#faq-1": "/faq-pricing.html", "/faq.html#faq-2": "/faq-access.html", "/faq.html#faq-3": "/faq-church.html", "/#suite": "/products.html", "/index.html#suite": "/products.html"};
  const target = destinations[location.pathname + location.hash];
  if (target && target !== location.pathname) window.location.replace(target + location.search);
  const teamId = new URLSearchParams(location.search).get('teamId');
  if (teamId && /^[a-zA-Z0-9_-]{1,128}$/.test(teamId)) {
    document.querySelectorAll('[data-resource-nav]').forEach(link => {
      const url = new URL(link.getAttribute('href'), location.origin);
      url.searchParams.set('teamId', teamId);
      link.href = url.pathname + url.search;
    });
  }
})();

(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  function closeMenu() {
    header?.classList.remove('nav-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('nav-open', open);
  });
  nav?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      closeMenu(); toggle.focus();
    }
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
  // Direct workflow links reveal the selected topic without hiding its content.
  function revealWorkflow() {
    const topic = document.getElementById(location.hash.slice(1));
    if (topic?.matches?.('details.workflow-disclosure')) topic.open = true;
  }
  window.addEventListener('hashchange', revealWorkflow);
  revealWorkflow();
  // The resource directory never chooses a church on the visitor's behalf.
  const teamId = new URLSearchParams(location.search).get('teamId');
  if (teamId && /^[a-zA-Z0-9_-]{1,128}$/.test(teamId)) {
    document.querySelectorAll('[data-form]').forEach(link => {
      const url = new URL(link.getAttribute('href'), location.origin);
      url.searchParams.set('teamId', teamId);
      link.href = url.pathname + url.search;
      link.hidden = false;
    });
  }
  document.getElementById('form-link-helper')?.addEventListener('submit', event => {
    event.preventDefault();
    const field = document.getElementById('church-link');
    const feedback = document.getElementById('link-feedback');
    try {
      const url = new URL(field.value.trim());
      const allowedHosts = ['church-ops.com', 'www.church-ops.com'];
      const allowedPaths = ['/invoice.html', '/reimbursement.html', '/event-request.html', '/jobs.html', '/invite.html', '/open.html'];
      if (url.protocol !== 'https:' || !allowedHosts.includes(url.hostname) || url.port || url.username || url.password || !allowedPaths.includes(url.pathname)) throw new Error('invalid');
      feedback.textContent = 'Opening your original ChurchOps link…';
      // Keep all supplied query parameters and the fragment. Never relay to an arbitrary host.
      window.location.assign(url.href);
    } catch {
      feedback.textContent = 'Please use a complete https://church-ops.com or https://www.church-ops.com form or invitation link from your church.';
      field.focus();
    }
  });
  document.getElementById('contact-form')?.addEventListener('submit', event => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const subject = `ChurchOps inquiry: ${values.get('interest')}`;
    const body = `Hello ChurchOps,\n\nMy name is ${String(values.get('name')).trim()} from ${String(values.get('church')).trim()}.\n\nI’m interested in ${values.get('interest')}.\n\n${String(values.get('message')).trim()}\n\nThank you!`;
    document.getElementById('contact-feedback').textContent = 'Your email app will open with a draft to review. If it doesn’t open, email hello@church-ops.com directly. Nothing has been sent by this website.';
    window.location.href = `mailto:hello@church-ops.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();

// Each choice reveals an actual product screen; links work without JavaScript.
document.querySelectorAll('[data-screen]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-screen]').forEach(choice => {
      const selected = choice === button;
      choice.setAttribute('aria-pressed', String(selected));
      const panel = document.getElementById('screen-' + choice.dataset.screen);
      if (panel) panel.hidden = !selected;
    });
  });
});
document.querySelectorAll('[data-billing]').forEach(button => {
  button.addEventListener('click', () => {
    const annual = button.dataset.billing === 'annual';
    document.querySelectorAll('[data-billing]').forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
    document.querySelectorAll('[data-monthly][data-annual]').forEach(price => {
      price.replaceChildren(document.createTextNode('$' + (annual ? price.dataset.annual : price.dataset.monthly)));
      const period = document.createElement('span');
      period.textContent = annual ? '/year' : '/month';
      price.append(period);
    });
    document.querySelectorAll('.billing-term').forEach(term => {
      term.textContent = annual ? 'Full annual amount, billed yearly in USD' : 'Billed monthly in USD';
    });
  });
});
// Carry a product choice into the inquiry without accepting arbitrary options.
const interestField = document.getElementById('contact-interest');
if (interestField) {
  const requestedInterest = new URLSearchParams(location.search).get('interest');
  const interest = ['Staff Portal', 'Request Portal'].includes(requestedInterest) ? 'ChurchOps Hub' : requestedInterest;
  if ([...interestField.options].some(option => option.value === interest)) interestField.value = interest;
}

// Product tours are readable in full without JavaScript; enhance to a screen picker.
document.querySelectorAll('[data-tour]').forEach(tour => {
  const choices = Array.from(tour.querySelectorAll('[data-tour-choice]'));
  const panels = Array.from(tour.querySelectorAll('[data-tour-panel]'));
  const controls = tour.querySelector('.tour-choices');
  const stage = tour.querySelector('.tour-stage');
  if (!choices.length || choices.length !== panels.length || !controls || !stage) return;
  function select(value) {
    choices.forEach(choice => choice.setAttribute('aria-pressed', String(choice.dataset.tourChoice === value)));
    panels.forEach(panel => { panel.hidden = panel.dataset.tourPanel !== value; });
  }
  choices.forEach(choice => choice.addEventListener('click', () => select(choice.dataset.tourChoice)));
  select(choices[0].dataset.tourChoice);
  stage.classList.add('enhanced');
  controls.hidden = false;
});
