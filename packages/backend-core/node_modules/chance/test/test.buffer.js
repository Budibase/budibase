import test from "ava";
import Chance from "../chance.js";
import _ from "lodash";

const chance = new Chance();

// chance.buffer()
test("buffer() returns a random buffer", t => {
  _.times(1000, () => {
    let buffer = chance.buffer();
    t.true(_.isBuffer(buffer));
    let len = buffer.byteLength;
    t.true(len >= 5);
    t.true(len <= 20);
  });
});

// chance.buffer()
test("buffer() will obey bounds", t => {
  _.times(1000, () => {
    let buffer = chance.buffer({ length: 12 });
    t.true(_.isBuffer(buffer));
    t.is(buffer.byteLength, 12);
  });
});

// chance.buffer()
test("buffer() throws if length < 0", t => {
  const fn = () => chance.buffer({ length: -3 });
  t.throws(fn, "Chance: Length cannot be less than zero.");
});
