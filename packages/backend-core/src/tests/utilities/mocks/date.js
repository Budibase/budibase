exports.MOCK_DATE = new Date("2020-01-01T00:00:00.000Z")
exports.MOCK_DATE_TIMESTAMP = 1577836800000

exports.mock = () => {
  // eslint-disable-next-line no-global-assign
  Date = jest.fn(() => exports.MOCK_DATE)
  Date.now = jest.fn(() => exports.MOCK_DATE_TIMESTAMP)

  return {
    MOCK_DATE: exports.MOCK_DATE,
    MOCK_DATE_TIMESTAMP: exports.MOCK_DATE_TIMESTAMP,
  }
}
