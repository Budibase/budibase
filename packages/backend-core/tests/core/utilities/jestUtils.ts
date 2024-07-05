import {
  CONSTANT_EXTERNAL_ROW_COLS,
  CONSTANT_INTERNAL_ROW_COLS,
} from "@budibase/shared-core"

export function expectFunctionWasCalledTimesWith(
  jestFunction: any,
  times: number,
  argument: any
) {
  expect(
    jestFunction.mock.calls.filter((call: any) => call[0] === argument).length
  ).toBe(times)
}

export const expectAnyInternalColsAttributes: {
  [K in (typeof CONSTANT_INTERNAL_ROW_COLS)[number]]: any
} = {
  tableId: expect.anything(),
  type: expect.anything(),
  _id: expect.anything(),
  _rev: expect.anything(),
  createdAt: expect.anything(),
  updatedAt: expect.anything(),
}

export const expectAnyExternalColsAttributes: {
  [K in (typeof CONSTANT_EXTERNAL_ROW_COLS)[number]]: any
} = {
  tableId: expect.anything(),
  _id: expect.anything(),
  _rev: expect.anything(),
}
