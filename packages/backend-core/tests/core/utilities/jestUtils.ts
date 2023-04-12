export function expectFunctionWasCalledTimesWith(
  jestFunction: any,
  times: number,
  argument: any
) {
  expect(
    jestFunction.mock.calls.filter((call: any) => call[0] === argument).length
  ).toBe(times)
}
