import { SourceName } from "@budibase/types"
import type {
  Datasource,
  SaveTableRequest,
  SaveTableResponse,
  Table,
  UserCtx,
} from "@budibase/types"
import sdk from "../../../../sdk"
import { builderSocket } from "../../../../websockets"
import { destroy, updateTable } from "../external"

jest.mock("../../../../integrations/utils", () => ({
  breakExternalTableId: jest.fn().mockReturnValue({
    datasourceId: "datasource_plus_test",
  }),
}))

jest.mock("../../../../sdk", () => ({
  datasources: {
    removeSecretSingle: jest.fn(),
  },
  tables: {
    external: {
      destroy: jest.fn(),
      save: jest.fn(),
    },
    getTable: jest.fn(),
  },
}))

jest.mock("../../../../websockets", () => ({
  builderSocket: {
    emitDatasourceUpdate: jest.fn(),
  },
}))

const datasource: Datasource = {
  _id: "datasource_plus_test",
  type: "datasource",
  source: SourceName.POSTGRES,
  config: { password: "plaintext-secret" },
}

const redactedDatasource = {
  ...datasource,
  config: { password: "********" },
}

const table = {
  _id: "datasource_plus_test_table",
  name: "table",
  sourceId: datasource._id,
} as Table

const createCtx = () =>
  Object.assign({} as UserCtx<SaveTableRequest, SaveTableResponse>, {
    appId: "app_test",
    params: { tableId: table._id },
    request: { body: { ...table } },
  })

describe("external table controller", () => {
  let consoleLogSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation()
    jest
      .mocked(sdk.datasources.removeSecretSingle)
      .mockResolvedValue(redactedDatasource)
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  it("redacts the datasource before broadcasting a table update", async () => {
    jest.mocked(sdk.tables.external.save).mockResolvedValue({
      datasource,
      oldTable: table,
      table,
    })
    const ctx = createCtx()

    await updateTable(ctx)

    expect(sdk.datasources.removeSecretSingle).toHaveBeenCalledWith(datasource)
    expect(builderSocket?.emitDatasourceUpdate).toHaveBeenCalledWith(
      ctx,
      redactedDatasource
    )
  })

  it("redacts the datasource before broadcasting a table deletion", async () => {
    jest.mocked(sdk.tables.getTable).mockResolvedValue(table)
    jest.mocked(sdk.tables.external.destroy).mockResolvedValue({
      datasource,
      table,
    })
    const ctx = createCtx()

    await destroy(ctx)

    expect(sdk.datasources.removeSecretSingle).toHaveBeenCalledWith(datasource)
    expect(builderSocket?.emitDatasourceUpdate).toHaveBeenCalledWith(
      ctx,
      redactedDatasource
    )
  })

  it("returns the updated table when datasource redaction fails", async () => {
    jest.mocked(sdk.tables.external.save).mockResolvedValue({
      datasource,
      oldTable: table,
      table,
    })
    const redactionError = new Error("Plugin metadata unavailable")
    jest
      .mocked(sdk.datasources.removeSecretSingle)
      .mockRejectedValue(redactionError)
    const ctx = createCtx()

    await expect(updateTable(ctx)).resolves.toEqual({
      oldTable: table,
      table,
    })
    expect(builderSocket?.emitDatasourceUpdate).not.toHaveBeenCalled()
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Failed to broadcast external datasource update",
      redactionError
    )
  })

  it("returns the deleted table when datasource redaction fails", async () => {
    jest.mocked(sdk.tables.getTable).mockResolvedValue(table)
    jest.mocked(sdk.tables.external.destroy).mockResolvedValue({
      datasource,
      table,
    })
    jest
      .mocked(sdk.datasources.removeSecretSingle)
      .mockRejectedValue(new Error("Plugin metadata unavailable"))

    await expect(destroy(createCtx())).resolves.toEqual(table)
    expect(builderSocket?.emitDatasourceUpdate).not.toHaveBeenCalled()
  })

  it("returns the updated table when the websocket broadcast fails", async () => {
    jest.mocked(sdk.tables.external.save).mockResolvedValue({
      datasource,
      oldTable: table,
      table,
    })
    jest.mocked(builderSocket!.emitDatasourceUpdate).mockImplementation(() => {
      throw new Error("Websocket unavailable")
    })

    await expect(updateTable(createCtx())).resolves.toEqual({
      oldTable: table,
      table,
    })
  })
})
