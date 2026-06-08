jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    context: {
      ...actual.context,
      getWorkspaceId: jest.fn(),
    },
    env: {
      ...actual.env,
      isTest: jest.fn(),
    },
    objectStore: {
      ...actual.objectStore,
      deleteFolder: jest.fn(),
      retrieve: jest.fn(),
    },
  }
})

jest.mock("../../../environment", () => ({
  __esModule: true,
  default: {
    UPLOAD_APPS_FILES_ON_TEST: false,
  },
  UPLOAD_APPS_FILES_ON_TEST: false,
}))

jest.mock("../filesystem", () => ({
  TOP_LEVEL_PATH: "/mock/top/level/path",
  deleteFolderFileSystem: jest.fn(),
}))

jest.mock("../clientLibrary", () => ({
  shouldServeLocally: jest.fn(),
  updateClientLibrary: jest.fn(),
}))

import { context, objectStore } from "@budibase/backend-core"
import { ObjectStoreBuckets } from "../../../constants"
import { shouldServeLocally, updateClientLibrary } from "../clientLibrary"
import { getComponentLibraryManifest } from "../app"

const mockedContext = context as jest.Mocked<typeof context>
const mockedObjectStore = objectStore as jest.Mocked<typeof objectStore>
const mockedShouldServeLocally = shouldServeLocally as jest.Mock
const mockedUpdateClientLibrary = updateClientLibrary as jest.Mock

const noSuchKey = () => ({
  name: "NoSuchKey",
  Code: "NoSuchKey",
  $metadata: {
    httpStatusCode: 404,
  },
})

describe("getComponentLibraryManifest", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockedContext.getWorkspaceId.mockReturnValue("app_dev_123")
    mockedShouldServeLocally.mockResolvedValue(false)
    jest.spyOn(console, "error").mockImplementation()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("loads a legacy manifest without updating the client library", async () => {
    const manifest = { Button: { name: "Button" } }
    mockedObjectStore.retrieve
      .mockRejectedValueOnce(noSuchKey())
      .mockResolvedValueOnce(JSON.stringify(manifest))

    const result = await getComponentLibraryManifest(
      "@budibase/standard-components"
    )

    expect(result).toEqual(manifest)
    expect(mockedObjectStore.retrieve).toHaveBeenCalledWith(
      ObjectStoreBuckets.APPS,
      "app_dev_123/node_modules/@budibase/standard-components/package/manifest.json"
    )
    expect(mockedUpdateClientLibrary).not.toHaveBeenCalled()
  })

  it("regenerates the client library when restored app manifests are missing", async () => {
    const manifest = { Container: { name: "Container" } }
    mockedObjectStore.retrieve
      .mockRejectedValueOnce(noSuchKey())
      .mockRejectedValueOnce(noSuchKey())
    mockedUpdateClientLibrary.mockResolvedValue(manifest)

    const result = await getComponentLibraryManifest(
      "@budibase/standard-components"
    )

    expect(result).toEqual(manifest)
    expect(mockedUpdateClientLibrary).toHaveBeenCalledWith("app_dev_123")
  })
})
