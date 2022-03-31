// @ts-nocheck

const Redis = function () {
  this.get = jest.fn().mockResolvedValue({ response: "value" })
  this.set = jest.fn().mockResolvedValue({ response: "OK" })
  this.del = jest.fn().mockResolvedValue({ value: 1 })
  this.disconnect = jest.fn()
  this.pipeline = jest.fn(() => ({
    exec: jest.fn().mockResolvedValue([[null, ["result"]]]),
  }))

  this.close = jest.fn()
}

module.exports = Redis
