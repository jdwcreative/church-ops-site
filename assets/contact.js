(() => {
 'use strict';
 const form=document.getElementById('contact-form');if(!form)return;
 const button=form.querySelector('button[type="submit"]');
 const feedback=document.getElementById('contact-feedback');
 let sending=false,requestId=null,lastData='';
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(sending||!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form));
  const signature=JSON.stringify(data);
  if(signature!==lastData||!requestId){requestId=crypto.randomUUID();lastData=signature;}
  data.requestId=requestId;sending=true;button.disabled=true;button.textContent='Sending…';feedback.textContent='';
  try {
   const response=await fetch(form.dataset.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(45000)});
   const result=await response.json();
   if(!response.ok||result.ok!==true)throw new Error(result.error||'We could not confirm delivery. Please retry or email hello@church-ops.com.');
   document.getElementById('contact-reply-email').textContent=data.email;
   document.getElementById('contact-reference').textContent='Reference: '+result.reference;
   form.hidden=true;const success=document.getElementById('contact-success');success.hidden=false;success.focus();
  } catch(error) {
   feedback.textContent=error.name==='TimeoutError'?'Delivery is taking longer than expected. Please retry; we’ll use the same reference to avoid a duplicate.':error.message==='Failed to fetch'?'We couldn’t reach the inquiry service. Your message is still here. Please retry or email hello@church-ops.com.':error.message;
  } finally {sending=false;button.disabled=false;button.textContent='Send Inquiry ↗';}
 });
})();
