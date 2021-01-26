<script>
  import { Input, TextArea, Spacer } from "@budibase/bbui"

  export let integration
</script>

<form>
  {#each Object.keys(integration) as configKey}
    <Input
      type={integration[configKey].type}
      label={configKey}
      bind:value={integration[configKey]} />
    <Spacer large />
  {/each}
</form>
