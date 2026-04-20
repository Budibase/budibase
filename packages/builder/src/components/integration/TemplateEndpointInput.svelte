<script lang="ts">
  import { createEventDispatcher, tick } from "svelte"
  import { Icon, Select, ActionMenu, MenuItem } from "@budibase/bbui"
  import type { RestTemplate, ImportEndpoint } from "@budibase/types"

  type EndpointWithIcon = ImportEndpoint & {
    icon?: {
      component: any
      props: { verb?: string; color?: string }
    }
  }

  export let templates: RestTemplate[] = []
  export let endpointOptions: EndpointWithIcon[] = []
  export let selectedEndpoint: EndpointWithIcon | undefined = undefined
  export let endpointsLoading: boolean = false
  export let disabled: boolean = false
  export let readonly: boolean = false
  export let selectedChildId: string | undefined = undefined

  const dispatch = createEventDispatcher<{
    endpointChange: EndpointWithIcon | undefined
    childChange: string
  }>()

  $: showChildPicker = templates.length > 1
  $: selectedChild = templates.find(t => t.id === selectedChildId)
  $: childLabel = selectedChild?.name ?? "Select API..."

  let menuRef: ActionMenu | undefined
  let searchInput: HTMLInputElement | undefined
  let search = ""

  $: filtered = search
    ? templates.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    : templates

  const selectChild = (id: string) => {
    selectedChildId = id
    dispatch("childChange", id)
    menuRef?.hide()
    search = ""
  }

  const focusSearch = async () => {
    search = ""
    await tick()
    searchInput?.focus()
  }

  const compareEndpoints = (option: any, value: any) => option.id === value?.id
</script>

<div class="input-wrap" class:is-disabled={disabled}>
  {#if showChildPicker}
    <ActionMenu
      bind:this={menuRef}
      on:open={focusSearch}
      align="left"
      roundedPopover
      disabled={disabled || readonly}
    >
      <svelte:fragment slot="control" let:open>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="child-trigger" class:open class:is-readonly={readonly}>
          <span class="child-label" class:placeholder={!selectedChild}>
            <span class="child-label-text">{childLabel}</span>
          </span>
          {#if !readonly}<Icon
              name={open ? "ChevronUp" : "ChevronDown"}
              size="S"
            />{/if}
        </div>
      </svelte:fragment>

      <div class="api-menu">
        <div class="api-menu-header">
          <input
            bind:this={searchInput}
            class="api-filter"
            type="text"
            placeholder="Search APIs..."
            bind:value={search}
            aria-label="Search APIs"
          />
        </div>
        <div class="api-menu-content">
          {#if filtered.length === 0}
            <div class="api-empty">No APIs match your search.</div>
          {:else}
            <div class="api-section">
              {#each filtered as template (template.id)}
                <MenuItem on:click={() => selectChild(template.id)}>
                  <div class="api-item">
                    <span class="api-item-label">{template.name}</span>
                    {#if template.id === selectedChildId}
                      <div class="api-item-check">
                        <Icon name="check" size="S" />
                      </div>
                    {/if}
                  </div>
                </MenuItem>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </ActionMenu>
    <div class="divider"></div>
  {/if}

  <div class="endpoint-select">
    <Select
      on:change={e => dispatch("endpointChange", e.detail)}
      value={selectedEndpoint}
      options={endpointOptions}
      getOptionValue={endpoint => endpoint}
      getOptionLabel={endpoint => endpoint.name}
      compare={compareEndpoints}
      disabled={endpointsLoading ||
        disabled ||
        (showChildPicker && !selectedChildId)}
      {readonly}
      loading={endpointsLoading}
      autocomplete={true}
    />
  </div>
</div>

<style>
  .input-wrap {
    display: flex;
    align-items: center;
    height: 40px;
    border: 1px solid var(--spectrum-alias-border-color);
    border-radius: var(--spectrum-alias-border-radius-regular);
    background: var(--spectrum-alias-background-color-default);
    box-sizing: border-box;
    flex: 1;
    min-width: 0;
    position: relative;
    transition: border-color 130ms ease-out;
  }

  .input-wrap:focus-within {
    border-color: var(--spectrum-alias-border-color-focus);
  }

  .input-wrap.is-disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  .child-trigger {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    padding: 0 var(--spacing-s) 0 var(--spacing-m);
    height: calc(40px - 2px);
    margin: 1px 0;
    cursor: pointer;
    flex-shrink: 0;
    user-select: none;
    color: var(--spectrum-alias-text-color);
    transition: background 130ms ease-out;
  }

  .child-trigger:not(.is-readonly):hover {
    background: var(--spectrum-global-color-gray-200);
    border-radius: var(--spectrum-alias-border-radius-regular) 0 0
      var(--spectrum-alias-border-radius-regular);
  }

  .child-trigger.is-readonly {
    cursor: default;
    padding-right: var(--spacing-m);
  }

  .child-label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    margin-top: 1px;
    font-size: var(--spectrum-global-dimension-font-size-50);
    font-weight: 600;
    letter-spacing: 0.04em;
    white-space: nowrap;
    max-width: 160px;
    background-color: var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    min-width: 0;
  }

  .child-label-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .child-label.placeholder {
    background-color: transparent;
    color: var(--spectrum-alias-text-color-disabled);
    font-weight: 400;
    font-size: var(--spectrum-alias-font-size-default);
    letter-spacing: 0;
  }

  .divider {
    width: 1px;
    height: 60%;
    background: var(--spectrum-alias-border-color);
    flex-shrink: 0;
  }

  .endpoint-select {
    flex: 1;
    min-width: 0;
    height: 100%;
  }

  .endpoint-select :global(.spectrum-Picker) {
    border: none;
    background: transparent;
    box-shadow: none;
    height: 100%;
    border-radius: 0 var(--spectrum-alias-border-radius-regular)
      var(--spectrum-alias-border-radius-regular) 0;
  }

  .endpoint-select :global(.spectrum-Picker:focus) {
    box-shadow: none;
  }

  /* ActionMenu host — strip its wrapper so the trigger sits flush */
  .input-wrap :global(.spectrum-ActionButton) {
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
    height: 40px !important;
    min-width: 0 !important;
  }

  .api-menu-header {
    display: flex;
    padding: var(--spectrum-listitem-padding-y)
      var(--spectrum-listitem-padding-right) var(--spectrum-listitem-padding-y)
      var(--spectrum-listitem-padding-left);
  }

  .api-filter {
    flex: 1 1 auto;
    border: none;
    outline: none;
    background: transparent;
    color: var(--spectrum-global-color-gray-900);
  }

  .api-filter::placeholder {
    color: var(--spectrum-alias-text-color-disabled);
  }

  .api-menu-content {
    max-height: 400px;
    width: 260px;
    overflow-y: auto;
  }

  .api-section {
    display: flex;
    flex-direction: column;
  }

  .api-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .api-item-label {
    font-size: var(--font-size-s);
    flex: 1;
  }

  .api-item-check {
    margin-left: auto;
    display: flex;
    align-items: center;
  }

  .api-empty {
    padding: var(--spacing-l);
    text-align: center;
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-600);
  }
</style>
