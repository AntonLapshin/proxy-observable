(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.observable = factory());
}(this, (function () { 'use strict';

class Observable {
  constructor(o) {
    this.fns = {};
    this.o = o;
    this.all = [];
  }

  /**
   * Checks if a property has at least one subscriber
   * 
   * @param {string} prop - Property name
   * @returns {boolean}
   */
  has(prop) {
    return prop in this.fns && this.fns[prop].length > 0 || this.all.length > 0;
  }

  /**
   * Subscribes on property change
   * 
   * @param {string} prop - Property name
   * @param {function} fn
   * @returns {object} Observable
   */
  on(prop, fn) {
    if (prop === "all") {
      this.all.push(fn);
      return this;
    }
    if (prop in this.fns === false) {
      this.fns[prop] = [];
    }
    this.fns[prop].push(fn);
    return this;
  }

  /**
   * Calls the property's callbacks
   * 
   * @param {string} prop - Property name
   * @param {object} value - New value
   * @returns {object} Observable
   */
  fire(prop, value) {
    const prev = this.o[prop];
    this.all.forEach(fn => fn(prop, value, prev));
    if (prop in this.fns) {
      this.fns[prop].forEach(fn => fn(value, prev));
    }
    return this;
  }

  /**
   * Unsubscribes from property change
   * 
   * @param {function} fn
   * @returns {boolean} if successfully unsubscribed
   */
  off(fn) {
    for (const prop in this.fns) {
      const fns = this.fns[prop];
      for (let i = 0; i < fns.length; i++) {
        if (fns[i] === fn) {
          fns.splice(i, 1);
          return true;
        }
      }
    }
    for (let i = 0; i < this.all.length; i++) {
      if (this.all[i] === fn) {
        this.all.splice(i, 1);
        return true;
      }
    }    
    return false;
  }

  /**
   * Subscribes on property change once
   * 
   * @param {string} prop 
   * @param {function} fn 
   */
  once(prop, fn) {
    const method = value => {
      const prev = this.o[prop];
      fn(value, prev);
      this.off(method);
    };
    this.on(prop, method);
  }
}

/**
 * Creates a proxy for an object
 * 
 * @param {object|Proxy} ctx Input Object
 * @returns {Proxy} Proxy Object
 */
var proxy = ctx => {
  if (ctx.on && ctx.off) {
    return ctx;
  }
  const o = new Observable(ctx);
  const observable = new Proxy(ctx, {
    get: (t, prop) => {
      if (prop in t) {
        if (t.constructor === Array && prop === "pop") {
          o.fire("pop", t[t.length - 1]);
        }
        return t[prop];
      } else if (prop === "on") {
        /**
         * on: Subscribes on property change
         * 
         * @param {string} name Property name
         * @param {function} fn (value, prev) => {}
         */
        return (name, fn) => {
          if (name in t) {
            o.fire(name, t[name]);
          }
          o.on(name, fn);
        };
      } else if (prop === "off") {
        /**
         * off: Unsubscribes from property change
         * 
         * @param {function} fn (value, prev) => {}
         */
        return fn => {
          o.off(fn);
        };
      } else {
        return undefined;
      }
    },
    set: (t, prop, v) => {
      if (t.constructor === Array && prop !== "length") {
        o.fire("change", v);
      } else if (o.has(prop)) {
        o.fire(prop, v);
      }
      t[prop] = v;
      return true;
    }
  });

  return observable;
};

return proxy;

})));
