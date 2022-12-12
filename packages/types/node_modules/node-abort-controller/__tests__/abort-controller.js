const { AbortController } = require("../index.js");

describe("AbortController", function () {
  it("should call abort handlers once", function () {
    const controller = new AbortController();
    const signal = controller.signal;
    const handler = jest.fn();

    expect(signal.onabort).toBeNull();
    expect(signal.aborted).toBe(false);

    signal.onabort = jest.fn();
    signal.addEventListener("abort", handler);

    controller.abort();

    expect(signal.aborted).toBe(true);
    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith({ type: "abort", target: signal });
    expect(signal.onabort).toBeCalledTimes(1);
    expect(signal.onabort).toBeCalledWith({ type: "abort", target: signal });

    jest.clearAllMocks();
    controller.abort();

    expect(signal.aborted).toBe(true);
    expect(handler).not.toBeCalled();
    expect(signal.onabort).not.toBeCalled();
  });
});
