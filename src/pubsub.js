export class PubSub {
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
   * @returns {function} Input callback
   */
  once(e, fn) {
    const method = (value, prev, prop) => {
      fn(value, prev, prop);
      this.off(method);
    };
    this.on(e, method);
    return fn;
  }
}
