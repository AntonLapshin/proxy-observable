import { Observable } from "./observable";

/**
 * Creates a proxy for an object
 * 
 * @param {object|Proxy} ctx Input Object
 * @returns {Proxy} Proxy Object
 */
export default ctx => {
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
