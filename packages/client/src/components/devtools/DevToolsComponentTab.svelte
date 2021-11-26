<script>
  import {
    Body,
    Layout,
    Heading,
    Button,
    TextArea,
    Divider,
  } from "@budibase/bbui"
  import { builderStore, devToolsStore, componentStore } from "stores"
  import DevToolsStat from "./DevToolsStat.svelte"

  $: selectedInstance = $componentStore.selectedComponentInstance

  $: {
    if (!selectedInstance) {
      builderStore.actions.selectComponent(null)
    }
  }
</script>

{#if !$builderStore.selectedComponentId}
  <Layout noPadding gap="S">
    <Heading size="XS">Please choose a component</Heading>
    <Body size="S">
      Press the button below to enable component selection, then click a
      component in your app to view what context values are available.
    </Body>
    <div>
      <Button
        cta
        on:click={() => devToolsStore.actions.setAllowSelection(true)}
      >
        Choose component
      </Button>
    </div>
  </Layout>
{:else}
  <Layout noPadding>
    <Layout noPadding gap="XS">
      <DevToolsStat
        label="Component"
        value={$componentStore.selectedComponent?._instanceName}
      />
      <DevToolsStat
        label="Type"
        value={$componentStore.selectedComponentDefinition?.name}
      />
      <DevToolsStat label="ID" value={$componentStore.selectedComponent?._id} />
    </Layout>
    <div>
      <Button
        cta
        on:click={() => devToolsStore.actions.setAllowSelection(true)}
      >
        Change component
      </Button>
    </div>
    <div class="data">
      <Layout noPadding gap="XS">
        <TextArea
          readonly
          label="Data context"
          value={JSON.stringify(selectedInstance?.getDataContext(), null, 2)}
        />
        <TextArea
          readonly
          label="Raw settings"
          value={JSON.stringify(selectedInstance?.getRawSettings(), null, 2)}
        />
        <TextArea
          readonly
          label="Enriched settings"
          value={JSON.stringify(selectedInstance?.getSettings(), null, 2)}
        />
      </Layout>
    </div>
  </Layout>
{/if}

<style>
  .data :global(.spectrum-Textfield-input) {
    min-height: 200px !important;
    white-space: pre;
    font-size: var(--font-size-s);
  }
</style>
