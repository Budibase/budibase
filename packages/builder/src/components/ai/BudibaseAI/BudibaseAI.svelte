<script>
  import { Button, Select, Icon, Layout, Heading, Body, Modal, ModalContent } from "@budibase/bbui"
  import GenerateSQL from "./GenerateSQL.svelte"
  import GenerateTableSchema from "./GenerateTableSchema.svelte"
  import SummarizeText from "./SummarizeText.svelte"
  import { Actions, Models } from "./constants"

  let action
  let model
</script>

<Layout>
  <Icon name="MagicWand"/>
  <Select label="Action" options={Object.keys(Actions)} bind:value={action} />
  <Select label="Model" options={Object.keys(Models)} bind:value={model} />
  {#if action === Actions.SUMMARIZE_TEXT}
    <SummarizeText />
  {:else if action === Actions.GENERATE_SQL}
    <GenerateSQL />
  {:else if action === Actions.GENERATE_TABLE_SCHEMA}
    <GenerateTableSchema />
  {/if}
</Layout>
