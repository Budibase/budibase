<script lang="ts">
  import { tick } from "svelte"
  import {
    ActionMenu,
    MenuItem,
    Icon,
    ActionButton,
    Divider,
    Button,
  } from "@budibase/bbui"
  import { queries, datasources } from "@/stores/builder"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import {
    restTemplates,
    featuredTemplates,
  } from "@/stores/builder/restTemplates"
  import QueryVerbBadge from "@/components/common/QueryVerbBadge.svelte"
  import {
    customQueryIconColor,
    customQueryIconText,
  } from "@/helpers/data/utils"
  import type { Query, Datasource } from "@budibase/types"

  interface Props {
    value?: string
    disabled?: boolean
    fullWidthDropdown?: boolean
    onchange?: (_: Query) => void
    onaddApi?: () => void
  }

  let {
    value = undefined,
    disabled = false,
    fullWidthDropdown = false,
    onchange,
    onaddApi,
  }: Props = $props()

  let menuRef: ActionMenu | undefined = $state()
  let searchInput: HTMLInputElement | undefined = $state()
  let searchQuery = $state("")

  const restDatasources = $derived(
    ($datasources.list || [])
      .filter((ds): ds is Datasource => ds.source === "REST")
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
  )

  const allQueries = $derived($queries.list || [])

  const selectedQuery = $derived(
    ($queries.list || []).find((q: Query) => q._id === value)
  )
  const selectedDatasource = $derived(
    selectedQuery
      ? restDatasources.find(
          (ds: Datasource) => ds._id === selectedQuery?.datasourceId
        )
      : undefined
  )

  const selectedIcon = $derived(
    selectedDatasource
      ? $workspaceConnections.list.find(
          c => c.sourceId === selectedDatasource?._id
        )?.icon
      : undefined
  )

  const grouped = $derived(
    restDatasources
      .map((ds: Datasource) => ({
        datasource: ds,
        icon: $workspaceConnections.list.find(c => c.sourceId === ds._id)?.icon,
        queries: allQueries.filter((q: Query) => q.datasourceId === ds._id),
      }))
      .filter(group => group.queries.length > 0)
      .sort((a, b) => {
        const aSelected = a.datasource._id === selectedQuery?.datasourceId
        const bSelected = b.datasource._id === selectedQuery?.datasourceId
        if (aSelected) return -1
        if (bSelected) return 1
        return 0
      })
  )

  const filtered = $derived(
    searchQuery
      ? grouped
          .map(group => ({
            ...group,
            queries: (group.datasource.name || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
              ? group.queries
              : group.queries.filter((q: Query) =>
                  q.name.toLowerCase().includes(searchQuery.toLowerCase())
                ),
          }))
          .filter(group => group.queries.length > 0)
      : grouped
  )

  const buttonLabel = $derived(
    selectedQuery && selectedDatasource
      ? `${selectedDatasource.name} - ${selectedQuery.name}`
      : "Select a request"
  )

  const featuredIcons = $derived(
    featuredTemplates
      .map(id => restTemplates.flatTemplates.find(t => t.id === id))
      .filter(t => t?.icon != null)
      .map(t => t!.icon as string)
  )

  const focusSearch = async () => {
    await tick()
    searchInput?.focus()
  }

  const selectQuery = (query: Query) => {
    onchange?.(query)
    searchQuery = ""
    menuRef?.hide()
  }
</script>

<ActionMenu
  bind:this={menuRef}
  on:open={focusSearch}
  align="right"
  roundedPopover
  widthMode={fullWidthDropdown ? "fixed-to-anchor" : "no-anchor"}
  {disabled}
>
  <svelte:fragment slot="control" let:open>
    <div
      class="picker-button"
      class:has-value={!!selectedQuery}
      class:open
      class:disabled
    >
      <ActionButton quiet>
        <div class="selected-option" title={buttonLabel} class:faded={open}>
          <span class="selected-option-left">
            {#if selectedQuery}
              <QueryVerbBadge
                verb={customQueryIconText(selectedQuery.queryVerb)}
                color={customQueryIconColor(selectedQuery.queryVerb)}
              />
              {#if selectedIcon?.type === "asset"}
                <img src={selectedIcon.value} alt="" height={14} width={14} />
              {:else if selectedIcon?.type === "icon"}
                <Icon name={selectedIcon.value} size="S" />
              {/if}
            {:else}
              <Icon name="code" size="S" />
            {/if}
            <span>{buttonLabel}</span>
          </span>
          <span class="selected-option-right">
            {#if !disabled}
              <Icon name={open ? "ChevronUp" : "ChevronDown"} size="S" />
            {/if}
          </span>
        </div>
      </ActionButton>
    </div>
  </svelte:fragment>

  <div class="query-menu">
    <div class="query-menu-header">
      <input
        bind:this={searchInput}
        class="query-filter"
        type="text"
        placeholder="Search requests..."
        bind:value={searchQuery}
        aria-label="Search requests"
      />
    </div>

    <div
      class="query-menu-content"
      style={fullWidthDropdown ? "width: 100%" : undefined}
    >
      <div class="query-fixed-top">
        <Button
          secondary
          on:click={() => {
            menuRef?.hide()
            onaddApi?.()
          }}
        >
          <div class="add-api-btn-content">
            <Icon name="plus" size="S" />
            <span>Add new API</span>
            <div class="featured-icons">
              {#each featuredIcons as icon, i}
                <img
                  src={icon}
                  alt=""
                  height={16}
                  width={16}
                  style="z-index:{i}; margin-left:{i === 0 ? 0 : -2}px"
                />
              {/each}
            </div>
          </div>
        </Button>
      </div>
      <div class="query-scrollable">
        {#if filtered.length === 0}
          <div class="query-empty">
            {searchQuery
              ? "No requests match your search."
              : "No REST requests available."}
          </div>
        {:else}
          {#each filtered as group, i (group.datasource._id)}
            <div class="query-group">
              <div class="query-group-header">
                {#if group.icon?.type === "asset"}
                  <img
                    src={group.icon.value}
                    alt={group.datasource.name}
                    height={14}
                    width={14}
                  />
                {:else if group.icon?.type === "icon"}
                  <Icon name={group.icon.value} size="XS" />
                {:else}
                  <Icon name="globe-simple" size="XS" />
                {/if}
                <span>{group.datasource.name}</span>
              </div>

              {#each group.queries as query (query._id)}
                {@const isSelected = query._id === value}
                <MenuItem on:click={() => selectQuery(query)}>
                  <div class="query-item">
                    <QueryVerbBadge
                      verb={customQueryIconText(query.queryVerb)}
                      color={customQueryIconColor(query.queryVerb)}
                    />
                    <span class="query-item-label">{query.name}</span>
                    {#if isSelected}
                      <div class="query-item-check">
                        <Icon name="check" size="S" />
                      </div>
                    {/if}
                  </div>
                </MenuItem>
              {/each}
              {#if i < filtered.length - 1}<Divider />{/if}
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>
</ActionMenu>

<style>
  .query-menu-header {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-s) var(--spacing-m);
  }

  .query-filter {
    flex: 1 1 auto;
    border: none;
    outline: none;
    background: transparent;
    color: var(--spectrum-global-color-gray-900);
  }

  .query-menu-content {
    max-height: 400px;
    width: 300px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .query-fixed-top {
    flex-shrink: 0;
    padding: var(--spacing-s) var(--spacing-m);
  }

  .query-fixed-top :global(.spectrum-Button) {
    width: 100%;
  }

  .query-fixed-top :global(.spectrum-Button-label) {
    width: 100%;
    display: flex;
    font-size: var(--font-size-s);
  }

  .add-api-btn-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    width: 100%;
  }

  .add-api-btn-content :global(.featured-icons) {
    margin-left: auto;
  }

  .featured-icons {
    display: flex;
    align-items: center;
    margin-left: auto;
  }

  .featured-icons img {
    /* border-radius: 50%; */
    /* border: 1.5px solid var(--spectrum-alias-background-color-default); */
    position: relative;
  }

  .query-scrollable {
    overflow-y: auto;
    flex: 1 1 auto;
    min-height: 0;
  }

  .query-empty {
    padding: var(--spacing-l);
    text-align: center;
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-600);
  }

  .query-group {
    display: flex;
    flex-direction: column;
  }

  .query-group-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: var(--spacing-s) var(--spacing-m);
    font-size: var(--font-size-s);
    font-weight: 500;
    color: var(--spectrum-global-color-gray-700);
  }

  .query-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .query-item-label {
    font-size: var(--font-size-s);
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .query-item-check {
    margin-left: auto;
    display: flex;
    align-items: center;
  }

  .picker-button {
    border-radius: 6px;
    border: 1px solid var(--spectrum-alias-border-color);
    height: 40px;
    box-sizing: border-box;
    transition:
      background 130ms ease-out,
      border-color 130ms ease-out;
    background: var(--spectrum-alias-background-color-default);
  }

  .picker-button:not(.disabled):hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }

  .picker-button:focus-within {
    border-color: var(--spectrum-alias-border-color-focus);
  }

  .picker-button.disabled :global(*) {
    cursor: default;
  }

  .picker-button :global(.spectrum-ActionButton) {
    border: none !important;
    background: transparent !important;
    border-radius: 6px;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
  }

  .picker-button :global(.spectrum-ActionButton-label) {
    width: 100%;
  }

  .selected-option {
    transition: opacity 130ms ease-out;
    width: 100%;
    justify-content: space-between;
  }

  .selected-option-left,
  .selected-option-right,
  .selected-option {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
  }

  .selected-option-left {
    overflow: hidden;
    min-width: 0;
    flex: 1;
  }

  .selected-option-left :global(span) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .selected-option.faded {
    opacity: 0.6;
  }
</style>
