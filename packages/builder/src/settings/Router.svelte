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

  // Load the component
  let page: Component<Record<string, unknown>> | undefined

  $: memoRoute.set(route)

  $: entry = $memoRoute?.entry
  $: path = entry?.path
  $: component = entry?.component

  $: params = { ...($memoRoute?.params || {}) }
  $: routing.update(state => ({ ...state, params: { ...params } }))

  $: if (path && component) {
    page = component
  }
</script>

{#if page}
  {#key path}
    <svelte:component this={page} {...params} />
  {/key}
{/if}
