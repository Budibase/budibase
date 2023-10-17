<script>
  import BlockComponent from "components/BlockComponent.svelte"
  import Block from "components/Block.svelte"
  import Placeholder from "components/app/Placeholder.svelte"
  import { getContext } from "svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"

  export let dataSource
  export let filter
  export let sortColumn
  export let sortOrder
  export let limit
  export let paginate
  export let noRowsMessage
  export let direction
  export let hAlign
  export let vAlign
  export let gap

  const component = getContext("component")

  let providerId
</script>

<Block>
  <BlockComponent
    type="dataprovider"
    context="provider"
    bind:id={providerId}
    props={{
      dataSource,
      filter,
      sortColumn,
      sortOrder,
      limit,
      paginate,
    }}
  >
    {#if $component.empty}
      <Placeholder />
    {:else}
      <BlockComponent
        type="repeater"
        context="repeater"
        containsSlot
        props={{
          dataProvider: `{{ literal ${safe(providerId)} }}`,
          noRowsMessage,
          direction,
          hAlign,
          vAlign,
          gap,
        }}
      >
        <slot />
      </BlockComponent>
    {/if}
  </BlockComponent>
</Block>
