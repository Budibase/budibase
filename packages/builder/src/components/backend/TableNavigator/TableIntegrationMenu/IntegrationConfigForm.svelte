<script>
  import { Input, TextArea } from "@budibase/bbui"

  export let integration
</script>

<form>
  {#each Object.keys(integration) as configKey}
    <Input
      thin
      type={configKey.type}
      label={configKey}
      bind:value={integration[configKey]} />
  {/each}
</form>
