<script>
  import BlockComponent from "components/BlockComponent.svelte"
  import Block from "components/Block.svelte"
  import Placeholder from "components/app/Placeholder.svelte"
  import { getContext } from "svelte"
  import { makePropSafe as safe } from "@budibase/string-templates"
  import { get } from "svelte/store"

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
  export let autoRefresh

  const component = getContext("component")
  const context = getContext("context")
  const { generateGoldenSample } = getContext("sdk")

  let providerId

  // Provide additional data context for live binding eval
  export const getAdditionalDataContext = () => {
    const rows = get(context)[providerId]?.rows || []
    const goldenRow = generateGoldenSample(rows)
    const id = get(component).id
    return {
      [`${id}-repeater`]: goldenRow,
    }
  }
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
      autoRefresh,
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
