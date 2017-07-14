import should from "should";
import { Observable } from "./observable";

describe("Observable", () => {
  it("has", () => {
    const item = new Observable({});
    const callback = () => {};
    item.has("test").should.be.equal(false);
    item.on("test", callback);
    item.fire("test", true);
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
    item.fire("test", true);
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
    item.fire("test", true);
    item.off(callback).should.be.equal(true);
    item.fire("test", false);
    n.should.be.equal(1);
  });

  it("once", () => {
    const item = new Observable({});
    let n = 0;
    const callback = () => {
      n++;
    };
    item.once("test", callback);
    item.fire("test", true);
    item.fire("test", false);
    n.should.be.equal(1);
  });
});
