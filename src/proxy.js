import { Observable } from "./observable";

/**
 * Creates a proxy object and adds a getter of that proxy to the object
 * 
 * @param {object} ctx Input Object
 * @returns {object} Input Object
 */
export const proxy = ctx => {
  let proxy, observable;
  if (!ctx.proxy) {
    observable = new Observable();
    proxy = new Proxy(ctx, {
      get: (target, property) => {
        if (property in target) {
          return target[property];
        } else if (property === "on") {
          /**
           * on: Subscribes on property change
           * 
           * @param {string} name Property name
           * @param {function} callback (value, oldvalue) => {}
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
           * @param {function} callback (value, oldvalue) => {}
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
    ctx.proxy = () => proxy;
    ctx.observable = () => observable;
  } else {
    proxy = ctx.proxy();
    observable = ctx.observable();
  }
  return ctx;
};
