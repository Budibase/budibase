<script lang="ts">
  import StringField from "./StringField.svelte"

  let props = $props()
</script>

<StringField {...props} type="url" autocomplete="url" />
