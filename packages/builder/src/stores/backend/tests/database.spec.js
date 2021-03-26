import { database } from "../"

describe("Backend DataSources Store", () => {

  let state;
  let unsub;

  beforeEach(() => {
    unsub = database.subscribe(s => state = s);
  })
  afterEach(() => {
    unsub()
  })

  it("initialises correctly", () => {
    expect(state.list, [])
  })
})

const api = {
    post: () => ({}),
    get: () => ({}),
    patch: () => ({}),
    delete: () => ({}),
    put: () => ({}),
  }