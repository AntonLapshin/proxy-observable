# proxy-observable
ES6 Proxy observable implementation

[![Build Status](https://travis-ci.org/AntonLapshin/proxy-observable.svg?branch=master)](https://travis-ci.org/AntonLapshin/proxy-observable)
[![Coverage Status](https://coveralls.io/repos/github/AntonLapshin/proxy-observable/badge.svg?branch=master)](https://coveralls.io/github/AntonLapshin/proxy-observable?branch=master)
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
  name: "Titos Pullo",
  age: 36,
  inventory: proxy({
    sword: "Dagger",
    coins: 10
  })
};

console.log(JSON.stringify(soldier)); 
/*
{
  "name": "Titos Pullo",
  "age": 36,
  "inventory": { "sword": "Dagger", "coins": 10 }
}
*/

const callback = (value, _value) => {
  console.log(value, _value); // 12 10
}

soldier.inventory.proxy().on("coins", callback);

console.log(soldier.inventory.coins); // 10
console.log(soldier.inventory.proxy().coins); // 10
console.log(soldier.inventory.sword); // "Dagger"
console.log(soldier.inventory.proxy().sword); // "Dagger"


soldier.inventory.proxy().off(callback);
```

`soldier.inventory` is still just a simple JS object but it has additionally method `proxy()` to get access to the proxy object.

```js
soldier.inventory.proxy().newProp = true;
console.log(soldier.inventory.proxy().newProp); // true
console.log(soldier.inventory.newProp); // true

console.log(soldier.inventory.proxy().notExistingProp); // undefined
console.log(soldier.inventory.notExistingProp); // undefined
```

Simply speaking `soldier.inventory.proxy()` is the same object as soldier.inventory but it has additionally a few things:

+ method `proxy().on` for subscribing
```js
(property, callback) => {}
```
+ method `proxy().off` for unsubscribing
```js
(callback) => {}
```
+ you can call just `proxy().newProp = value` to define a new prop, instead of using `jsonObject["newProp"] = value` syntax


Library [API](api.md)