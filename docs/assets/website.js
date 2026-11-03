/* Progressive enhancement for the public website. No account or billing writes. */
(() => {
  'use strict';
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const closeMenu = () => {header?.classList.remove('nav-open');toggle?.setAttribute('aria-expanded','false');};
  toggle?.addEventListener('click', () => {const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));header.classList.toggle('nav-open',open);});
  nav?.addEventListener('click', event => {if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown', event => {if(event.key==='Escape'&&toggle?.getAttribute('aria-expanded')==='true'){closeMenu();toggle.focus();}});
  window.matchMedia('(min-width: 801px)').addEventListener('change',closeMenu);
  const params = new URLSearchParams(location.search);
  // Preserve historical category bookmarks and all original church context.
  const legacy = {'/resources.html#forms':'/forms.html','/resources.html#help':'/help.html'};
  const target=legacy[location.pathname+location.hash];
  if(target)location.replace(target+location.search);
  const teamId=params.get('teamId');
  if(teamId&&/^[a-zA-Z0-9_-]{1,128}$/.test(teamId)){
    document.querySelectorAll('[data-form],[data-resource-nav]').forEach(link=>{const url=new URL(link.getAttribute('href'),location.origin);url.searchParams.set('teamId',teamId);link.href=url.pathname+url.search;if(link.hasAttribute('data-form'))link.hidden=false;});
  }
  function revealDetails(){const key=location.hash.slice(1);const detail=params.get('detail');const aliases={platforms:'devices',faq:'answers',support:'access'};const node=document.getElementById(aliases[key]||key||detail);const disclosure=node?.closest('details');if(disclosure){disclosure.open=true;if(key)node.scrollIntoView({block:'start'});}if(detail&&['devices','answers','access','tour'].includes(detail)){document.getElementById(detail)?.scrollIntoView({block:'start'});}}
  revealDetails();window.addEventListener('hashchange',revealDetails);
  document.querySelectorAll('[data-tour]').forEach(tour=>{
    const choices=[...tour.querySelectorAll('[data-tour-choice]')],panels=[...tour.querySelectorAll('[data-tour-panel]')];
    if(!choices.length||choices.length!==panels.length)return;
    const select=value=>{choices.forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.tourChoice===value)));panels.forEach(p=>p.hidden=p.dataset.tourPanel!==value);};
    choices.forEach(c=>c.addEventListener('click',()=>select(c.dataset.tourChoice)));select(choices[0].dataset.tourChoice);tour.classList.add('enhanced');tour.querySelector('.tour-tabs').hidden=false;
  });
  document.querySelectorAll('[data-outcome]').forEach(story=>{
    const choices=[...story.querySelectorAll('[data-outcome-choice]')],panels=[...story.querySelectorAll('[data-outcome-panel]')];
    if(!choices.length||choices.length!==panels.length)return;
    const select=value=>{choices.forEach(c=>c.setAttribute('aria-pressed',String(c.dataset.outcomeChoice===value)));panels.forEach(p=>p.hidden=p.dataset.outcomePanel!==value);};
    choices.forEach(c=>c.addEventListener('click',()=>select(c.dataset.outcomeChoice)));
    select(choices[0].dataset.outcomeChoice);story.classList.add('enhanced');story.querySelector('.outcome-tabs').hidden=false;
  });
  document.querySelectorAll('[data-billing]').forEach(button=>button.addEventListener('click',()=>{
    const annual=button.dataset.billing==='annual';document.querySelectorAll('[data-billing]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.querySelectorAll('[data-monthly][data-annual]').forEach(price=>{price.replaceChildren(document.createTextNode('$'+(annual?price.dataset.annual:price.dataset.monthly)));const unit=document.createElement('span');unit.textContent=annual?'/year':'/month';price.append(unit);});
    document.querySelectorAll('.billing-term').forEach(t=>t.textContent=annual?'Full annual amount, billed yearly in USD':'Billed monthly in USD');
    document.querySelectorAll('[data-hub-plan]').forEach(a=>{const url=new URL(a.href,location.origin);url.searchParams.set('period',annual?'annual':'monthly');a.href=url.pathname+url.search;});
  }));
  const context=document.getElementById('selected-hub-plan');
  const plans={starter:['Starter','3'],team:['Team','10'],growth:['Growth','25']};
  if(context&&Object.hasOwn(plans,params.get('hub'))){const plan=plans[params.get('hub')];context.textContent='Your starting point: Hub '+plan[0]+' · Up to '+plan[1]+' team members. Create your account first; purchase your subscription in the Hub app.';context.hidden=false;}
  const field=document.getElementById('contact-interest');
  if(field){const raw=params.get('interest');const requested=['Staff Portal','Request Portal'].includes(raw)?'ChurchOps Hub':raw;if([...field.options].some(o=>o.value===requested))field.value=requested;}
  document.getElementById('form-link-helper')?.addEventListener('submit',event=>{
    event.preventDefault();const input=document.getElementById('church-link'),feedback=document.getElementById('link-feedback');
    try{const url=new URL(input.value.trim());const hosts=['church-ops.com','www.church-ops.com'];const paths=['/invoice.html','/reimbursement.html','/event-request.html','/jobs.html','/invite.html','/open.html'];if(url.protocol!=='https:'||!hosts.includes(url.hostname)||url.port||url.username||url.password||!paths.includes(url.pathname))throw Error('invalid');feedback.textContent='Opening your original ChurchOps link…';location.assign(url.href);}
    catch{feedback.textContent='Please use a complete https://church-ops.com or https://www.church-ops.com form or invitation link from your church.';input.focus();}
  });
  if(document.querySelector('[data-enlarge]')){
    const dialog=document.createElement('dialog');dialog.className='image-dialog';dialog.setAttribute('aria-label','Product Screenshot');
    const bar=document.createElement('div');bar.className='image-dialog-top';const caption=document.createElement('p');const close=document.createElement('button');close.type='button';close.textContent='Close ×';const img=document.createElement('img');const original=document.createElement('a');original.textContent='Open Original Image';bar.append(caption,close);dialog.append(bar,img,original);document.body.append(dialog);
    close.addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
    document.querySelectorAll('[data-enlarge]').forEach(link=>link.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();img.src=link.href;img.alt=link.querySelector('img')?.alt||link.closest('article,figure')?.querySelector('img')?.alt||link.dataset.caption||'ChurchOps product screen';caption.textContent=img.alt;original.href=link.href;dialog.showModal();}));
  }
})();
