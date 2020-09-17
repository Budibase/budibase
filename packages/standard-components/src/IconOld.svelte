<script>
  export let icon = ""
  export let fontSize = "1em"
  export let _bb

  $: style = { fontSize }
</script>

<i class={icon} {style} />
