<script lang="ts">
  import { tick, createEventDispatcher } from "svelte"
  import { bb } from "@/stores/bb"
  import { ActionMenu, MenuItem, Icon, ActionButton } from "@budibase/bbui"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import { RestAuthType, type RestAuthConfig } from "@budibase/types"

  type AuthConfigType = RestAuthConfig["type"]

  interface AuthOption {
    connectionName: string
    connectionSourceId: string
    connectionTemplateId?: string
    connectionIcon?: { type: "asset" | "icon"; value: string }
    noAuth?: boolean
    authCfg: {
      _id?: string
      name: string
      type: AuthConfigType | null
    }
  }

  export let authConfigId: string | undefined
  export let restTemplateId: string | undefined = undefined
  export let datasourceId: string | undefined = undefined
  export let disabled: boolean = false

  const dispatch = createEventDispatcher()

  let menuRef: ActionMenu | undefined
  let searchInput: HTMLInputElement | undefined
  let searchQuery = ""
  let selectedDatasourceId: string | undefined = datasourceId
  let selectedAuthCfgId: string | undefined = authConfigId

  $: selectedDatasourceId = datasourceId
  $: selectedAuthCfgId = authConfigId

  $: savedConnections = $workspaceConnections.list
  $: connection = selectedDatasourceId
    ? $workspaceConnections.list.find(c => c.sourceId === selectedDatasourceId)
    : undefined

  $: authOptions = savedConnections.flatMap(connectionToAuthOptions)

  // Filter auth options based on search query
  $: filteredAuthOptions = authOptions.filter(option => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      option.connectionName.toLowerCase().includes(query) ||
      option.authCfg.name.toLowerCase().includes(query)
    )
  })

  $: sortedAuthOptions = sortAuthOptions(
    filteredAuthOptions,
    selectedDatasourceId,
    restTemplateId
  )

  $: selectedAuth = authOptions.find(
    opt =>
      opt.authCfg._id === selectedAuthCfgId &&
      opt.connectionSourceId === selectedDatasourceId
  )

  const isLegacyOAuth2Id = (id: string) => id.startsWith("oauth2_")

  $: buttonLabel = (() => {
    if (selectedAuth) return getAuthLabel(selectedAuth)
    if (authConfigId && isLegacyOAuth2Id(authConfigId)) {
      const name = $workspaceConnections.list.find(
        c => c.sourceId === authConfigId
      )?.name
      if (name) return `${name} - OAuth2`
    }
    return connection?.name ?? "Select connection"
  })()

  $: buttonIcon = selectedAuth?.connectionIcon ?? connection?.icon ?? null
  $: fallbackIcon = selectedAuth || connection ? "lock" : "lock-simple-open"

  function getAuthLabel(auth: AuthOption): string {
    const showAuthName = auth.authCfg.type !== null || auth.noAuth
    return showAuthName
      ? `${auth.connectionName} - ${auth.authCfg.name}`
      : auth.connectionName
  }

  // Flatten all auth configs from all connections for display.
  // Legacy standalone oauth2 docs are surfaced as a single selectable entry.
  // Datasource connections with no auth configs appear as a single connection-level row.
  const connectionToAuthOptions = (
    connection: (typeof savedConnections)[0]
  ): AuthOption[] => {
    const base = {
      connectionName: connection.name,
      connectionSourceId: connection.sourceId,
      connectionTemplateId: connection.templateId,
      connectionIcon: connection.icon,
    }

    // Legacy standalone OAuth2 docs surface as a single selectable entry
    if (connection.source === "oauth2") {
      return [
        {
          ...base,
          authCfg: {
            _id: connection.sourceId,
            name: connection.name,
            type: RestAuthType.OAUTH2,
          },
        },
      ]
    }
    const auths = connection.auth || []
    // One row per auth config, plus a "No auth" option to use the connection unauthenticated
    return [
      ...auths.map(authCfg => ({ ...base, authCfg })),
      {
        ...base,
        noAuth: true,
        authCfg: { _id: "no-auth", name: "No auth", type: null },
      },
    ]
  }

  const focusSearch = async () => {
    await tick()
    searchInput?.focus()
  }

  const selectConnection = (
    configId: string,
    type: AuthConfigType | null | undefined,
    connectionSourceId: string
  ) => {
    const newAuthConfigId = type ? configId : undefined
    selectedDatasourceId = connectionSourceId
    selectedAuthCfgId = newAuthConfigId
    dispatch("change", {
      authConfigId: newAuthConfigId,
      authConfigType: type ?? undefined,
      datasourceId: connectionSourceId,
    })
    menuRef?.hide()
  }

  const addNewConnection = () => {
    bb.settings("/connections/apis/create")
    menuRef?.hide()
  }

  const editConnection = (e: MouseEvent) => {
    e.stopPropagation()
    if (connection) {
      bb.settings(`/connections/apis/${connection.sourceId}`)
    }
  }

  const sortAuthOptions = (
    options: AuthOption[],
    datasourceId: string | undefined,
    templateId: string | undefined
  ): AuthOption[] => {
    const isSelected = (opt: AuthOption) =>
      opt.connectionSourceId === datasourceId

    const matchesTemplate = (opt: AuthOption) =>
      templateId && opt.connectionTemplateId === templateId

    return [...options].sort((a, b) => {
      // Selected always first
      if (isSelected(a) !== isSelected(b)) return isSelected(a) ? -1 : 1

      // Then matching template
      if (matchesTemplate(a) !== matchesTemplate(b))
        return matchesTemplate(a) ? -1 : 1

      // Then alphabetically
      return a.connectionName.localeCompare(b.connectionName)
    })
  }
</script>

<ActionMenu
  bind:this={menuRef}
  on:open={focusSearch}
  align="right"
  roundedPopover
  {disabled}
>
  <svelte:fragment slot="control" let:open>
    <div
      class="picker-button"
      class:has-value={!!connection}
      class:open
      class:disabled
    >
      <ActionButton icon={buttonIcon ? undefined : fallbackIcon} quiet>
        <div class="selected-option" title={buttonLabel} class:faded={open}>
          <span class="selected-option-left">
            {#if buttonIcon?.type === "asset"}
              <img src={buttonIcon.value} alt="icon" height={16} width={16} />
            {:else if buttonIcon?.type === "icon"}
              <Icon name={buttonIcon.value} size="S" />
            {/if}
            <span>{buttonLabel}</span>
          </span>
          <span class="selected-option-right">
            {#if connection}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <span class="edit-link" on:click={editConnection}>Edit</span>
            {/if}
            {#if !disabled}<Icon
                name={open ? "ChevronUp" : "ChevronDown"}
                size="S"
              />{/if}
          </span>
        </div>
      </ActionButton>
    </div>
  </svelte:fragment>

  <div class="auth-menu">
    <div class="auth-menu-header">
      <input
        bind:this={searchInput}
        class="auth-filter"
        type="text"
        placeholder="Connections"
        bind:value={searchQuery}
        aria-label="Filter connections"
      />
    </div>

    <div class="auth-menu-content">
      <div class="auth-section">
        <MenuItem on:click={addNewConnection}>
          <div class="auth-item">
            <Icon name="Add" size="S" />
            <span class="auth-item-label">Add new connection</span>
          </div>
        </MenuItem>
      </div>
      <div class="auth-divider"></div>
      {#if sortedAuthOptions.length === 0 && authOptions.length === 0}
        <div class="auth-empty">No other connections available.</div>
      {:else if sortedAuthOptions.length === 0}
        <div class="auth-empty">No connections match your search.</div>
      {:else}
        <div class="auth-section">
          {#each sortedAuthOptions as option (option.connectionSourceId + ":" + (option.authCfg._id ?? "none"))}
            {@const isSelected =
              option.connectionSourceId === selectedDatasourceId &&
              (option.noAuth
                ? !selectedAuthCfgId
                : option.authCfg._id === selectedAuthCfgId)}
            <MenuItem
              on:click={() =>
                selectConnection(
                  option.authCfg._id || "",
                  option.authCfg.type,
                  option.connectionSourceId
                )}
            >
              <div class="auth-item">
                {#if option.connectionIcon?.type === "asset"}
                  <img
                    src={option.connectionIcon.value}
                    alt="icon"
                    height={16}
                    width={16}
                  />
                {:else if option.connectionIcon?.type === "icon"}
                  <Icon name={option.connectionIcon.value} size="S" />
                {:else}
                  <Icon name="lock" size="S" />
                {/if}
                <span class="auth-item-label">{getAuthLabel(option)}</span>
                {#if isSelected}
                  <div class="auth-item-actions">
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

<style>
  .auth-menu-header {
    display: flex;
    justify-content: space-between;
    padding: var(--spectrum-listitem-padding-y)
      var(--spectrum-listitem-padding-right) var(--spectrum-listitem-padding-y)
      var(--spectrum-listitem-padding-left);
  }

  .auth-filter {
    flex: 1 1 auto;
    margin-right: var(--spacing-s);
    border: none;
    outline: none;
    background: transparent;
    color: var(--spectrum-global-color-gray-900);
  }

  .auth-menu-content {
    max-height: 400px;
    width: 300px;
    overflow-y: auto;
  }

  .auth-section {
    display: flex;
    flex-direction: column;
  }

  .auth-divider {
    height: 1px;
    background: var(--spectrum-global-color-gray-300);
    margin: var(--spacing-xs) 0;
  }

  .auth-empty {
    padding: var(--spacing-l);
    text-align: center;
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-600);
  }

  .auth-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-m);
  }

  .auth-item-actions {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }

  .auth-item-label {
    font-size: var(--font-size-s);
  }

  .picker-button {
    border-radius: 6px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    height: 40px;
    box-sizing: border-box;
    transition:
      background 130ms ease-out,
      border-color 130ms ease-out;
    background: transparent;
  }
  .picker-button.has-value {
    background: var(--spectrum-global-color-gray-75);
  }
  .picker-button:not(.disabled):hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
  .picker-button.disabled :global(*:not(.edit-link)) {
    cursor: default;
  }
  .picker-button.disabled :global(.spectrum-ActionButton--quiet:hover) {
    color: var(--spectrum-alias-text-color);
  }
  .picker-button :global(.spectrum-ActionButton) {
    border: none !important;
    background: transparent !important;
    border-radius: 6px;
  }

  .selected-option {
    transition: opacity 130ms ease-out;
    min-width: 300px;
    max-width: 300px;
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
  }

  .selected-option-left :global(span) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .selected-option.faded {
    opacity: 0.6;
  }

  .edit-link {
    font-size: var(--font-size-xs);
    color: var(--spectrum-global-color-gray-600);
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid var(--spectrum-global-color-gray-300);
    background: var(--spectrum-global-color-gray-75);
  }

  .edit-link:hover {
    color: var(--spectrum-global-color-gray-900);
    background: var(--spectrum-global-color-gray-200);
  }
</style>
