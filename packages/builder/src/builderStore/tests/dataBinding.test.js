import { expect, describe, it, vi } from "vitest"
import {
  runtimeToReadableBinding,
  readableToRuntimeBinding,
} from "../dataBinding"

vi.mock("@budibase/frontend-core")
vi.mock("builderStore/componentUtils")
vi.mock("builderStore/store")
vi.mock("builderStore/store/theme")
vi.mock("builderStore/store/temporal")

describe("runtimeToReadableBinding", () => {
  const bindableProperties = [
    {
      category: "Current User",
      icon: "User",
      providerId: "user",
      readableBinding: "Current User.firstName",
      runtimeBinding: "[user].[firstName]",
      type: "context",
    },
    {
      category: "Bindings",
      icon: "Brackets",
      readableBinding: "Binding.count",
      runtimeBinding: "count",
      type: "context",
    },
  ]
  it("should convert a runtime binding to a readable one", () => {
    const textWithBindings = `Hello {{ [user].[firstName] }}! The count is {{ count }}.`
    expect(
      runtimeToReadableBinding(
        bindableProperties,
        textWithBindings,
        "readableBinding"
      )
    ).toEqual(
      `Hello {{ Current User.firstName }}! The count is {{ Binding.count }}.`
    )
  })

  it("should not convert to readable binding if it is already readable", () => {
    const textWithBindings = `Hello {{ [user].[firstName] }}! The count is {{ Binding.count }}.`
    expect(
      runtimeToReadableBinding(
        bindableProperties,
        textWithBindings,
        "readableBinding"
      )
    ).toEqual(
      `Hello {{ Current User.firstName }}! The count is {{ Binding.count }}.`
    )
  })
})

describe("readableToRuntimeBinding", () => {
  const bindableProperties = [
    {
      category: "Current User",
      icon: "User",
      providerId: "user",
      readableBinding: "Current User.firstName",
      runtimeBinding: "[user].[firstName]",
      type: "context",
    },
    {
      category: "Bindings",
      icon: "Brackets",
      readableBinding: "Binding.count",
      runtimeBinding: "count",
      type: "context",
    },
  ]
  it("should convert a readable binding to a runtime one", () => {
    const textWithBindings = `Hello {{ Current User.firstName }}! The count is {{ Binding.count }}.`
    expect(
      readableToRuntimeBinding(
        bindableProperties,
        textWithBindings,
        "runtimeBinding"
      )
    ).toEqual(`Hello {{ [user].[firstName] }}! The count is {{ count }}.`)
  })
})
