import type { Component } from "svelte"
import LegacyHost from "./LegacyHost.svelte"

type LegacyCtor = new (o: { target: Element; props?: any }) => any

export function wrapLegacyComponent(ctor: LegacyCtor): Component {
  return (internals, props: Record<string, any> | undefined) =>
    LegacyHost(internals, { ...(props ?? {}), ctor })
}

export function isLegacySvelteComponent(Component: any) {
  if (typeof window === "undefined" || typeof Component !== "function")
    return false
  const internal =
    (window as any)?.svelteLegacyInternal || (window as any)?.svelte_internal
  const Base = internal?.SvelteComponent || internal?.SvelteComponentDev
  return !!Base && Component.prototype instanceof Base
}
