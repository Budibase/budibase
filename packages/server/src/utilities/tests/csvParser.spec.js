const csvParser = require("../csvParser");

const CSV_PATH = __dirname + "/test.csv";

const SCHEMAS = {
  VALID: {
    Age: {
      type: "number",
    },
  },
  INVALID: {
    Address: {
      type: "number",
    },
    Age: {
      type: "number",
    },
  },
  IGNORE: {
    Address: {
      type: "omit",
    },
    Age: {
      type: "omit",
    },
  },
  BROKEN: {
    Address: {
      type: "datetime",
    }
  },
};

describe("CSV Parser", () => {
  describe("parsing", () => {
    it("returns status and types for a valid CSV transformation", async () => {
      expect(
        await csvParser.parse(CSV_PATH, SCHEMAS.VALID)
      ).toEqual({
        Address: {
          success: true,
          type: "string",
        },
        Age: {
          success: true,
          type: "number",
        },
        Name: {
          success: true,
          type: "string",
        },
      });
    });

    it("returns status and types for an invalid CSV transformation", async () => {
      expect(
        await csvParser.parse(CSV_PATH, SCHEMAS.INVALID)
      ).toEqual({
        Address: {
          success: false,
          type: "number",
        },
        Age: {
          success: true,
          type: "number",
        },
        Name: {
          success: true,
          type: "string",
        },
      });
    });
  });

  describe("transformation", () => {
    it("transforms a CSV file into JSON", async () => {
      expect(
        await csvParser.transform({
          schema: SCHEMAS.VALID,
          path: CSV_PATH,
        })
      ).toMatchSnapshot();
    });

    it("transforms a CSV file into JSON ignoring certain fields", async () => {
      expect(
        await csvParser.transform({
          schema: SCHEMAS.IGNORE,
          path: CSV_PATH,
        })
      ).toEqual([
        {
          Name: "Bert"
        },
        {
          Name: "Ernie"
        },
        {
          Name: "Big Bird"
        }
      ]);
    });

    it("throws an error on invalid schema", async () => {
      await expect(csvParser.transform({ schema: SCHEMAS.BROKEN, path: CSV_PATH })).rejects.toThrow()
    });
  });
});
