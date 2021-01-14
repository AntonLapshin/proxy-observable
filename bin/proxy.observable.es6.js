(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.observable = factory());
}(this, (function () { 'use strict';

class PubSub {
  /**
   * Creates an instance of PubSub
   */
  constructor() {
    this.fns = { any: [] };
  }

  /**
   * Checks if a event has at least one subscription
   * 
   * @param {string} e Event name
   * @returns {boolean}
   */
  has(e) {
    return (e in this.fns && this.fns[e].length > 0) || this.fns.any.length > 0;
  }

  /**
   * Subscribes on event
   * 
   * @param {string} e Event name
   * @param {function} fn Callback
   * @returns {function} Input callback
   */
  on(e, fn) {
    if (e in this.fns === false) {
      this.fns[e] = [];
    }
    this.fns[e].push(fn);
    return fn;
  }

  /**
   * Calls the event's callbacks
   * 
   * @param {string} e Event name
   * @param {any} value New value
   * @param {any} prev Previous value
   * @returns {object} Observable
   */
  fire(e, value, prev) {
    this.fns.any
      .concat(e in this.fns ? this.fns[e] : [])
      .forEach(fn => fn(value, prev, e));
    return this;
  }

  /**
   * Unsubscribes from event
   * 
   * @param {function} fn Callback
   * @returns {boolean} true if successfully unsubscribed
   */
  off(fn) {
    for (const e in this.fns) {
      const fns = this.fns[e];
      for (let i = 0; i < fns.length; i++) {
        if (fns[i] === fn) {
          fns.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Subscribes on event once
   * 
   * @param {string} e Event name 
   * @param {function} fn Callback
   * @returns {function} Callback for unsubscribing
   */
  once(e, fn) {
    const method = (value, prev, prop) => {
      fn(value, prev, prop);
      this.off(method);
    };
    this.on(e, method);
    return method;
  }
}

/**
 * Creates a proxy observable for an object or array
 * 
 * @param {object|Observable} target Input Object
 * @returns {Observable} Observable (ES6 Proxy)
 */
var observable = target => {
  if (target.on && target.off) {
    return target;
  }
  const pub = new PubSub();
  const observable = new Proxy(target, {
    get: (target, prop) => {
      if (prop in target) {
        if (target.constructor === Array) {
          let v = observable;
          if (prop === "pop") {
            v = target[target.length - 1];
          } else if (prop === "shift") {
            v = target[0];
          }
          if (prop !== "push" && prop !== "length") {
            pub.fire(prop, v);
          }
        }
        return target[prop];
      } else if (prop === "on") {
        return pub.on.bind(pub);
      } else if (prop === "once") {
        return pub.once.bind(pub);        
      } else if (prop === "off") {
        return pub.off.bind(pub);
      }
      return undefined;
    },
    set: (target, prop, v) => {
      if (target.constructor === Array) {
        if (prop !== "length") {
          pub.fire("change", v);
        }
      } else if (pub.has(prop)) {
        pub.fire(prop, v, target[prop]);
      }
      target[prop] = v;
      return true;
    }
  });

  return observable;
};

return observable;

})));
