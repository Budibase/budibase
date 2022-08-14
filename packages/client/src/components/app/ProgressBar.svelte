<script></script>
  import { getContext } from "svelte"

  const component = getContext("component")

  export let size = "M"
  export let progress = "50" 
  export let label

  $: size = size?.toLowerCase()
  $: if (!label) ? label = "Progress ..." : label = label

</script>

<div>Hello !</div>
