(() => {
 const scene=document.querySelector('.product-scene'),button=scene?.querySelector('.demo-motion');if(!scene||!button)return;
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 function state(paused){scene.dataset.paused=String(paused);button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'Play Demo Motion':'Pause Demo Motion';}
 function sync(){state(preference.matches);button.hidden=preference.matches;}
 sync();preference.addEventListener('change',sync);button.addEventListener('click',()=>state(scene.dataset.paused!=='true'));
})();
