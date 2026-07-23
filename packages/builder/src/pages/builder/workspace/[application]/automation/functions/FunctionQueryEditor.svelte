<svelte:options runes={true} />

<script lang="ts">
  import { getErrorMessage } from "@/helpers/errors"
  import {
    Body,
    Button,
    Heading,
    Icon,
    Input,
    ProgressCircle,
    Select,
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

  interface Props {
    capabilities?: FunctionQueryCapability[]
    catalog?: FunctionQueryCatalogEntry[]
    catalogLoading?: boolean
    catalogError?: string
    onRetry?: () => void
    onSave?: (_capabilities: FunctionQueryCapabilityInput[]) => Promise<void>
  }

  let {
    capabilities = [],
    catalog = [],
    catalogLoading = false,
    catalogError = "",
    onRetry = () => {},
    onSave = async () => {},
  }: Props = $props()

  let drafts = $state<FunctionQueryCapabilityInput[]>([])
  let syncedCapabilities = $state("")
  let saving = $state(false)
  let saveError = $state("")
  let showErrors = $state(false)
  let queryToAdd = $state<Record<FunctionQueryKind, string | undefined>>({
    data: undefined,
    api: undefined,
  })

  const toInputs = (
    values: FunctionQueryCapability[]
  ): FunctionQueryCapabilityInput[] =>
    values.map(capability => ({
      queryId: capability.queryId,
      datasourceAlias: capability.datasourceAlias,
      queryAlias: capability.queryAlias,
    }))

  const haveSameParameterNames = (left: string[], right: string[]) =>
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
  let errors = $derived(validateFunctionQueryAliases(drafts, catalog))
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

  const getAvailableQueries = (kind: FunctionQueryKind) =>
    catalog.filter(
      entry =>
        entry.kind === kind &&
        !drafts.some(capability => capability.queryId === entry.queryId)
    )

  const getOptionLabel = (entry: FunctionQueryCatalogEntry) => entry.queryName
  const getOptionValue = (entry: FunctionQueryCatalogEntry) => entry.queryId
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
    return "Stored aliases and last-known parameters are shown below."
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

  const addQuery = (kind: FunctionQueryKind, queryId?: string) => {
    queryToAdd[kind] = undefined
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

  const getPersistedCapability = (
    queryId: string
  ): FunctionQueryCapability | undefined =>
    capabilities.find(capability => capability.queryId === queryId)

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
  <div class="editor-heading">
    <div>
      <Heading size="M">Linked queries</Heading>
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Only linked saved queries are available to this Function. Aliases remain
        stable when a datasource or query is renamed.
      </Body>
    </div>
    <Button primary disabled={!dirty || saving} on:click={save}>
      Save query links
    </Button>
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
      <Button secondary on:click={onRetry}>Retry</Button>
    </div>
  {:else}
    <div class="query-pickers">
      <Select
        label="Data queries"
        value={queryToAdd.data}
        options={getAvailableQueries("data")}
        {getOptionLabel}
        {getOptionValue}
        {getOptionSubtitle}
        showSelectedSubtitle
        autocomplete
        searchPlaceholder="Search Data queries"
        placeholder="Link a Data query"
        on:change={event => addQuery("data", event.detail)}
      />
      <Select
        label="API Explorer queries"
        value={queryToAdd.api}
        options={getAvailableQueries("api")}
        {getOptionLabel}
        {getOptionValue}
        {getOptionSubtitle}
        showSelectedSubtitle
        autocomplete
        searchPlaceholder="Search API queries"
        placeholder="Link an API query"
        on:change={event => addQuery("api", event.detail)}
      />
    </div>
  {/if}

  {#if !drafts.length}
    <div class="empty" data-testid="linked-queries-empty">
      <Icon name="link" size="L" />
      <Heading size="S">No linked queries</Heading>
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Select a saved Data or API Explorer query to make it callable.
      </Body>
    </div>
  {:else}
    <div class="linked-queries">
      {#each drafts as capability, index (capability.queryId)}
        {@const entry = catalogByQueryId.get(capability.queryId)}
        {@const missing = !catalogLoading && !catalogError && !entry}
        <article
          class:missing
          class="linked-query"
          data-testid={`linked-query-${capability.queryId}`}
        >
          <div class="query-heading">
            <div>
              <div class="query-title">
                <Icon
                  name={entry?.kind === "api" ? "globe-simple" : "database"}
                  size="S"
                />
                <Heading size="S">
                  {entry?.queryName || getUnavailableQueryTitle()}
                </Heading>
              </div>
              <Body size="S" color="var(--spectrum-global-color-gray-600)">
                {entry?.datasourceName ||
                  getUnavailableQueryDescription(capability, missing)}
              </Body>
            </div>
            <button
              type="button"
              class="remove-button"
              aria-label={`Remove ${entry?.queryName || (missing ? "missing query" : "query")}`}
              onclick={() => removeQuery(capability.queryId)}
            >
              <Icon name="trash" size="S" />
              Remove
            </button>
          </div>

          {#if missing}
            <div class="missing-message">
              <Icon name="warning-circle" size="S" />
              Remove this link before saving, or restore the saved query.
            </div>
          {/if}

          <div class="aliases">
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
          </div>

          <div class="code-reference">
            Available in code as
            <code
              >queries.{capability.datasourceAlias ||
                "datasource"}.{capability.queryAlias || "query"}()</code
            >
          </div>

          <div class="parameters">
            <span>Parameters</span>
            {#if entry?.parameters.length}
              {#each entry.parameters as parameter (parameter.name)}
                <code>{parameter.name}: string | null</code>
              {/each}
            {:else if !entry && getPersistedCapability(capability.queryId)?.parameterNames.length}
              {#each getPersistedCapability(capability.queryId)?.parameterNames || [] as parameter (parameter)}
                <code>{parameter}: string | null</code>
              {/each}
              <span class="parameter-note">Last known</span>
            {:else}
              <span>None</span>
            {/if}
          </div>

          {#if entry && parametersChanged(capability, entry)}
            <div class="parameter-change">
              Query parameters changed. Save and rebuild this Function to update
              its declarations.
            </div>
          {/if}
        </article>
      {/each}
    </div>
  {/if}

  {#if showErrors && hasFunctionQueryAliasErrors(errors)}
    <div class="save-error" role="alert">
      Fix the alias errors before saving.
    </div>
  {:else if saveError}
    <div class="save-error" role="alert">{saveError}</div>
  {/if}
</section>

<style>
  .query-editor {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
  .editor-heading,
  .query-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-l);
  }
  .editor-heading > div,
  .query-heading > div {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  .query-pickers {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-l);
    padding: var(--spacing-l);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-l);
    background: var(--spectrum-global-color-gray-100);
  }
  .catalog-state {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    min-height: 48px;
  }
  .catalog-state.error {
    color: var(--spectrum-global-color-red-700);
  }
  .empty {
    display: flex;
    min-height: 180px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-s);
    border: 1px dashed var(--spectrum-global-color-gray-400);
    border-radius: var(--radius-l);
    text-align: center;
  }
  .linked-queries {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
  .linked-query {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
    padding: var(--spacing-l);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-l);
  }
  .linked-query.missing {
    border-color: var(--spectrum-global-color-red-500);
  }
  .query-title {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .remove-button {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    border: 0;
    background: transparent;
    color: var(--spectrum-global-color-red-700);
    cursor: pointer;
    font: inherit;
  }
  .aliases {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--spacing-l);
  }
  .code-reference,
  .parameters,
  .missing-message,
  .parameter-change {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
  }
  .missing-message,
  .parameter-change,
  .save-error {
    color: var(--spectrum-global-color-red-700);
  }
  code {
    padding: 2px var(--spacing-xs);
    border-radius: var(--radius-s);
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-800);
    font-family: var(--font-family-code);
  }
  .parameter-note {
    color: var(--spectrum-global-color-gray-600);
    font-style: italic;
  }
  .save-error {
    font-size: 13px;
  }
  @media (max-width: 900px) {
    .query-pickers,
    .aliases {
      grid-template-columns: 1fr;
    }
  }
</style>
