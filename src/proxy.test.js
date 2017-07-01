import should from "should";
import { proxy } from "./proxy";

describe("Proxy", () => {
  it("basic usage", done => {
    const soldier = {
      name: "Titos Pullo",
      age: 36,
      inventory: proxy({
        sword: "Dagger",
        coins: 0
      })
    };

    soldier.inventory.on("coins", (value, prev) => {
      value.should.be.equal(100);
      prev.should.be.equal(0);
      done();
    });

    // non existing
    const callback = () => {};
    soldier.inventory.on("nonExistingField", callback);
    callback();

    should.not.exist(soldier.inventory.nonExistingField);
    soldier.inventory.coins.should.be.equal(0);
    soldier.inventory.coins = 100;
  });

  it("advanced usage", () => {
    const soldier = {
      name: "Titos Pullo",
      age: 36,
      inventory: proxy({
        sword: "Dagger",
        coins: 0
      })
    };
    let n = 0;
    const callback = (value, prev) => {
      n++;
    };
    soldier.inventory.on("coins", callback);

    soldier.inventory.coins = 100;
    soldier.inventory.off(callback);
    soldier.inventory.coins = 999;
    n.should.be.equal(1);

    soldier.inventory.shield = "Scutum";
    soldier.inventory.shield.should.be.equal("Scutum");

    proxy(soldier.inventory).coins.should.be.equal(999);
  });
});
