<script>
  import Form from "./Form.svelte"

  export let table
  export let title
  export let buttonText
  export let styles
</script>

<Form {styles} {table} {title} {buttonText} wide />
