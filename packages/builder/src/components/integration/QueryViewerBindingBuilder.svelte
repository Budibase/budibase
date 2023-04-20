<script>
  import { _ } from "../../../lang/i18n"
  import { Body, Heading, Layout } from "@budibase/bbui"
  import KeyValueBuilder from "components/integration/KeyValueBuilder.svelte"
  import { getUserBindings } from "builderStore/dataBinding"
  export let bindable = true
  export let queryBindings = []

  const userBindings = getUserBindings()

  let internalBindings = queryBindings.reduce((acc, binding) => {
    acc[binding.name] = binding.default
    return acc
  }, {})
</script>

<Layout noPadding={bindable} gap="S">
  <div class="controls" class:height={!bindable}>
    <Heading size="XS"
      >{$_(
        "components.integration.QueryViewerBindingBuilder.Bindings"
      )}</Heading
    >
  </div>
  <Body size="S">
    {#if !bindable}
      {$_("components.integration.QueryViewerBindingBuilder.Bindings_come")}
    {:else}
      {$_("components.integration.QueryViewerBindingBuilder.Enter_value")}
    {/if}
  </Body>
  <div class="bindings" class:bindable>
    <KeyValueBuilder
      bind:object={internalBindings}
      tooltip={$_("components.integration.QueryViewerBindingBuilder.Set_name")}
      name="binding"
      headings
      keyPlaceholder={$_(
        "components.integration.QueryViewerBindingBuilder.Binding_name"
      )}
      valuePlaceholder={$_(
        "components.integration.QueryViewerBindingBuilder.Default"
      )}
      bindings={[...userBindings]}
      bindingDrawerLeft="260px"
      allowHelpers={false}
      on:change
    />
  </div>
</Layout>

<style>
  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .height {
    height: 40px;
  }
</style>
