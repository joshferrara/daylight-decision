const assert = require('node:assert/strict');
const {app}=require('./load-app.cjs')();
const channels = color => [1,3,5].map(i=>parseInt(color.slice(i,i+2),16));
const difference = (a,b) => Math.max(...channels(a).map((n,i)=>Math.abs(n-channels(b)[i])));
function continuous(before,after,label) {
  for (const key of ['sky-top','sky-bottom','ground','buildings','windows','road']) {
    assert(difference(before[key],after[key])<=1,`${label}: ${key} jumps`);
  }
  assert(Math.abs(before.stars-after.stars)<.001,`${label}: stars jump`);
}
for(const altitude of [-12,-6,-.833,0,6]) {
  continuous(app.paletteForAltitude(altitude-.0001),app.paletteForAltitude(altitude+.0001),`Altitude ${altitude}`);
}
assert.equal(app.paletteForAltitude(-25)['sky-top'],'#172b49');
assert.equal(app.paletteForAltitude(40)['sky-top'],'#b8d4d6');
const winter=app.annual()[354];
for(const key of ['dawn','sunrise','sunset','dusk']) {
  continuous(app.scenePalette(winter[key]-.01,'st'),app.scenePalette(winter[key]+.01,'st'),key);
}
assert.equal(app.phase(winter,winter.sunrise-.01),'twilight');
assert.equal(app.phase(winter,winter.sunrise+.01),'daylight');
assert.equal(app.phase(winter,winter.dusk-.01),'twilight');
assert.equal(app.phase(winter,winter.dusk+.01),'dark');
continuous(app.scenePalette(-.01,'st'),app.scenePalette(.01,'st'),'Midnight');
console.log('Sky colors are continuous across dawn, sunrise, sunset, dusk, and midnight; phase cutoffs remain exact.');
