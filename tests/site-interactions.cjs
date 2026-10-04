const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../assets/site.js'), 'utf8');
let checks = 0;
function boot(search = '', pathname = '/resources.html', hash = '') {
  const handlers = {};
  const nodes = Object.fromEntries(['form-link-helper', 'church-link', 'link-feedback', 'contact-form', 'contact-feedback'].map(id => [id, {
    value: '', textContent: '', focus() {}, addEventListener(type, fn) { handlers[id + ':' + type] = fn; }
  }]));
  nodes['contact-interest']={value:'The ChurchOps Suite',options:['The ChurchOps Suite','ChurchOps Hub','ChurchOps Live','ChurchOps Music','ChurchOps Count','Complete Suite — Pricing Preview','Something Else'].map(value=>({value}))};
  const links = ['invoice.html', 'reimbursement.html', 'event-request.html', 'jobs.html'].map(file => ({hidden:true, href:'/'+file, getAttribute(){return this.href;}}));
  const resourceNav = ['resources.html','forms.html','help.html'].map(file=>({href:'/'+file,getAttribute(){return this.href;}}));
  let destination;
  const location = {origin:'https://www.church-ops.com', search, pathname, hash, replace(value){destination=value;}, assign(value){destination=value;}, set href(value){destination=value;}};
  const document = {querySelector(){return null;}, querySelectorAll(s){return s==='[data-form]'?links:s==='[data-resource-nav]'?resourceNav:[];}, getElementById(id){return nodes[id];}, addEventListener(){}};
  vm.runInNewContext(source, {document, window:{location,addEventListener(){},matchMedia(){return {addEventListener(){}};}}, location, URL, URLSearchParams, FormData: class {constructor(form){this.data=form;}get(key){return this.data[key];}}});
  return {nodes, links, resourceNav, handlers, destination:()=>destination};
}
const valid='https://www.church-ops.com/invoice.html?teamId=sample-church&v=original&requestId=a%2Fb#details';
let app=boot();app.nodes['church-link'].value=valid;app.handlers['form-link-helper:submit']({preventDefault(){}});assert.equal(app.destination(),valid);checks++;
for (const invalid of ['https://evil.example/invoice.html?teamId=sample','javascript:alert(1)','http://www.church-ops.com/invoice.html','https://www.church-ops.com.evil.example/invoice.html','https://user:password@www.church-ops.com/invoice.html','https://www.church-ops.com:8443/invoice.html','https://www.church-ops.com/unrecognized.html']) {
 app=boot();app.nodes['church-link'].value=invalid;app.handlers['form-link-helper:submit']({preventDefault(){}});assert.equal(app.destination(),undefined);assert.match(app.nodes['link-feedback'].textContent,/complete https/);checks++;
}
app=boot();assert.ok(app.links.every(link=>link.hidden));checks++;
app=boot('?teamId=sample-church');assert.ok(app.links.every(link=>!link.hidden&&link.href.endsWith('?teamId=sample-church')));checks++;
app=boot('?teamId=%3Cscript%3E');assert.ok(app.links.every(link=>link.hidden));checks++;
app=boot();app.handlers['contact-form:submit']({preventDefault(){},currentTarget:{name:'Jordan & Lee',church:'Example Church',interest:'ChurchOps Hub',message:'A browser home for our team.\nCan we talk?'}});
const draft=new URL(app.destination());assert.equal(draft.protocol,'mailto:');assert.equal(draft.pathname,'hello@church-ops.com');assert.equal(draft.searchParams.get('subject'),'ChurchOps inquiry: ChurchOps Hub');assert.ok(draft.searchParams.get('body').includes('Jordan & Lee'));assert.ok(draft.searchParams.get('body').includes('\nCan we talk?'));assert.match(app.nodes['contact-feedback'].textContent,/Nothing has been sent/);checks++;
for(const interest of ['ChurchOps Live','ChurchOps Music','Complete Suite — Pricing Preview']){app=boot('?interest='+encodeURIComponent(interest));assert.equal(app.nodes['contact-interest'].value,interest);checks++;}
app=boot('?interest=Unrecognized');assert.equal(app.nodes['contact-interest'].value,'The ChurchOps Suite');checks++;

for(const portal of ['Staff Portal','Request Portal']) { const legacy=boot('?interest='+encodeURIComponent(portal)); assert.equal(legacy.nodes['contact-interest'].value,'ChurchOps Hub'); checks++; }
// Old bookmarks must open the new screen without dropping church context.
app=boot('?teamId=sample-church&requestId=a%2Fb','/resources.html','#forms');
assert.equal(app.destination(),'/forms.html?teamId=sample-church&requestId=a%2Fb');checks++;
app=boot('','/music.html','#platforms');assert.equal(app.destination(),undefined);checks++;
app=boot('','/resources.html','#access');assert.equal(app.destination(),undefined);checks++;
app=boot('','/resources.html','#https://evil.example');assert.equal(app.destination(),undefined);checks++;
app=boot('?teamId=sample-church');assert.ok(app.resourceNav.every(link=>link.href.endsWith('?teamId=sample-church')));checks++;
app=boot('?teamId=%3Cscript%3E');assert.ok(app.resourceNav.every(link=>!link.href.includes('?')));checks++;
console.log(JSON.stringify({checks,result:'passed',scope:'safe form-link handling, category navigation, legacy bookmarks, team context, email draft encoding; no network or messages'},null,2));
