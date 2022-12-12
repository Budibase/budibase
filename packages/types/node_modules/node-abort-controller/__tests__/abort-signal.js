const { AbortController } = require("../index.js");

describe("AbortSignal", function () {
  it("should implement EventTarget", function () {
    const controller = new AbortController();
    const signal = controller.signal;
    const unusedHandler = jest.fn();
    const handler = jest.fn();
    const event = { type: "abort", target: signal };

    signal.onabort = jest.fn();
    signal.addEventListener("abort", handler);
    signal.addEventListener("abort", unusedHandler);
    signal.removeEventListener("abort", unusedHandler);

    signal.dispatchEvent("abort", event);

    expect(unusedHandler).not.toBeCalled();
    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith(event);
    expect(signal.onabort).toBeCalledTimes(1);
    expect(signal.onabort).toBeCalledWith(event);

    jest.clearAllMocks();
    signal.dispatchEvent("abort", event);

    expect(unusedHandler).not.toBeCalled();
    expect(handler).toBeCalledTimes(1);
    expect(handler).toBeCalledWith(event);
    expect(signal.onabort).toBeCalledTimes(1);
    expect(signal.onabort).toBeCalledWith(event);

    jest.clearAllMocks();
    signal.dispatchEvent("unknown", event);

    expect(unusedHandler).not.toBeCalled();
    expect(handler).not.toBeCalled();
    expect(signal.onabort).not.toBeCalled();
  });
});
