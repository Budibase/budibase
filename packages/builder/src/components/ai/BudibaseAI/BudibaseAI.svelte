<script>
  import { Select, Icon, Layout } from "@budibase/bbui"
  import GenerateSQL from "./GenerateSQL.svelte"
  import GenerateTableSchema from "./GenerateTableSchema.svelte"
  import GenerateScreen from "./GenerateScreen.svelte"
  import GenerateCode from "./GenerateCode.svelte"
  import SummarizeText from "./SummarizeText.svelte"
  import store from "./aiStore"
  import { Actions, Models } from "./constants"
</script>

<Layout>
  <Icon name="MagicWand"/>
  <Select label="Model" options={Object.keys(Models)} bind:value={$store.model} />
  <Select label="Action" options={Object.keys(Actions)} bind:value={$store.action} />
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
