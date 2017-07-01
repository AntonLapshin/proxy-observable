import { Observable } from "./observable";

/**
 * Creates a proxy for an object
 * 
 * @param {object|Proxy} ctx Input Object
 * @returns {Proxy} Proxy Object
 */
export const proxy = ctx => {
  if (ctx.on && ctx.off) {
    return ctx;
  }
  const observable = new Observable();
  const proxy = new Proxy(ctx, {
    get: (target, property) => {
      if (property in target) {
        return target[property];
      } else if (property === "on") {
        /**
         * on: Subscribes on property change
         * 
         * @param {string} name Property name
         * @param {function} callback (value, prev) => {}
         */
        return (name, callback) => {
          if (name in target) {
            observable.change(name, target[name]);
          }
          observable.on(name, callback);
        };
      } else if (property === "off") {
        /**
         * off: Unsubscribes from property change
         * 
         * @param {function} callback (value, prev) => {}
         */
        return callback => {
          observable.off(callback);
        };
      } else {
        return undefined;
      }
    },
    set: (target, property, value) => {
      if (observable.has(property)) {
        observable.change(property, value);
      } else {
        target[property] = value;
      }
      return true;
    }
  });

  return proxy;
};
