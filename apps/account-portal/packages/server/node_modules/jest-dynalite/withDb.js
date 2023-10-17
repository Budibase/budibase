const { startDb, stopDb, createTables, deleteTables } = require("./dist");

beforeAll(startDb);
beforeEach(createTables);
afterEach(deleteTables);
afterAll(stopDb);
