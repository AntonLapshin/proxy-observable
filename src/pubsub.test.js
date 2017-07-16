import should from "should";
import { PubSub } from "./pubsub";

describe("PubSub", () => {
  it("has", () => {
    const item = new PubSub();
    item.has("test").should.be.equal(false);
    const callback = item.on("test", () => {});
    item.fire("test", true);
    item.has("test").should.be.equal(true);
    item.off(callback);
    item.has("test").should.be.equal(false);
  });

  it("on", done => {
    const item = new PubSub();
    item.on("test", (value, prev, e) => {
      value.should.be.equal(true);
      should.not.exist(prev);
      e.should.be.equal("test");
      done();
    });
    item.on("test", () => {}); // add the second callback to the pool
    item.fire("test", true);
  });

  it("off", () => {
    const item = new PubSub();
    let n = 0;
    item.off(callback).should.be.equal(false);
    const callback = item.on("test", () => {
      n++;
    });
    const fakeCallback = () => {};
    item.off(fakeCallback).should.be.equal(false);
    fakeCallback();
    item.fire("test", true);
    item.off(callback).should.be.equal(true);
    item.fire("test", false);
    n.should.be.equal(1);
  });

  it("once", () => {
    const item = new PubSub();
    let n = 0;
    item.once("test", (value, prev, e) => {
      e.should.be.equal("test");
      value.should.be.equal(true);
      should.not.exist(prev);      
      n++;
    });
    item.fire("test", true, undefined);
    item.fire("test", false);
    n.should.be.equal(1);
  });

  it("any", () => {
    const item = new PubSub();
    const fn1 = item.on("any", (value, prev, e) => {
      e.should.be.equal("test");
      value.should.be.equal(true);
      should.not.exist(prev);
    });
    const fn2 = item.on("any", () => {});
    fn2();
    item.fire("test", true, undefined);
    item.off(fn2);
    item.off(fn1);
  });
});
