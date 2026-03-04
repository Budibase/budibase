<script lang="ts">
  import { Icon, Search, Layout } from "@budibase/bbui"
  import type { ComponentType } from "svelte"
  import { createEventDispatcher } from "svelte"

  interface PickerItem {
    _id: string
    [key: string]: unknown
  }

  interface EnrichedPickerItem extends PickerItem {
    selected: boolean
  }

  export let searchTerm = ""
  export let selected: string[] | undefined = undefined
  export let list: PickerItem[] = []
  export let labelKey: string
  export let iconComponent: ComponentType | null = null
  export let extractIconProps: (
    _item: EnrichedPickerItem
  ) => Record<string, unknown> = item => item

  const dispatch = createEventDispatcher<{
    select: string
    deselect: string
  }>()

  $: enrichedList = enrich(list, selected)
  $: filteredList = filter(enrichedList, searchTerm)
  $: sortedList = sort(filteredList)

  const getLabel = (item: PickerItem | EnrichedPickerItem): string => {
    return String(item[labelKey] ?? "")
  }

  const enrich = (
    list: PickerItem[],
    selected: string[] | undefined
  ): EnrichedPickerItem[] => {
    return list.map(item => {
      return {
        ...item,
        selected: selected?.includes(item._id) ?? false,
      }
    })
  }

  const sort = (list: EnrichedPickerItem[]): EnrichedPickerItem[] => {
    let sortedList = list.slice()
    sortedList.sort((a, b) => {
      if (a.selected === b.selected) {
        const aLabel = getLabel(a)
        const bLabel = getLabel(b)
        if (aLabel === bLabel) {
          return 0
        }
        return aLabel < bLabel ? -1 : 1
      } else if (a.selected) {
        return -1
      } else if (b.selected) {
        return 1
      }
      return 0
    })
    return sortedList
  }

  const filter = (
    list: EnrichedPickerItem[],
    searchTerm: string
  ): EnrichedPickerItem[] => {
    const search = searchTerm.toLowerCase().trim()
    if (!search) {
      return list
    }
    return list.filter(item => getLabel(item).toLowerCase().includes(search))
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="container">
  <Layout gap="S">
    <div class="header">
      <Search placeholder="Search" bind:value={searchTerm} />
    </div>
    <div class="items">
      {#each sortedList as item}
        <div
          on:click={() => {
            dispatch(item.selected ? "deselect" : "select", item._id)
          }}
          class="item"
        >
          {#if iconComponent}
            <svelte:component
              this={iconComponent}
              {...extractIconProps(item)}
            />
          {/if}
          <div class="text">
            {item[labelKey]}
          </div>
          {#if item.selected}
            <div>
              <Icon
                color="var(--spectrum-global-color-blue-600);"
                name="check"
              />
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </Layout>
</div>

<style>
  .container {
    width: 280px;
  }
  .header {
    align-items: center;
    display: grid;
    gap: var(--spacing-m);
    grid-template-columns: 1fr;
  }
  .items {
    max-height: 242px;
    overflow: auto;
    overflow-x: hidden;
    margin: 0 calc(-1 * var(--spacing-m));
    margin-top: -8px;
  }
  .item {
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    padding: var(--spacing-s) var(--spacing-l);
    background: var(--spectrum-global-color-gray-50);
    transition: background 130ms ease-out;
    gap: var(--spacing-m);
    align-items: center;
  }
  .item:hover {
    background: var(--spectrum-global-color-gray-100);
    cursor: pointer;
  }
  .text {
    flex: 1 1 auto;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
