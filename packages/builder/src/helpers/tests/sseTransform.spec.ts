import { describe, it, expect } from "vitest"
import { Utils } from "@budibase/frontend-core"

const { createSseToJsonTransformStream } = Utils

async function transformStream<T>(
  transform: TransformStream<string, T>,
  chunks: string[]
): Promise<T[]> {
  const results: T[] = []
  const writer = transform.writable.getWriter()
  const reader = transform.readable.getReader()

  const readPromise = (async () => {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      results.push(value)
    }
  })()

  for (const chunk of chunks) {
    await writer.write(chunk)
  }
  await writer.close()
  await readPromise

  return results
}

describe("createSseToJsonTransformStream", () => {
  it("parses complete SSE lines", async () => {
    const transform = createSseToJsonTransformStream<{ type: string }>()
    const results = await transformStream(transform, [
      'data: {"type":"hello"}\n',
      'data: {"type":"world"}\n',
    ])

    expect(results).toEqual([{ type: "hello" }, { type: "world" }])
  })

  it("handles chunks split across message boundaries", async () => {
    const transform = createSseToJsonTransformStream<{ type: string }>()
    const results = await transformStream(transform, [
      'data: {"type":"hel',
      'lo"}\ndata: {"type":"world"}\n',
    ])

    expect(results).toEqual([{ type: "hello" }, { type: "world" }])
  })

  it("handles multiple messages in a single chunk", async () => {
    const transform = createSseToJsonTransformStream<{ n: number }>()
    const results = await transformStream(transform, [
      'data: {"n":1}\ndata: {"n":2}\ndata: {"n":3}\n',
    ])

    expect(results).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }])
  })

  it("ignores [DONE] sentinel", async () => {
    const transform = createSseToJsonTransformStream<{ type: string }>()
    const results = await transformStream(transform, [
      'data: {"type":"hello"}\n',
      "data: [DONE]\n",
    ])

    expect(results).toEqual([{ type: "hello" }])
  })

  it("ignores empty lines", async () => {
    const transform = createSseToJsonTransformStream<{ type: string }>()
    const results = await transformStream(transform, [
      'data: {"type":"hello"}\n',
      "\n",
      "\n",
      'data: {"type":"world"}\n',
    ])

    expect(results).toEqual([{ type: "hello" }, { type: "world" }])
  })

  it("ignores non-data lines (comments, event types)", async () => {
    const transform = createSseToJsonTransformStream<{ type: string }>()
    const results = await transformStream(transform, [
      ": this is a comment\n",
      "event: message\n",
      'data: {"type":"hello"}\n',
      "id: 123\n",
    ])

    expect(results).toEqual([{ type: "hello" }])
  })

  it("handles realistic SSE stream with reasoning and text deltas", async () => {
    const transform = createSseToJsonTransformStream<{
      type: string
      delta?: string
    }>()
    const results = await transformStream(transform, [
      'data: {"type":"reasoning-start","id":"r-0"}\n',
      'data: {"type":"reasoning-delta","id":"r-0","delta":"Think',
      'ing..."}\n',
      'data: {"type":"reasoning-end","id":"r-0"}\n',
      'data: {"type":"text-start","id":"t-0"}\n',
      'data: {"type":"text-delta","id":"t-0","delta":"Hello"}\n',
      'data: {"type":"text-end","id":"t-0"}\n',
      "data: [DONE]\n",
    ])

    expect(results).toEqual([
      { type: "reasoning-start", id: "r-0" },
      { type: "reasoning-delta", id: "r-0", delta: "Thinking..." },
      { type: "reasoning-end", id: "r-0" },
      { type: "text-start", id: "t-0" },
      { type: "text-delta", id: "t-0", delta: "Hello" },
      { type: "text-end", id: "t-0" },
    ])
  })

  it("handles data split mid-JSON", async () => {
    const transform = createSseToJsonTransformStream<{
      nested: { value: number }
    }>()
    const results = await transformStream(transform, [
      'data: {"nested":',
      '{"value":',
      "42}}\n",
    ])

    expect(results).toEqual([{ nested: { value: 42 } }])
  })
})
