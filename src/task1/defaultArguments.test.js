const { expect } = require("chai");
const { defaultArguments } = require("./defaultArguments");

describe("Task 1", () => {
  describe("defaultArguments", () => {
    // Functions for testing
    function add(a, b) {
      return a + b;
    }
    const foobar = (foo, bar) => foo + bar;
    function subtract(a, b) {
      return a - b;
    }
    function multiAdd(a, b, c) {
      return a + b + c;
    }

    /**
     *Please note that in the below tests, wrapping iterations will be indicated with a
     *number at the end of a functions name.
     *add2 indicates a function 'add' wrapped by defaultArguments once
     *add3 indicates a function 'add' wrapped by defaultArguments twice
     */

    it("Expect defaultArguments to incorporate a single default for a single call iteration.", done => {
      const add2 = defaultArguments(add, { b: 9 });
      expect(
        add2(10),
        "Expect a provided value of 10 to combine with default 9 to return 19."
      ).to.eq(19);
      expect(
        add2(10, 7),
        "Expect provided values of 10 and 7 to ignore the default to return 17."
      ).to.eq(17);
      expect(
        add2(),
        "Expect the absence of a necessary value that does not have a default, to return NaN."
      ).to.deep.eq(NaN);
      done();
    });

    it("Expect defaultArguments to incorporate multiple defaults for a layered call iteration.", done => {
      const add2 = defaultArguments(add, { b: 9 });
      const add3 = defaultArguments(add2, { b: 3, a: 2 });
      expect(
        add3(10),
        "Expect the provided value of 10 to combine with the new default of 3 to return 13."
      ).to.eq(13);
      expect(
        add3(),
        "Expect the function to combine the defaults of 2 and 3 to return 5."
      ).to.eq(5);
      expect(
        add3(undefined, 10),
        "Expect an undefined value to not replace the default of 2, allowing 2 and 10 to combine to return 12."
      ).to.eq(12);
      done();
    });

    it("Expect defaultArguments to ignore extraneous defaults for a single call iteration.", done => {
      const add2 = defaultArguments(add, { c: 3 });
      expect(
        add2(10),
        "Expect the absence of a necessary value that does not have a default, to return NaN."
      ).to.deep.eq(NaN);
      expect(
        add2(10, 10),
        "Expect provided values of 10 and 10 to ignore the default to return 17."
      ).to.eq(20);
      done();
    });

    it("Expect defaultArguments to work with differing function signature.", done => {
      const foobar2 = defaultArguments(foobar, { bar: "bar" });
      expect(
        foobar2("foo"),
        "Expect the provided value of foo to combine with the default of bar to return foobar."
      ).to.deep.eq("foobar");
      done();
    });

    it("Expect defaultArguments to work with differing function logic.", done => {
      const subtract2 = defaultArguments(subtract, { b: 6 });
      expect(
        subtract2(10),
        "Expect the provided value of 10 to have the default of 6 subtracted from it to return 4."
      ).to.deep.eq(4);
      done();
    });

    it("Expect defaultArguments to work with more than two arguments.", done => {
      const multiAdd2 = defaultArguments(multiAdd, { b: 4, c: 6 });
      expect(
        multiAdd2(10),
        "Expect the provided value of 10 to have the defaults of 4 and 6 added to it to return 20."
      ).to.deep.eq(20);
      expect(
        multiAdd2(10, 13),
        "Expect the provided values of 10 and 13 to have the default 6 added to them to return 29."
      ).to.deep.eq(29);
      done();
    });
  });
});
