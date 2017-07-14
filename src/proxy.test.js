import should from "should";
import observable from "./proxy";

describe("Proxy", () => {
  it("basic usage", done => {
    const soldier = {
      name: "Titos Pullo",
      age: 36,
      inventory: observable({
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
      inventory: observable({
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

    observable(soldier.inventory).coins.should.be.equal(999);
  });

  it("arrays", done => {
    const frodo = {
      name: "Frodo",
      bag: observable([])
    };

    frodo.bag.on("change", data => {
      data.should.be.equal("ring")
    });
    frodo.bag.on("pop", data => {
      data.should.be.equal("ring");
      done();
    });  

    frodo.bag.push("ring");
    frodo.bag.pop();
  });
});
