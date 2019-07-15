import common, { isOneOf } from "../src/common";
import _ from "lodash";

const lessThan = (than) => (compare) => compare < than

describe("common > switchCase", () => {

    test("should return on first matching case", () => {

        const result = common.switchCase(
            [lessThan(1), _.constant("first")],
            [lessThan(2), _.constant("second")],
            [lessThan(3), _.constant("third")]
        )(1);

        expect(result).toBe("second");

    });

    test("should return undefined if case not matched", () => {

        const result = common.switchCase(
            [lessThan(1), _.constant("first")],
            [lessThan(2), _.constant("second")],
            [lessThan(3), _.constant("third")]
        )(10);

        expect(_.isUndefined(result)).toBeTruthy();

    });

});

describe("common > allTrue", () => {

    test("should only return true when all conditions are met", () => {

        const result1 = common.allTrue(
            lessThan(3), lessThan(5), lessThan(10)
        )(1);

        expect(result1).toBeTruthy();

        const result2 = common.allTrue(
            lessThan(3), lessThan(5), lessThan(10)
        )(7);

        expect(result2).toBeFalsy();

    });

});

describe("common > anyTrue", () => {

    test("should return true when one or more condition is met", () => {
        const result1 = common.anyTrue(
            lessThan(3), lessThan(5), lessThan(10)
        )(5);

        expect(result1).toBeTruthy();

        const result2 = common.anyTrue(
            lessThan(3), lessThan(5), lessThan(10)
        )(4);

        expect(result2).toBeTruthy();
    });

    test("should return false when no conditions are met", () => {
        const result1 = common.anyTrue(
            lessThan(3), lessThan(5), lessThan(10)
        )(15);

        expect(result1).toBeFalsy();

    });

});

const s = common.keySep;

describe("common > getDirFromKey", () => {
    test("should drop the final part of the path", () => {
        const key = `${s}one${s}two${s}three${s}last`;
        const expectedDIr = `${s}one${s}two${s}three`;
        const result = common.getDirFomKey(key);
        expect(result).toBe(expectedDIr);
    });

    test("should add leading /", () => {
        const key = `one${s}two${s}three${s}last`;
        const expectedDIr = `${s}one${s}two${s}three`;
        const result = common.getDirFomKey(key);
        expect(result).toBe(expectedDIr);
    });
});

describe("common > getFileFromKey", () => {
    test("should get the final part of the path", () => {
        const key = `one${s}two${s}three${s}last`;
        const expectedFile = "last";
        const result = common.getFileFromKey(key);
        expect(result).toBe(expectedFile);
    });
});

describe("common > getIndexKeyFromFileKey", () => {
    test("should get the index key of the file's directory", () => {
        const key = `one${s}two${s}three${s}file`;
        const expectedFile = common.dirIndex(`one${s}two${s}three`);
        const result = common.getIndexKeyFromFileKey(key);
        expect(result).toBe(expectedFile);
    });
});

describe("common > somethingOrDefault", () => {
    test("should use value if value is something", () => {
        const result = common.somethingOrDefault(
            "something", "default"
        );
        expect(result).toBe("something");
    });
    test("should use value if value is empty sting", () => {
        const result = common.somethingOrDefault(
            "", "default"
        );
        expect(result).toBe("");
    });
    test("should use value if value is empty array", () => {
        const result = common.somethingOrDefault(
            [], ["default"]
        );
        expect(result.length).toBe(0);
    });
    test("should use default if value is null", () => {
        const result = common.somethingOrDefault(
            null, "default"
        );
        expect(result).toBe("default");
    });
    test("should use default if value is undefined", () => {
        const result = common.somethingOrDefault(
            {}.notDefined, "default"
        );
        expect(result).toBe("default");
    });
});

describe("common > dirIndex", () => {
    it("should match /config/dir/<path>/dir.idx to path", () => {
        var result = common.dirIndex("some/path");
        expect(result).toBe(`${s}.config${s}dir${s}some${s}path${s}dir.idx`);
    });
});


describe("common > joinKey", () => {
    it("should join an array with the key separator and leading separator", () => {
        var result = common.joinKey("this", "is", "a", "path");
        expect(result).toBe(`${s}this${s}is${s}a${s}path`);
    });
})

describe("common > combinator ($$)", () => {
    it("combines single params functions and returns a func", () => {
        const f1 = str => str + " hello";
        const f2 = str => str + " there";
        const combined = common.$$(f1, f2);
        const result = combined("mike says");
        expect(result).toBe("mike says hello there");
    })
})

describe("common > pipe ($)", () => {
    it("combines single params functions and executes with given param", () => {
        const f1 = str => str + " hello";
        const f2 = str => str + " there";
        const result = common.$("mike says", [f1, f2]);
        expect(result).toBe("mike says hello there");
    })
})

describe("common > IsOneOf", () => {

    it("should return true when supplied value is in list of given vals", () => {
        expect(
            common.isOneOf("odo", "make")("odo")
        ).toBe(true);

        expect(
            common.isOneOf(1, 33, 9)(9)
        ).toBe(true);

        expect(
            common.isOneOf(true, false, "")(true)
        ).toBe(true);
    });

    it("should return false when supplied value is not in list of given vals", () => {
        expect(
            common.isOneOf("odo", "make")("bob")
        ).toBe(false);

        expect(
            common.isOneOf(1, 33, 9)(999)
        ).toBe(false);

        expect(
            common.isOneOf(1, false, "")(true)
        ).toBe(false);
    });

});

describe("defineError", () => {

    it("should prefix and exception with message, and rethrow", () => {

        expect(() =>
            common.defineError(() => {
                throw new Error("there")
            }, "hello"))
            .toThrowError("hello : there");
    });

    it("should return function value when no exception", () => {
        const result = common.defineError(() => 1, "no error");
        expect(result).toBe(1);
    });
});

describe("retry", () => {

    let counter = 0;

    it("should retry once", async () => {
        var result = await common.retry(async () => 1, 3, 50);
        expect(result).toBe(1);
    });

    it("should retry twice", async () => {
        var result = await common.retry(async () => {
            counter++;
            if (counter < 2) throw 'error';
            return counter;
        }, 3, 50);
        expect(result).toBe(2);
    });

    it("throws error after 3 retries", async () => {
        expect(
            common.retry(async () => { counter++; throw counter; }, 3, 50)
        ).rejects.toThrowError(4);
    });

});