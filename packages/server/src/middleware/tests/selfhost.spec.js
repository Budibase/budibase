const selfHostMiddleware = require("../selfhost");
const env = require("../../environment")
const hosting = require("../../utilities/builder/hosting");
jest.mock("../../environment") 
jest.mock("../../utilities/builder/hosting") 

describe("Self host middleware", () => {
  const next = jest.fn()
  const throwMock = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("calls next() when CLOUD and SELF_HOSTED env vars are set", async () => {
    env.CLOUD = 1 
    env.SELF_HOSTED = 1 

    await selfHostMiddleware({}, next)
    expect(next).toHaveBeenCalled()
  })

  it("throws when hostingInfo type is cloud", async () => {
    env.CLOUD = 0 
    env.SELF_HOSTED = 0

    hosting.getHostingInfo.mockImplementationOnce(() => ({ type: hosting.HostingTypes.CLOUD }))

    await selfHostMiddleware({ throw: throwMock }, next)
    expect(throwMock).toHaveBeenCalledWith(400, "Endpoint unavailable in cloud hosting.")
    expect(next).not.toHaveBeenCalled()
  })

  it("calls the self hosting middleware to pass through to next() when the hostingInfo type is self", async () => {
    env.CLOUD = 0 
    env.SELF_HOSTED = 0

    hosting.getHostingInfo.mockImplementationOnce(() => ({ type: hosting.HostingTypes.SELF }))

    await selfHostMiddleware({}, next)
    expect(next).toHaveBeenCalled()
  })
})
