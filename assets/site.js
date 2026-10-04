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
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectTab(tabs[next]); tabs[next].focus(); }
    });
  });
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
