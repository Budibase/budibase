<script>
  export let value
</script>

{Array.isArray(value) ? value.join(", ") : value}
