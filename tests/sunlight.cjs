const fs = require('node:fs');
const assert = require('node:assert/strict');
const {app,element,html}=require('./load-app.cjs')();
const selectCity=id=>{element('city').value=id;element('city').listeners.change();};
const minutes=s=>s.split(':').map(Number).reduce((a,b,i)=>a+b*(i===0?60:1),0);
const external=[];
for (const [name,index] of [['winter',354],['summer',171]]) {
  const reference=JSON.parse(fs.readFileSync(`tests/fixtures/chicago-usno-${name}.json`)).properties.data.sundata;
  const sun=app.annual()[index];
  for (const [field,phen] of [['sunrise','Rise'],['sunset','Set'],['dawn','Begin Civil Twilight'],['dusk','End Civil Twilight']]) {
    const expected=minutes(reference.find(x=>x.phen===phen).time),difference=Math.abs(sun[field]-expected);
    assert(difference<3,`${name} ${field} differs from USNO by ${difference} min`);
    external.push({season:name,event:field,differenceMinutes:+difference.toFixed(2)});
  }
}
const ids=JSON.parse(fs.readFileSync('tests/fixtures/city-data.json')).map(c=>c[0]);
assert.equal(ids.length,81);
for(const id of ids){selectCity(id);const year=app.annual(),totals=app.totals();assert.equal(year.length,365);
  for(const day of year){assert(Number.isFinite(day.sunrise)&&Number.isFinite(day.sunset));assert(day.sunset>day.sunrise);assert(day.sunset-day.sunrise<=1440);}
  for(const t of Object.values(totals)){assert(t.darkDays>=0&&t.darkDays<=365);assert(t.eveningDays>=0&&t.eveningDays<=365);assert(t.morning>=0&&t.morning<=365);assert(t.evening>=0&&t.evening<=365*4);}
}
selectCity('chicago');
assert.equal(app.phase(app.annual()[354],450),'daylight');
const later=Object.fromEntries(Object.entries(app.annual()[354]).map(([k,v])=>[k,v+60]));
assert.equal(app.phase(later,450),'dark');
assert.equal(app.phase(app.annual()[354],1020),'dark');
assert.equal(app.phase(later,1020),'daylight');
assert.equal(app.overlap({sunrise:360,sunset:1080},390,450),60);
assert.equal(app.overlap({sunrise:360,sunset:1080},1020,1260),60);
assert.equal(app.overlap({sunrise:1380,sunset:1500},0,120),60,'Midnight-crossing daylight');
const safe=app.safeState({city:'bad',date:'2026-02-30',wake:900,leave:800,finish:700,bed:600,weight:Infinity,lat:90});
assert.equal(safe.city,'chicago');assert.equal(safe.date,'2026-12-21');assert.equal(safe.wake,390);assert.equal(safe.lat,undefined);
assert.equal(app.safeState({city:'custom',lat:0,lon:0,offset:0}).city,'chicago');
element('weight').value=0;element('weight').listeners.input();assert.match(element('verdict-title').textContent,/standard/);
element('weight').value=100;element('weight').listeners.input();assert.match(element('verdict-title').textContent,/daylight saving/);
const result={passed:true,locations:ids.length,cityDays:ids.length*365,usnoComparisons:external};

console.log(JSON.stringify(result,null,2));
