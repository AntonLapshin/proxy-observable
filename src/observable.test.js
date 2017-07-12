import should from "should";
import { Observable } from "./observable";

describe("Observable", () => {
  it("has", () => {
    const item = new Observable({});
    const callback = () => {};
    item.has("test").should.be.equal(false);
    item.on("test", callback);
    item.change("test", true);
    item.has("test").should.be.equal(true);
    item.off(callback);
    item.has("test").should.be.equal(false);
  });

  it("on", done => {
    const item = new Observable({});
    item.on("test", (value, _value) => {
      value.should.be.equal(true);
      should.not.exist(_value);
      done();
    });
    item.on("test", () => {}); // second callback to the pool
    item.change("test", true);
  });

  it("change", () => {
    const item = new Observable({});
    item.change("test", true);
    item.target["test"].should.be.equal(true);
    item.change("test", false);
    item.target["test"].should.be.equal(false);
  });

  it("off", () => {
    const item = new Observable({});
    let n = 0;
    const callback = () => {
      n++;
    };
    item.off(callback).should.be.equal(false);
    item.on("test", callback);
    const fakeCallback = () => {};
    item.off(fakeCallback).should.be.equal(false);
    fakeCallback();
    item.change("test", true);
    item.off(callback).should.be.equal(true);
    item.change("test", false);
    n.should.be.equal(1);
  });

  it("once", () => {
    const item = new Observable({});
    let n = 0;
    const callback = () => {
      n++;
    };
    item.once("test", callback);
    item.change("test", true);
    item.change("test", false);
    n.should.be.equal(1);
  });
});
