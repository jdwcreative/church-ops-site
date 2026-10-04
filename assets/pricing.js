/* Proposed website estimates only. This catalog does not grant app entitlements. */
(() => {
  'use strict';
  const hubPlans = {starter:[2999,29999,3],team:[7999,79999,10],growth:[14999,99999,25]};
  const labels = {starter:'Hub Starter',team:'Hub Team',growth:'Hub Growth'};
  const money = cents => '$' + (cents / 100).toLocaleString('en-US',{minimumFractionDigits:cents%100?2:0,maximumFractionDigits:2});
  function estimate(input={}) {
    const hub = Object.hasOwn(hubPlans,input.hub) ? input.hub : 'none';
    const annual = input.period === 'annual', period = annual?'annual':'monthly';
    const pack = !!hubPlans[hub] && input.pack === true;
    const live = pack?'pro':['basic','pro'].includes(input.live)?input.live:'none';
    const music = pack || input.music === true, count = pack || input.count === true;
    const rooms = live==='pro'?3:live==='basic'?1:0;
    const sound = Math.max(0,Math.min(rooms,Number.isSafeInteger(input.sound)?input.sound:0));
    const multiplier = annual?10:1, lines=[];
    if(hubPlans[hub]) lines.push([labels[hub]+' · '+hubPlans[hub][2]+' Seats',hubPlans[hub][annual?1:0]]);
    if(pack) lines.push(['All Products Add-on · Live Pro + Music + Count',6900*multiplier]);
    else {
      if(live!=='none') lines.push(['Live '+(live==='pro'?'Pro':'Basic'),(live==='pro'?5900:1900)*multiplier]);
      if(music) lines.push(['Music · 1 Workspace',2900*multiplier]);
      if(count) lines.push(['Count · 1 Campus',1900*multiplier]);
    }
    if(sound) lines.push(['Sound Level Monitoring · '+sound+' '+(sound===1?'Room':'Rooms'),900*sound*multiplier]);
    return {hub,live,music,count,pack,sound,rooms,period,lines,total:lines.reduce((sum,line)=>sum+line[1],0),savings:pack?3800*multiplier:0};
  }
  function read(search) {
    const p=new URLSearchParams(search);
    return estimate({hub:p.get('hub'),live:p.get('live'),music:p.get('music')==='1',count:p.get('count')==='1',pack:p.get('pack')==='1',sound:Number(p.get('sound')),period:p.get('period')});
  }
  function query(q) {
    return new URLSearchParams({plan:'1',hub:q.hub,live:q.live,music:q.music?'1':'0',count:q.count?'1':'0',pack:q.pack?'1':'0',sound:String(q.sound),period:q.period}).toString();
  }
  function description(q) {
    return 'I’m interested in this proposed ChurchOps plan:\n'+q.lines.map(([name,amount])=>name+': '+money(amount)+'/'+(q.period==='annual'?'year':'month')).join('\n')+'\nEstimated total: '+money(q.total)+'/'+(q.period==='annual'?'year (full annual charge)':'month')+'.\nPlease confirm availability, setup, and final pricing.\n\nAbout our church: ';
  }
  if(typeof module!=='undefined'&&module.exports){module.exports={estimate,read,query,description,money};return;}
  const form=document.getElementById('plan-builder');
  if(form){
    const field=id=>document.getElementById('plan-'+id);
    const fields=['hub','live','music','count','pack','sound','period'];
    function render(input){
      const q=estimate(input);
      fields.forEach(key=>{if(typeof q[key]==='boolean')field(key).checked=q[key];else field(key).value=String(q[key]);});
      field('pack').disabled=q.hub==='none';
      ['live','music','count'].forEach(key=>field(key).disabled=q.pack);
      field('sound').disabled=!q.rooms;
      Array.from(field('sound').options).forEach(option=>{option.disabled=Number(option.value)>q.rooms;});
      document.getElementById('sound-eligibility').textContent=q.rooms?'Choose up to '+q.rooms+' monitored '+(q.rooms===1?'room':'rooms')+' for this Live plan.':'Choose Live Basic or Pro to add room monitoring.';
      const list=document.getElementById('plan-lines');list.replaceChildren();
      q.lines.forEach(([name,amount])=>{const li=document.createElement('li'),label=document.createElement('span'),price=document.createElement('strong');label.textContent=name;price.textContent=money(amount);li.append(label,price);list.append(li);});
      document.getElementById('plan-total').textContent=money(q.total);
      document.getElementById('plan-period-label').textContent=q.period==='annual'?'/year':'/month';
      document.getElementById('plan-billing-note').textContent=q.period==='annual'?'Full annual amount, billed yearly in USD.':'Monthly amount in USD.';
      const savings=document.getElementById('plan-savings');savings.hidden=!q.savings;savings.textContent='Bundle savings: '+money(q.savings)+'/'+(q.period==='annual'?'year':'month')+' compared with these products individually.';
      const link=document.getElementById('plan-inquiry');link.hidden=!q.lines.length;link.href='/contact.html?interest='+encodeURIComponent(q.pack?'Complete Suite — Pricing Preview':q.hub!=='none'?'ChurchOps Hub':q.live!=='none'?'ChurchOps Live':q.music?'ChurchOps Music':'ChurchOps Count')+'&'+query(q);
      document.getElementById('plan-empty').hidden=!!q.lines.length;
    }
    const refresh=()=>render(Object.fromEntries(fields.map(key=>[key,['pack','music','count'].includes(key)?field(key).checked:key==='sound'?Number(field(key).value):field(key).value])));
    form.addEventListener('change',refresh);
    field('period').addEventListener('change',refresh);
    form.addEventListener('submit',event=>event.preventDefault());
    document.getElementById('standalone-choice').addEventListener('click',()=>{render({hub:'none',live:'basic',period:field('period').value});field('live').focus();});
    const params=new URLSearchParams(location.search);
    render(params.get('plan')==='1'?read(location.search):{hub:'team',live:'none'});
    form.hidden=false;document.getElementById('plan-summary').hidden=false;
  }
  const message=document.getElementById('contact-message');
  if(message&&!message.value.trim()&&new URLSearchParams(location.search).get('plan')==='1'){
    const q=read(location.search);if(q.lines.length)message.value=description(q);
  }
})();
