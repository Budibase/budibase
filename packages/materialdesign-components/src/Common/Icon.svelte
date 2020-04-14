<script>
  export let icon = ""
  export let context = ""

  let cls = !!context ? `material-icons mdc-${context}` : "material-icons"
</script>

<i class={cls}>{icon}</i>
