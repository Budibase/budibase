<script>
  export let icon = ""

  $: console.log("ICON", icon)
</script>

<i class={`${icon}`} />
