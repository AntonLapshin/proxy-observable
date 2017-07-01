# proxy-observable
ES6 Proxy observable implementation

[![Build Status](https://travis-ci.org/AntonLapshin/proxy-observable.svg?branch=master)](https://travis-ci.org/AntonLapshin/proxy-observable)
[![Coverage Status](https://coveralls.io/repos/github/AntonLapshin/proxy-observable/badge.svg?branch=master&v=1)](https://coveralls.io/github/AntonLapshin/proxy-observable?branch=master)
[![Gemnasium](https://img.shields.io/gemnasium/mathiasbynens/he.svg)]()
![Lib Size](http://img.badgesize.io/AntonLapshin/proxy-observable/master/bin/proxy.observable.min.js.svg?compression=gzip)
[![npm](https://img.shields.io/npm/dt/proxy-observable.svg)](https://www.npmjs.com/package/proxy-observable)
[![GitHub stars](https://img.shields.io/github/stars/AntonLapshin/proxy-observable.svg?style=social&label=Star)](https://github.com/AntonLapshin/proxy-observable)

Install
-------

    npm install proxy-observable --save

Usage
-----

```js
import { proxy } from "proxy-observable";

const soldier = {
  name: "Titus Pullo",
  age: 36,
  inventory: proxy({
    sword: "Dagger",
    coins: 0
  })
};

console.log(JSON.stringify(soldier)); 
/*
{
  "name": "Titus Pullo",
  "age": 36,
  "inventory": { "sword": "Dagger", "coins": 0 }
}
*/

const callback = (value, prev) => {
  console.log(value, prev); // 100 0
}

console.log(soldier.inventory.coins); // 0
console.log(soldier.inventory.sword); // "Dagger"

soldier.inventory.on("coins", callback);
soldier.inventory.coins = 100; // callback will be called

soldier.inventory.off(callback);
```

Simply speaking `soldier.inventory` is still just a simple object, but it has additionally a few things:

+ method `on` for subscribing
+ method `off` for unsubscribing
+ you can call just `soldier.inventory.newProp = value` to define a new prop, instead of using `soldier.inventory["newProp"] = value` syntax

---

ES6 JavaScript Proxy MDN [documentation](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

See also [proxy-observable API](api.md)

---

Browser Usage
-----

```html
<!-- ES6 not minified version -->
<script src="../node_modules/proxy-observable/bin/proxy.observable.es6.js"></script>
<!-- ES5 minified version -->
<!--<script src="../node_modules/proxy-observable/bin/proxy.observable.min.js"></script>-->

<script>
  const proxy = window.proxyObservable.proxy;
  const soldier = {
    name: "Titus Pullo",
    age: 36,
    inventory: proxy({
      sword: "Dagger",
      coins: 0
    })
  };

  console.log(soldier.inventory.coins); // 0
  soldier.inventory.on("coins", (value, prev) => {
    console.log(value, prev); // 100 0
  });
  soldier.inventory..coins = 100;
</script>
```

## Browsers support <sub><sup><sub><sub>made by <a href="https://godban.github.io">godban</a></sub></sub></sup></sub>

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png" alt="iOS Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png" alt="Chrome for Android" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome for Android |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Edge| last 3 versions| last 10 versions| last 5 versions| last 4 versions| last 2 versions| last 3 versions

## License

MIT