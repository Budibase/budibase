<script>
  import BlockComponent from "components/BlockComponent.svelte"
  import Block from "components/Block.svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"
  import { getContext } from "svelte"

  export let actionType
  export let dataSource
  export let rowId
  export let noRowsMessage

  const component = getContext("component")
  const { ContextScopes } = getContext("sdk")

  $: providerId = `${$component.id}-provider`
  $: dataProvider = `{{ literal ${safe(providerId)} }}`
  $: filter = [
    {
      field: "_id",
      operator: "equal",
      type: "string",
      value: !rowId ? `{{ ${safe("url")}.${safe("id")} }}` : rowId,
      valueType: "Binding",
    },
  ]
</script>

<Block>
  {#if actionType === "Create"}
    <BlockComponent
      type="container"
      props={{
        direction: "column",
        hAlign: "left",
        vAlign: "stretch",
      }}
    >
      <slot />
    </BlockComponent>
  {:else}
    <BlockComponent
      type="dataprovider"
      context="provider"
      props={{
        dataSource,
        filter,
        limit: 1,
        paginate: false,
      }}
    >
      <BlockComponent
        type="repeater"
        context="repeater"
        props={{
          dataProvider,
          noRowsMessage: noRowsMessage || "We couldn't find a row to display",
          direction: "column",
          hAlign: "center",
          scope: ContextScopes.Global,
        }}
      >
        <slot />
      </BlockComponent>
    </BlockComponent>
  {/if}
</Block>
