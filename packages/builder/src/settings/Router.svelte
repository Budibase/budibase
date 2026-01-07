<script lang="ts">
  import type { Routing, MatchedRoute } from "@/types/routing"
  import type { Component } from "svelte"
  import { setContext } from "svelte"
  import { writable } from "svelte/store"
  import { memo } from "@budibase/frontend-core"

  export let route: MatchedRoute | undefined = undefined

  const memoRoute = memo<MatchedRoute | undefined>(route)

  // Routing context
  const routing = writable<Routing>({})
  setContext("routing", routing)

  // Load the comp
  let page: Component<Record<string, unknown>> | undefined

  $: memoRoute.set(route)

  $: entry = $memoRoute?.entry
  $: path = entry?.path
  $: comp = entry?.comp

  $: params = { ...($memoRoute?.params || {}) }
  $: routing.update(state => ({ ...state, params: { ...params } }))

  $: if (path && comp) {
    page = comp
  }
</script>

{#if page}
  <svelte:component this={page} />
{/if}
