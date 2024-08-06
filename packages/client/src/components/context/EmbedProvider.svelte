<script>
  import Provider from "./Provider.svelte"

  $: data = window.parent?.data
  $: console.log("parentWindow", data)
</script>


<Provider key="embed" {data}>
  <slot />
</Provider>
