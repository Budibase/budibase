<script>
  import Input from "./Input.svelte"
  export let _bb

  export let label = ""
  export let checked = false
  export let value = ""
  export let onchange = () => {}
</script>

<Input type="radio" {_bb} {checked} {label} {value} {onchange} />
