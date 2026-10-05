<svelte:options runes={true} />

<script lang="ts">
  import { getErrorMessage } from "@/helpers/errors"
  import {
    ActionButton,
    ActionMenu,
    Body,
    Button,
    Helpers,
    Icon,
    Input,
    MenuItem,
    notifications,
    ProgressCircle,
  } from "@budibase/bbui"
  import type {
    FunctionQueryCapability,
    FunctionQueryCapabilityInput,
    FunctionQueryCatalogEntry,
    FunctionQueryKind,
  } from "@budibase/types"
  import {
    hasFunctionQueryAliasErrors,
    toFunctionQueryAlias,
    validateFunctionQueryAliases,
  } from "./queryAliases"

  export interface Props {
    capabilities?: FunctionQueryCapability[]
    catalog?: FunctionQueryCatalogEntry[]
    catalogLoading?: boolean
    catalogError?: string
    onRetry?: () => void
    onSave?: (_capabilities: FunctionQueryCapabilityInput[]) => Promise<void>
    onDirtyChange?: (_dirty: boolean) => void
  }

  let {
    capabilities = [],
    catalog = [],
    catalogLoading = false,
    catalogError = "",
    onRetry = () => {},
    onSave = async () => {},
    onDirtyChange = () => {},
  }: Props = $props()

  let drafts = $state<FunctionQueryCapabilityInput[]>([])
  let syncedCapabilities = $state("")
  let saving = $state(false)
  let saveError = $state("")
  let showErrors = $state(false)
  let querySearch = $state("")
  let expandedQueryId = $state<string | undefined>()
  const queryKinds: FunctionQueryKind[] = ["data", "api"]

  const toInputs = (
    values: FunctionQueryCapability[]
  ): FunctionQueryCapabilityInput[] =>
    values.map(capability => ({
      queryId: capability.queryId,
      datasourceAlias: capability.datasourceAlias,
      queryAlias: capability.queryAlias,
    }))

  const haveSameParameterNames = (
    left: readonly string[],
    right: readonly string[]
  ) =>
    left.length === right.length &&
    left.every((name, index) => name === right[index])

  $effect(() => {
    const serialised = JSON.stringify(toInputs(capabilities))
    if (serialised !== syncedCapabilities) {
      drafts = toInputs(capabilities)
      syncedCapabilities = serialised
      showErrors = false
      saveError = ""
    }
  })

  let catalogByQueryId = $derived(
    new Map(catalog.map(entry => [entry.queryId, entry]))
  )
  let errors = $derived(
    validateFunctionQueryAliases({
      capabilities: drafts,
      catalog,
      catalogLoaded: !catalogLoading && !catalogError,
    })
  )
  let parameterMetadataChanged = $derived.by(() =>
    capabilities.some(capability => {
      const entry = catalogByQueryId.get(capability.queryId)
      return (
        !!entry &&
        !haveSameParameterNames(
          capability.parameterNames,
          entry.parameters.map(parameter => parameter.name)
        )
      )
    })
  )
  let dirty = $derived(
    JSON.stringify(drafts) !== syncedCapabilities || parameterMetadataChanged
  )

  $effect(() => {
    onDirtyChange(dirty)
  })

  const getAvailableQueries = (kind: FunctionQueryKind) =>
    catalog.filter(
      entry =>
        entry.kind === kind &&
        !drafts.some(capability => capability.queryId === entry.queryId) &&
        `${entry.queryName} ${entry.datasourceName}`
          .toLowerCase()
          .includes(querySearch.toLowerCase())
    )
  const getCodeReference = (capability: FunctionQueryCapabilityInput) =>
    `await queries.${capability.datasourceAlias || "datasource"}.${capability.queryAlias || "query"}()`

  const copyCodeReference = async (
    capability: FunctionQueryCapabilityInput
  ) => {
    try {
      await Helpers.copyToClipboard(getCodeReference(capability))
      notifications.success("Query call copied to clipboard")
    } catch (error) {
      notifications.error(getErrorMessage(error) || "Unable to copy query call")
    }
  }

  const getOptionSubtitle = (entry: FunctionQueryCatalogEntry) => {
    if (!entry.parameters.length) {
      return `${entry.datasourceName} · No parameters`
    }
    const suffix = entry.parameters.length === 1 ? "" : "s"
    return `${entry.datasourceName} · ${entry.parameters.length} parameter${suffix}`
  }

  const getUnavailableQueryTitle = () => {
    if (catalogLoading) {
      return "Loading query details"
    }
    if (catalogError) {
      return "Query details unavailable"
    }
    return "Missing query"
  }

  const getUnavailableQueryDescription = (
    capability: FunctionQueryCapabilityInput,
    missing: boolean
  ) => {
    if (missing) {
      return `The saved query ${capability.queryId} was deleted or is unavailable.`
    }
    return "Stored aliases are shown below."
  }

  const uniqueAlias = (
    preferred: string,
    isUsed: (_alias: string) => boolean
  ) => {
    let alias = preferred
    let suffix = 2
    while (isUsed(alias)) {
      alias = `${preferred}${suffix}`
      suffix += 1
    }
    return alias
  }

  const addQuery = (queryId?: string) => {
    if (!queryId || drafts.some(capability => capability.queryId === queryId)) {
      return
    }
    const entry = catalogByQueryId.get(queryId)
    if (!entry) {
      return
    }

    const existingDatasourceCapability = drafts.find(capability => {
      const linkedEntry = catalogByQueryId.get(capability.queryId)
      return linkedEntry?.datasourceId === entry.datasourceId
    })
    const preferredDatasourceAlias =
      existingDatasourceCapability?.datasourceAlias ||
      toFunctionQueryAlias(entry.datasourceName, "datasource")
    const datasourceAlias = existingDatasourceCapability
      ? preferredDatasourceAlias
      : uniqueAlias(preferredDatasourceAlias, alias =>
          drafts.some(capability => capability.datasourceAlias === alias)
        )
    const preferredQueryAlias = toFunctionQueryAlias(entry.queryName, "query")
    const queryAlias = uniqueAlias(preferredQueryAlias, alias =>
      drafts.some(
        capability =>
          capability.datasourceAlias === datasourceAlias &&
          capability.queryAlias === alias
      )
    )

    drafts = [
      ...drafts,
      {
        queryId,
        datasourceAlias,
        queryAlias,
      },
    ]
    expandedQueryId = queryId
    saveError = ""
  }

  const removeQuery = (queryId: string) => {
    drafts = drafts.filter(capability => capability.queryId !== queryId)
    saveError = ""
  }

  const parametersChanged = (
    capability: FunctionQueryCapabilityInput,
    entry: FunctionQueryCatalogEntry
  ) => {
    const persisted = capabilities.find(
      candidate => candidate.queryId === capability.queryId
    )
    if (!persisted) {
      return false
    }
    return !haveSameParameterNames(
      persisted.parameterNames,
      entry.parameters.map(parameter => parameter.name)
    )
  }

  const save = async () => {
    showErrors = true
    saveError = ""
    if (hasFunctionQueryAliasErrors(errors) || saving) {
      return
    }
    saving = true
    try {
      await onSave(drafts)
    } catch (error) {
      saveError = getErrorMessage(error) || "Unable to save linked queries"
    } finally {
      saving = false
    }
  }
</script>

<section class="query-editor">
  <div class="rail-heading">
    <Body size="S" weight="500">Linked queries</Body>
    <div class="query-actions">
      <Button primary size="S" disabled={saving || !dirty} on:click={save}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  </div>

  {#if catalogLoading}
    <div class="catalog-state" data-testid="query-catalog-loading">
      <ProgressCircle size="S" />
      <Body size="S">Loading saved queries...</Body>
    </div>
  {:else if catalogError}
    <div class="catalog-state error" data-testid="query-catalog-error">
      <Icon name="warning-circle" size="S" />
      <Body size="S">{catalogError}</Body>
      <Button secondary size="S" on:click={onRetry}>Retry</Button>
    </div>
  {/if}

  {#if !drafts.length}
    <div class="empty" data-testid="linked-queries-empty">
      No queries linked yet. Add a Data or API Explorer query to use it in code.
    </div>
  {:else}
    <div class="linked-queries">
      {#each drafts as capability, index (capability.queryId)}
        {@const entry = catalogByQueryId.get(capability.queryId)}
        {@const missing = !catalogLoading && !catalogError && !entry}
        <article
          class="linked-query"
          class:missing
          data-testid={`linked-query-${capability.queryId}`}
        >
          <div class="query-row">
            <button
              type="button"
              class="query-row-toggle"
              aria-expanded={expandedQueryId === capability.queryId}
              onclick={() =>
                (expandedQueryId =
                  expandedQueryId === capability.queryId
                    ? undefined
                    : capability.queryId)}
            >
              <Icon
                name={entry?.kind === "api" ? "globe-simple" : "database"}
                size="S"
              />
              <span class="query-row-name">
                <strong>{entry?.queryName || getUnavailableQueryTitle()}</strong
                >
                <small
                  >{entry?.datasourceName ||
                    getUnavailableQueryDescription(capability, missing)}</small
                >
              </span>
              <Icon
                name={expandedQueryId === capability.queryId
                  ? "caret-up"
                  : "caret-down"}
                size="S"
              />
            </button>
            <button
              type="button"
              class="remove-button"
              aria-label={`Remove ${entry?.queryName || (missing ? "missing query" : "query")}`}
              onclick={() => removeQuery(capability.queryId)}
            >
              <Icon name="trash" size="S" />
            </button>
          </div>

          {#if expandedQueryId === capability.queryId}
            <div class="query-details">
              {#if missing}
                <div class="missing-message">
                  <Icon name="warning-circle" size="S" />
                  Remove this link before saving, or restore the saved query.
                </div>
              {/if}
              <Input
                label="Datasource alias"
                bind:value={capability.datasourceAlias}
                error={showErrors ? errors[index]?.datasourceAlias : undefined}
              />
              <Input
                label="Query alias"
                bind:value={capability.queryAlias}
                error={showErrors ? errors[index]?.queryAlias : undefined}
              />
              <div class="code-reference">
                <span>Available in code as</span>
                <div class="code-snippet">
                  <code>{getCodeReference(capability)}</code>
                  <ActionButton
                    icon="copy"
                    size="S"
                    quiet
                    on:click={() => copyCodeReference(capability)}
                  >
                    Copy
                  </ActionButton>
                </div>
              </div>
              {#if entry && parametersChanged(capability, entry)}
                <div class="parameter-change">
                  Query parameters changed. Save and rebuild this Function to
                  update its declarations.
                </div>
              {/if}
            </div>
          {/if}
        </article>
      {/each}
    </div>
  {/if}

  <div class="query-popover-container">
    <ActionMenu
      align="left"
      roundedPopover
      portalTarget=".query-popover-container"
    >
      <div slot="control">
        <Button
          quiet
          secondary
          icon="plus"
          disabled={catalogLoading || !!catalogError}
        >
          Add query
        </Button>
      </div>
      <div class="query-menu">
        <input
          class="query-search"
          type="search"
          aria-label="Search saved queries"
          placeholder="Search"
          bind:value={querySearch}
        />
        {#each queryKinds as kind}
          {@const options = getAvailableQueries(kind)}
          {#if options.length}
            <div class="query-menu-section">
              <div class="query-menu-label">
                {kind === "data" ? "Data queries" : "API Explorer queries"}
              </div>
              {#each options as entry (entry.queryId)}
                <MenuItem on:click={() => addQuery(entry.queryId)}>
                  <div class="query-option">
                    <Icon
                      name={kind === "api" ? "globe-simple" : "database"}
                      size="S"
                    />
                    <span>
                      <strong>{entry.queryName}</strong>
                      <small>{getOptionSubtitle(entry)}</small>
                    </span>
                  </div>
                </MenuItem>
              {/each}
            </div>
          {/if}
        {/each}
        {#if !getAvailableQueries("data").length && !getAvailableQueries("api").length}
          <div class="menu-empty">No queries available</div>
        {/if}
      </div>
    </ActionMenu>
  </div>

  {#if showErrors && errors.some(error => !!error.missingQuery)}
    <div class="save-error" role="alert">
      Remove missing query links before saving, or restore the saved queries.
    </div>
  {:else if showErrors && hasFunctionQueryAliasErrors(errors)}
    <div class="save-error" role="alert">
      Fix the alias errors before saving.
    </div>
  {:else if saveError}
    <div class="save-error" role="alert">{saveError}</div>
  {/if}
</section>

<style>
  .query-editor,
  .linked-queries,
  .query-details {
    display: flex;
    flex-direction: column;
  }
  .query-editor {
    gap: var(--spacing-m);
  }
  .rail-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-m);
  }
  .linked-queries {
    gap: 6px;
  }
  .query-actions,
  .catalog-state,
  .query-row,
  .query-row-toggle,
  .code-snippet {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .query-popover-container {
    width: fit-content;
  }
  .query-menu {
    width: 300px;
    max-height: 400px;
    overflow: auto;
  }
  .query-search {
    width: 100%;
    padding: var(--spacing-s) var(--spacing-m);
    border: 0;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
    outline: none;
    background: transparent;
    color: inherit;
  }
  .query-menu-label {
    padding: var(--spacing-s) var(--spacing-m);
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
  }
  .query-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .query-option span,
  .query-row-name {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 2px;
  }
  .query-option small,
  .query-row-name small {
    color: var(--spectrum-global-color-gray-600);
    font-size: 11px;
    font-weight: 400;
  }
  .menu-empty,
  .empty {
    padding: var(--spacing-m);
    color: var(--spectrum-global-color-gray-600);
    font-size: var(--font-size-s);
  }
  .catalog-state.error,
  .missing-message,
  .parameter-change,
  .save-error {
    color: var(--spectrum-global-color-red-700);
  }
  .linked-query {
    border-radius: 4px;
    background: var(--background-alt);
  }
  .linked-query.missing {
    outline: 1px solid var(--spectrum-global-color-red-400);
  }
  .query-row {
    padding: 0 var(--spacing-s);
  }
  .query-row-toggle {
    min-width: 0;
    flex: 1;
    padding: var(--spacing-s) 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }
  .query-row-name {
    flex: 1;
  }
  .query-row-name strong,
  .query-row-name small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .remove-button {
    display: flex;
    border: 0;
    background: transparent;
    color: var(--spectrum-global-color-gray-600);
    cursor: pointer;
  }
  .remove-button:hover {
    color: var(--spectrum-global-color-red-700);
  }
  .query-details {
    gap: var(--spacing-m);
    padding: var(--spacing-m);
    border-top: 1px solid var(--spectrum-global-color-gray-200);
  }
  .code-reference,
  .missing-message,
  .parameter-change {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--spacing-xs);
    font-size: 12px;
  }
  .code-reference {
    flex-direction: column;
    align-items: flex-start;
  }
  .code-snippet {
    flex-wrap: wrap;
    max-width: 100%;
  }
  .code-snippet code {
    min-width: 0;
    max-width: 100%;
    overflow-wrap: anywhere;
  }
  code {
    padding: 2px var(--spacing-xs);
    border-radius: var(--radius-s);
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-800);
    font-family: var(--font-family-code);
  }
</style>
