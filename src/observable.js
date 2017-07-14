export class Observable {
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
