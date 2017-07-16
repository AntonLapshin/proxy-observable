import should from "should";
import observable from "./observable";

describe("Observable", () => {
  it("basic usage", () => {
    const ob = observable({
      coins: 0
    });
    ob.coins.should.be.equal(0);

    ob.on("coins", (value, prev, prop) => {
      value.should.be.equal(100);
      prev.should.be.equal(0);
      prop.should.be.equal("coins");
    });

    // non existing
    const callback = ob.on("nonExistingField", () => {});
    callback();

    should.not.exist(ob.nonExistingField);
    ob.coins = 100;

    ob.once("any", (value, prev, prop) => {
      value.should.be.equal(36);
      should.not.exist(prev);
      prop.should.be.equal("age");
    });

    ob.age = 36;
    ob.age = 40;
  });

  it("advanced usage", () => {
    const ob = observable({
      coins: 0
    });
    let n = 0;
    const callback = ob.on("coins", (value, prev, prop) => {
      n++;
    });

    ob.coins = 100;
    ob.off(callback);
    ob.coins = 999;
    n.should.be.equal(1);

    ob.shield = "Scutum";
    ob.shield.should.be.equal("Scutum");

    observable(ob).coins.should.be.equal(999);
  });

  it("arrays", done => {
    const bag = observable([]);

    const changeCallback = bag.on("change", (value, prev, prop) => {
      value.should.be.equal("ring");
      should.not.exist(prev);
      prop.should.be.equal("change");
    });
    bag.on("pop", (value, prev, prop) => {
      value.should.be.equal("ring");
      should.not.exist(prev);
      prop.should.be.equal("pop");
    });
    bag.push("ring");
    bag.pop();

    bag.off(changeCallback);
    bag.on("shift", (value, prev, prop) => {
      value.should.be.equal("ring");
      should.not.exist(prev);
      prop.should.be.equal("shift");
      done();
    });
    bag.push("ring");
    bag.push("apple");
    bag.shift();
  });

  it("any", done => {
    const ob = observable({ coins: 0 });
    const bag = observable([]);

    ob.on("any", (value, prev, prop) => {
      value.should.be.equal(100);
      prev.should.be.equal(0);
      prop.should.be.equal("coins");
    });

    bag.on("any", (value, prev, prop) => {
      value.should.be.equal("ring");
      should.not.exist(prev);
      prop.should.be.equal("change");
      done();
    });

    ob.coins = 100;
    bag.push("ring");
  });
});
