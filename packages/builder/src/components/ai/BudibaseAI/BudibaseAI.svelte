<script>
  import { Select, Icon, Layout } from "@budibase/bbui"
  import GenerateSQL from "./GenerateSQL.svelte"
  import GenerateTableSchema from "./GenerateTableSchema.svelte"
  import GenerateScreen from "./GenerateScreen.svelte"
  import GenerateCode from "./GenerateCode.svelte"
  import SummarizeText from "./SummarizeText.svelte"
  import store from "./aiStore"
  import { ActionsList, Models } from "./constants"

  const Actions = {
    SUMMARIZE_TEXT: "SUMMARIZE_TEXT",
    GENERATE_SQL: "GENERATE_SQL",
    GENERATE_CODE: "GENERATE_CODE",
    GENERATE_TABLE_SCHEMA: "GENERATE_TABLE_SCHEMA",
    GENERATE_SCREEN: "GENERATE_SCREEN",
  }

</script>

<Layout>
  <Icon name="MagicWand"/>
  <Select label="Model" options={Models} bind:value={$store.model} />
  <Select label="Action" options={ActionsList} bind:value={$store.action} />
  {#if $store.action === Actions.SUMMARIZE_TEXT}
    <SummarizeText />
  {:else if $store.action === Actions.GENERATE_SQL}
    <GenerateSQL />
  {:else if $store.action === Actions.GENERATE_CODE}
    <GenerateCode />
  {:else if $store.action === Actions.GENERATE_TABLE_SCHEMA}
    <GenerateTableSchema />
  {:else if $store.action === Actions.GENERATE_SCREEN}
    <GenerateScreen />
  {/if}
</Layout>
