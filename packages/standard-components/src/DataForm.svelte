<script>
  import Form from "./Form.svelte"

  export let _bb
  export let model
  export let title
  export let buttonText
</script>

<Form {_bb} {model} {title} {buttonText} wide={false} />
