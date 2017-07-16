import { PubSub } from "./pubsub";

/**
 * Creates a proxy observable for an object or array
 * 
 * @param {object|Observable} target Input Object
 * @returns {Observable} Observable (ES6 Proxy)
 */
export default target => {
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
