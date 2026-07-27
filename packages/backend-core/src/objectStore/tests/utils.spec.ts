import { fetchWithBlacklist } from "../../utils/outboundFetch"
import { processAutomationAttachment } from "../utils"

jest.mock("../../utils/outboundFetch", () => ({
  fetchWithBlacklist: jest.fn(),
}))

describe("objectStore attachment utils", () => {
  const fetchWithBlacklistMock = fetchWithBlacklist as jest.MockedFunction<
    typeof fetchWithBlacklist
  >

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("uses fetchWithBlacklist for http attachments", async () => {
    fetchWithBlacklistMock.mockRejectedValue(
      new Error("URL is blocked or could not be resolved safely.")
    )

    await expect(
      processAutomationAttachment({
        filename: "test.txt",
        url: "http://169.254.169.254/metadata/v1/",
      })
    ).rejects.toThrow("URL is blocked or could not be resolved safely.")

    expect(fetchWithBlacklistMock).toHaveBeenCalledWith(
      "http://169.254.169.254/metadata/v1/"
    )
  })
})
