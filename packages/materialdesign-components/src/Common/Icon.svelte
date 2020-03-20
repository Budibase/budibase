<script>
  export let icon = ""
  export let context = ""

  let cls = !!context ? `material-icons mdc-${context}__icon` : "material-icons"
</script>

<i class={cls}>{icon}</i>
