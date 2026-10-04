const assert=require('node:assert/strict');
const {test}=require('node:test');
const {estimate,read,query,description}=require('../assets/pricing.js');
test('Hub tiers retain actual monthly and annual charges',()=>{
 for(const [hub,monthly,annual] of [['starter',2999,29999],['team',7999,79999],['growth',14999,99999]]){
  assert.equal(estimate({hub}).total,monthly);assert.equal(estimate({hub,period:'annual'}).total,annual);
 }
});
test('bundle uses selected Hub tier, with Count included and monitoring extra',()=>{
 assert.equal(estimate({hub:'team',pack:true}).total,14899);
 assert.equal(estimate({hub:'growth',pack:true}).total,21899);
 assert.equal(estimate({hub:'team',pack:true,period:'annual'}).total,148999);
 assert.equal(estimate({hub:'growth',pack:true,period:'annual'}).total,168999);
 const q=estimate({hub:'team',pack:true,sound:3});assert.equal(q.total,17599);assert.equal(q.savings,3800);assert.equal(q.lines.length,3);
});
test('individual products work with or without Hub; no discount without Hub',()=>{
 assert.equal(estimate({live:'basic',sound:1}).total,2800);
 assert.equal(estimate({music:true}).total,2900);
 assert.equal(estimate({count:true}).total,1900);
 assert.equal(estimate({live:'pro',music:true,count:true,pack:true}).total,10700);
 assert.equal(estimate({hub:'starter',live:'basic',music:true}).total,7799);
});
test('room monitoring requires Live and cannot exceed room capacity',()=>{
 for(const sound of [-1,0,1,3,999,NaN,Infinity,1.5])assert.equal(estimate({sound}).sound,0);
 assert.equal(estimate({live:'basic',sound:3}).sound,1);
 assert.equal(estimate({live:'pro',sound:999}).sound,3);
 assert.equal(estimate({live:'pro',sound:2,period:'annual'}).total,77000);
});
test('all combinations preserve exact cents and nonnegative totals',()=>{
 for(const hub of ['none','starter','team','growth'])for(const live of ['none','basic','pro'])for(const period of ['monthly','annual'])for(const pack of [false,true])for(const music of [false,true])for(const count of [false,true])for(const sound of [0,1,2,3]){
  const q=estimate({hub,live,period,pack,music,count,sound});assert.ok(Number.isSafeInteger(q.total)&&q.total>=0);assert.deepEqual(read(query(q)),q);assert.ok(q.sound<=q.rooms);
 }
});
test('query input cannot inject arbitrary content into inquiry',()=>{
 const q=read('?hub=__proto__&live=<script>&sound=999&period=oops&music=1&plan=1');assert.equal(q.hub,'none');assert.equal(q.total,2900);assert.ok(!description(q).includes('<script>'));
});
test('inquiry includes selections, period and estimate, not just an interest label',()=>{
 const s=description(estimate({hub:'team',pack:true,sound:1,period:'annual'}));assert.match(s,/Hub Team/);assert.match(s,/Sound Level Monitoring · 1 Room/);assert.match(s,/\$1,579.99/);assert.match(s,/full annual charge/);
});
