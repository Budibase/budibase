<script>
  import StringField from "./StringField.svelte"

  export let defaultValue
</script>

<StringField {...$$props} type="bigint" {defaultValue} />
