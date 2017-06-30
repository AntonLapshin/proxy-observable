import { Observable } from "./observable";

/**
 * Creates a proxy object and adds a getter of that proxy to an object
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
          return (name, callback) => {
            observable.on(name, callback);
          };
        } else if (property === "off") {
          return token => {
            observable.off(token);
          };
        } else {
          return null;
        }
      },
      set: (target, property, value) => {
        if (observable.has(property)) {
          observable.change(property, value);
        } else if (property in target) {
          target[property] = value;
        } else {
          observable.on(property, value => {
            ctx[property] = value;
          });
          observable.change(property, value);
        }
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
