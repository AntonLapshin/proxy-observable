# proxy-observable
ES6 Proxy observable implementation. Supports Arrays and Objects

[![Build Status](https://travis-ci.org/AntonLapshin/proxy-observable.svg?branch=master)](https://travis-ci.org/AntonLapshin/proxy-observable)
[![Coverage Status](https://coveralls.io/repos/github/AntonLapshin/proxy-observable/badge.svg?branch=master&v=1)](https://coveralls.io/github/AntonLapshin/proxy-observable?branch=master)
[![Gemnasium](https://img.shields.io/gemnasium/mathiasbynens/he.svg)]()
![Lib Size](http://img.badgesize.io/AntonLapshin/proxy-observable/master/bin/proxy.observable.min.js.svg?compression=gzip)
[![npm](https://img.shields.io/npm/dt/proxy-observable.svg)](https://www.npmjs.com/package/proxy-observable)
[![GitHub stars](https://img.shields.io/github/stars/AntonLapshin/proxy-observable.svg?style=social&label=Star)](https://github.com/AntonLapshin/proxy-observable)

## Install

    npm install proxy-observable --save

## Usage

Just call `observable()` if you want an object or an array to be observable

```js
import observable from "proxy-observable";

const soldier = {
  name: "Titus Pullo",
  age: 36,
  inventory: observable({
    sword: "Dagger",
    coins: 0
  }),
  friends: observable(["Gaius Octavian"])
};

console.log(JSON.stringify(soldier, null, 2)); 
/* 
{
  "name": "Titus Pullo",
  "age": 36,
  "inventory": {
    "sword": "Dagger",
    "coins": 0
  },
  "friends": [
    "Gaius Octavian"
  ]
}
*/

//
// inventory Object
//
console.log(soldier.inventory.coins); // 0
console.log(soldier.inventory.sword); // "Dagger"
const onCoinsChanged = soldier.inventory.on("coins", (value, prev) => {
  console.log(value, prev); // 100 0
});
soldier.inventory.coins = 100; // onCoinsChanged will be called
soldier.inventory.off(onCoinsChanged);

//
// friends Array
//
soldier.friends.on("change", item => {
  console.log(item); // "Lucius Vorenus"
});
soldier.friends.on("shift", item => {
  console.log(item); // "Gaius Octavian"
});
soldier.friends.push("Lucius Vorenus"); // or soldier.friends[0] = "Lucius Vorenus"
soldier.friends.shift();
```

Simply speaking `soldier.inventory` is still just a simple object, but it has additionally a few things:

+ method `on` Attach a handler to an event for the elements.
+ method `once` Attach a handler to an event for the elements. The handler is executed at most once per element per event type.
+ method `off` Remove an event handler
+ you can call just `soldier.inventory.newProp = value` to define a new prop, instead of `soldier.inventory["newProp"] = value`

`soldier.friends` is still just a simple array with `on`, `once` and `off` methods and predefined events

## Array events

`change` - Fires when an item in an array is changed:

```js
arr[0] = "new value";
// or
arr.push("new value");
```

`pop` - Fires when `pop` method is called:

```js
arr.pop();
```

`shift` - Fires when `shift` method is called:

```js
arr.shift();
```

---

## `any` event

Do you want to track all the events? Just use `any` like this:

```js
// object
soldier.inventory.on("any", (value, prev, prop) => {
  console.log(prop); // "coins", "shield"
});
soldier.inventory.coins = 1000;
// This way you can track when a new property is added to an object
soldier.inventory.shield = "Gold Shield"; 

// array
soldier.friends.on("any", (value, prev, e) => {
  console.log(e); // "change", "pop", "shift" or any other method of Array
});
soldier.friends[0] = "Mark Antony";
soldier.friends.pop() = "Mark Antony";
```

---

## Browser Usage

```html
<!-- ES6 not minified version -->
<script src="../node_modules/proxy-observable/bin/proxy.observable.es6.js"></script>
<!-- ES5 minified version -->
<!--<script src="../node_modules/proxy-observable/bin/proxy.observable.min.js"></script>-->

<script>
  const soldier = {
    name: "Titus Pullo",
    age: 36,
    inventory: observable({
      sword: "Dagger",
      coins: 0
    })
  };

  console.log(soldier.inventory.coins); // 0
  soldier.inventory.on("coins", (value, prev) => {
    console.log(value, prev); // 100 0
  });
  soldier.inventory.coins = 100;
</script>
```

## One more example

```js
const Frodo = observable({
  name: "Frodo Baggins",
  bag: observable([]),
  friends: observable([])
});

const Samwise = {
  name: "Samwise Gamgee",
  friends: [Frodo]
};

Frodo.friends.on("change", friend => {
  console.log(`Frodo has a new friend ${friend.name}! Cograts!`);
});

Frodo.bag.on("any", (item, prev, e) => {
  if (e === "change") {
    console.log("Frodo got a new item: " + item);
    if (item === "ring") {
      console.log("Oh! My Precious!");
    }
  } else if (e === "pop" || e === "shift"){
    console.log("Frodo lost an item: " + item);
    if (item === "ring") {
      console.log("Gollum! I'm coming to get you!");
    }        
  }
});

Frodo.friends.push(Samwise);
Frodo.bag.push("apple");
Frodo.bag.push("ring");
Frodo.bag.pop();
Frodo.friends.pop();
```

---

ES6 JavaScript Proxy MDN [documentation](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

## Browsers support <sub><sup><sub><sub>made by <a href="https://godban.github.io">godban</a></sub></sub></sup></sub>

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png" alt="iOS Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png" alt="Chrome for Android" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome for Android |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| Edge| last 3 versions| last 10 versions| last 5 versions| last 4 versions| last 2 versions| last 3 versions

## License

MIT