<script>
  import { datasources } from "@/stores/builder"
  import { Divider, Heading, Icon } from "@budibase/bbui"
  import QueryVerbBadge from "@/components/common/QueryVerbBadge.svelte"
  import {
    customQueryIconColor,
    customQueryIconText,
  } from "@/helpers/data/utils"
  import { IntegrationTypes } from "@/constants/backend"

  export let dividerState
  export let heading
  export let dataSet
  export let value
  export let onSelect
  export let identifiers = ["resourceId"]

  $: displayDatasourceName = $datasources.list.length > 1

  function isSelected(entry) {
    if (!identifiers.length) {
      return false
    }
    for (const identifier of identifiers) {
      if (entry[identifier] !== value?.[identifier]) {
        return false
      }
    }
    return true
  }

  const isRestQuery = entry => {
    if (entry?.type !== "query") {
      return false
    }
    const datasource = $datasources.list.find(
      ds => ds._id === entry.datasourceId
    )
    return datasource?.source === IntegrationTypes.REST
  }

  const shouldInclude = entry => {
    if (entry?.type !== "query") {
      return true
    }
    if (!isRestQuery(entry)) {
      return true
    }
    return entry.queryVerb === "create" || entry.queryVerb === "read"
  }

  $: filteredDataSet = dataSet?.filter(shouldInclude) ?? []
</script>

{#if dividerState}
  <Divider />
{/if}
{#if heading}
  <div class="title">
    <Heading size="XS">{heading}</Heading>
  </div>
{/if}
<!-- svelte-ignore a11y-click-events-have-key-events -->
<ul class="spectrum-Menu" role="listbox">
  {#each filteredDataSet as data}
    <li
      class="spectrum-Menu-item"
      class:is-selected={isSelected(data) && value?.type === data.type}
      role="option"
      aria-selected="true"
      tabindex="0"
      on:click={() => onSelect(data)}
    >
      <span class="spectrum-Menu-itemLabel">
        {#if data?.type === "query"}
          <span class="query-icon">
            {#if isRestQuery(data)}
              <QueryVerbBadge
                verb={customQueryIconText(data)}
                color={customQueryIconColor(data)}
              />
            {:else}
              <Icon
                name="database"
                size="S"
                color="var(--spectrum-global-color-gray-600)"
              />
            {/if}
          </span>
        {/if}
        <span class="label-text">
          {data.datasourceName && displayDatasourceName
            ? `${data.datasourceName} - `
            : ""}{data.label}
        </span>
      </span>
      <div class="check">
        <Icon name="check" />
      </div>
    </li>
  {/each}
</ul>

<style>
  .title {
    padding: 0 var(--spacing-m) var(--spacing-s) var(--spacing-m);
  }
  ul {
    list-style: none;
    padding-left: 0;
    margin: 0;
    width: 100%;
  }
  .spectrum-Menu-itemLabel {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .query-icon {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    min-width: 42px;
  }
  .label-text {
    flex: 1;
  }
  .check {
    display: none;
  }
  .is-selected .check {
    display: block;
  }
</style>
