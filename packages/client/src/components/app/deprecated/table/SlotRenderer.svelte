<script>
  import { getContext } from "svelte"

  export let row

  const { Provider, ContextScopes } = getContext("sdk")
</script>

<Provider data={row} scope={ContextScopes.Local}>
  <slot />
</Provider>
