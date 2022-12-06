<script>
  import { getContext } from "svelte"

  export let row

  const { Provider } = getContext("sdk")
</script>

<Provider data={row}>
  <slot />
</Provider>
