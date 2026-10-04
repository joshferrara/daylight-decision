const fs = require('node:fs');
const vm = require('node:vm');

module.exports = function loadApp() {
  const elements = new Map();
  function element(id) {
    if (!elements.has(id)) elements.set(id, {
      value: '', innerHTML: '', textContent: '', checked: false, hidden: false,
      style: {setProperty(k,v) {this[k]=v;}}, validity: {valid:true}, listeners: {},
      classList: {toggle() {}}, setAttribute() {}, appendChild() {},
      addEventListener(name, fn) {this.listeners[name]=fn;}
    });
    return elements.get(id);
  }
  const context = {
    console, Date, Math, Object, Array, Number, String, JSON, URL, URLSearchParams,
    location: {search:'',href:'http://localhost/'},
    localStorage: {getItem() {return null;},setItem() {}},
    document: {getElementById:element,querySelectorAll() {return [];},
      createElement() {return element('scratch-'+Math.random());}}
  };
  context.window=context;
  vm.createContext(context);
  const html=fs.readFileSync('public/index.html','utf8');
  for (const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    vm.runInContext(match[1],context);
  }
  return {app:context.DaylightExplorer,element,html};
};
