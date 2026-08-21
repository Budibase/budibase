<script lang="ts">
  import { Icon, Search, Layout } from "@budibase/bbui"
  import type { Component } from "svelte"
  import { createEventDispatcher } from "svelte"

  interface PickerItem {
    _id?: string
    email?: string
    name?: string
    icon?: string
    color?: string
  }

  interface EnrichedPickerItem extends PickerItem {
    selected: boolean
  }

  interface Props {
    searchTerm?: string
    selected?: string[]
    list?: PickerItem[]
    labelKey: "email" | "name"
    iconComponent?: Component | null
    extractIconProps?: (item: EnrichedPickerItem) => Record<string, unknown>
  }

  let {
    searchTerm = $bindable(""),
    selected,
    list = [],
    labelKey,
    iconComponent = null,
    extractIconProps = () => ({}),
  }: Props = $props()

  const dispatch = createEventDispatcher<{
    select: string
    deselect: string
  }>()

  const getLabel = (item: PickerItem | EnrichedPickerItem): string => {
    return item[labelKey] || ""
  }

  const enrich = (
    list: PickerItem[],
    selected: string[] | undefined
  ): EnrichedPickerItem[] => {
    return list.map(item => {
      return {
        ...item,
        selected: item._id ? (selected?.includes(item._id) ?? false) : false,
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

  const enrichedList = $derived(enrich(list, selected))
  const filteredList = $derived(filter(enrichedList, searchTerm))
  const sortedList = $derived(sort(filteredList))
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
            if (item._id) {
              dispatch(item.selected ? "deselect" : "select", item._id)
            }
          }}
          class="item"
        >
          {#if iconComponent}
            {@const IconComponent = iconComponent}
            <IconComponent {...extractIconProps(item)} />
          {/if}
          <div class="text">
            {getLabel(item)}
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
