(() => {
  const central = 'https://app.church-ops.com';
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const status = document.querySelector('#workspace-status');
  if (location.origin !== central && !loopback) {
    status.textContent = 'Continue securely on ChurchOps to manage your account.';
    const link = document.createElement('a'); link.className = 'button'; link.textContent = 'Continue to ChurchOps';
    const target = new URL('/account.html', central);
    const params = new URLSearchParams(location.search);
    for (const key of ['code', 'mode', 'church']) if (params.has(key)) target.searchParams.set(key, params.get(key));
    link.href = target.href; document.querySelector('#workspace-content').replaceChildren(link); return;
  }
  const local = loopback ? window.CHURCHOPS_LOCAL_RUNTIME : null;
  if (loopback && (!local || !/^demo-[a-z0-9-]+$/.test(local.firebase?.projectId || '') || !local.authPort || !local.functionsPort)) {
    status.textContent = 'This private preview needs its local test services. No production connection was opened.'; return;
  }
  import('./account-bundle.js').then(module => module.start(local)).catch(() => { status.textContent = 'The account workspace could not load. Refresh this page to try again.'; });
})();
