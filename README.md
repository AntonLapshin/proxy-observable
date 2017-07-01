# proxy-observable
ES6 Proxy observable implementation

[![Build Status](https://travis-ci.org/AntonLapshin/proxy-observable.svg?branch=master)](https://travis-ci.org/AntonLapshin/proxy-observable)
[![Coverage Status](https://coveralls.io/repos/github/AntonLapshin/proxy-observable/badge.svg?branch=master&v=1)](https://coveralls.io/github/AntonLapshin/proxy-observable?branch=master)
[![Gemnasium](https://img.shields.io/gemnasium/mathiasbynens/he.svg)]()
![Lib Size](http://img.badgesize.io/AntonLapshin/proxy-observable/master/bin/proxy.observable.min.js.svg?compression=gzip)

One more JavaScript observable implementation??? xD Anyway I hope you'll forgive me! :)

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
    coins: 10
  })
};

console.log(JSON.stringify(soldier)); 
/*
{
  "name": "Titus Pullo",
  "age": 36,
  "inventory": { "sword": "Dagger", "coins": 10 }
}
*/

const callback = (value, _value) => {
  console.log(value, _value); // 999 10
}

console.log(soldier.inventory.coins); // 10
console.log(soldier.inventory.proxy().coins); // 10
console.log(soldier.inventory.sword); // "Dagger"
console.log(soldier.inventory.proxy().sword); // "Dagger"

soldier.inventory.proxy().on("coins", callback);

soldier.inventory.coins = 999; // callback will not be called
soldier.inventory.proxy().coins = 999; // callback will be called

soldier.inventory.proxy().off(callback);
```

`soldier.inventory` is still just a simple JS object but it has additionally method `proxy()` to get access to the proxy object.

```js
soldier.inventory.proxy().newProp = true;
console.log(soldier.inventory.proxy().newProp); // true
console.log(soldier.inventory.newProp); // true

console.log(soldier.inventory.proxy().nonExistingProp); // undefined
console.log(soldier.inventory.nonExistingProp); // undefined
```

Simply speaking `soldier.inventory.proxy()` is the same object as `soldier.inventory` but it has additionally a few things:

+ method `proxy().on` for subscribing
```js
proxy().on = (property, callback) => {} // callback takes two arguments: new value and old value
```
+ method `proxy().off` for unsubscribing
```js
proxy().off = (callback) => {}
```
+ you can call just `proxy().newProp = value` to define a new prop, instead of using `jsonObject["newProp"] = value` syntax

---

ES6 JavaScript Proxy MDN [documentation](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

See also [proxy-observable API](api.md)

---

## Browsers support <sub><sup><sub><sub>made by <a href="https://godban.github.io">godban</a></sub></sub></sup></sub>

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png" alt="iOS Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png" alt="Chrome for Android" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome for Android |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Edge| last 3 versions| last 10 versions| last 5 versions| last 4 versions| last 2 versions| last 3 versions

## License

MIT