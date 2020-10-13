<script>
  import Form from "./Form.svelte"

  export let _bb
  export let table
  export let title
  export let buttonText
</script>

<Form {_bb} {table} {title} {buttonText} wide={true} />
