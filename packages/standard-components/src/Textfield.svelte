<script>
  import Input from "./Input.svelte"
  export let _bb

  export let label = ""
  export let value = ""
  export let onchange = () => {}
</script>

<Input type="text" {_bb} {label} {value} {onchange} />
