import {
  PROTECTED_EXTERNAL_COLUMNS,
  PROTECTED_INTERNAL_COLUMNS,
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
  [K in (typeof PROTECTED_INTERNAL_COLUMNS)[number]]: any
} = {
  tableId: expect.anything(),
  type: expect.anything(),
  _id: expect.anything(),
  _rev: expect.anything(),
  createdAt: expect.anything(),
  updatedAt: expect.anything(),
}

export const expectAnyExternalColsAttributes: {
  [K in (typeof PROTECTED_EXTERNAL_COLUMNS)[number]]: any
} = {
  tableId: expect.anything(),
  _id: expect.anything(),
  _rev: expect.anything(),
}
