import should from "should";
import { proxy } from "./proxy";

describe("Proxy", () => {
  it("basic usage", done => {
    const data = {
      name: "Titos Pullo",
      age: 36,
      inventory: proxy({
        sword: "Dagger",
        coins: 10
      })
    };
    data.inventory.proxy().on("coins", (value, _value) => {
      value.should.be.equal(12);
      _value.should.be.equal(10);
      done();
    });

    should.not.exist(data.inventory.proxy().shield);
    data.inventory.coins.should.be.equal(10);
    data.inventory.proxy().coins.should.be.equal(10);
    should.exist(data.inventory.proxy);
    data.inventory.proxy().coins = 12;
  });

  it("advanced usage", () => {
    const data = {
      name: "Titos Pullo",
      age: 36,
      inventory: proxy({
        sword: "Dagger",
        coins: 10
      })
    };
    let n = 0;
    const callback = (value, _value) => {
      n++;
    };
    data.inventory.proxy().on("coins", callback);

    data.inventory.proxy().coins = 12;
    data.inventory.proxy().off(callback);
    data.inventory.proxy().coins = 1200;
    n.should.be.equal(1);

    data.inventory.proxy().shield = "Scutum";
    data.inventory.shield.should.be.equal("Scutum");

    proxy(data.inventory).coins.should.be.equal(1200);
  });
});
