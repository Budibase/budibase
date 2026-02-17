<script lang="ts">
  import { tick } from "svelte"
  import { bb } from "@/stores/bb"
  import {
    ActionMenu,
    MenuItem,
    Icon,
    ActionButton,
    Button,
  } from "@budibase/bbui"
  import { workspaceConnections } from "@/stores/builder/workspaceConnection"
  import type { RestAuthType, WorkspaceAuthConfig } from "@budibase/types"

  type AuthConfigType = WorkspaceAuthConfig["type"]
  type AuthOption = (typeof authOptions)[number]

  export let authSourceId: string | undefined
  export let authConfigId: string | undefined
  export let authConfigType: RestAuthType | AuthConfigType | undefined
  export let restTemplateId: string | undefined = undefined
  export let datasourceId: string | undefined = undefined

  let menuRef: ActionMenu | undefined
  let searchInput: HTMLInputElement | undefined
  let searchQuery = ""

  $: savedConnections = $workspaceConnections.list.filter(
    c => c.source !== "oauth2"
  )

  $: ownDatasource = datasourceId
    ? $workspaceConnections.list.find(c => c.sourceId === datasourceId)
    : undefined

  // Flatten all auth configs from all connections for display
  $: authOptions = savedConnections.flatMap(connection =>
    (connection.auth?.length
      ? connection.auth
      : [{ _id: "", name: "No auth", type: undefined }]
    ).map(authCfg => ({
      connectionName: connection.name,
      connectionSourceId: connection.sourceId,
      connectionTemplateId: connection.templateId,
      connectionIcon: connection.icon,
      authCfg,
    }))
  )

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
    authSourceId,
    authConfigId,
    restTemplateId
  )

  $: selectedAuth = authOptions.find(
    opt =>
      opt.connectionSourceId === authSourceId &&
      opt.authCfg._id === authConfigId
  )

  // Legacy behaviour.
  $: isUsingOwnDatasource = !authSourceId || authSourceId === datasourceId

  $: buttonLabel = selectedAuth
    ? `${selectedAuth.connectionName} - ${selectedAuth.authCfg.name}`
    : isUsingOwnDatasource && ownDatasource
      ? ownDatasource.name
      : "Select connection"

  $: buttonIcon = selectedAuth?.connectionIcon ?? null
  $: fallbackIcon =
    selectedAuth || isUsingOwnDatasource ? "lock" : "lock-simple-open"

  const focusSearch = async () => {
    await tick()
    searchInput?.focus()
  }

  const toggleAuth = (
    sourceId: string,
    configId: string,
    type: AuthConfigType | undefined
  ) => {
    const isSelected = authSourceId === sourceId && authConfigId === configId
    if (isSelected) {
      authSourceId = undefined
      authConfigId = undefined
      authConfigType = undefined
    } else {
      authSourceId = sourceId
      authConfigId = configId
      authConfigType = type
    }
    menuRef?.hide()
  }

  const addNewConnection = () => {
    bb.settings("/connections/create")
    menuRef?.hide()
  }

  const editConnection = (e: MouseEvent) => {
    e.stopPropagation()
    if (authSourceId) {
      bb.settings(`/connections/${authSourceId}`)
    }
  }

  const sortAuthOptions = (
    options: AuthOption[],
    selectedSourceId: string | undefined,
    selectedConfigId: string | undefined,
    templateId: string | undefined
  ): AuthOption[] => {
    const isSelected = (opt: AuthOption) =>
      selectedSourceId === opt.connectionSourceId &&
      selectedConfigId === opt.authCfg._id

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
  offset={2}
  minWidth={320}
  roundedPopover
  popoverBorderRadius="6px"
>
  <svelte:fragment slot="control" let:open>
    <div class="connection-select">
      <ActionButton
        icon={buttonIcon ? undefined : fallbackIcon}
        quiet
        bordered
        fullWidth
        selected={!!selectedAuth}
      >
        <div class="drop-btns" class:faded={open}>
          <span class="drop-btns-label">
            {#if buttonIcon?.type === "asset"}
              <img src={buttonIcon.value} alt="icon" height={16} width={16} />
            {:else if buttonIcon?.type === "icon"}
              <Icon name={buttonIcon.value} size="S" />
            {/if}
            {buttonLabel}
            {#if selectedAuth}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-static-element-interactions -->
              <span class="edit-link" on:click={editConnection}>Edit</span>
            {/if}
          </span>
          <Icon name={open ? "ChevronUp" : "ChevronDown"} size="S" />
        </div>
      </ActionButton>
    </div>
  </svelte:fragment>

  <div
    class="auth-menu"
    class:hide-checkmark={isUsingOwnDatasource && !selectedAuth}
  >
    {#if authOptions.length > 0}
      <div class="auth-menu-header">
        <input
          bind:this={searchInput}
          class="auth-filter"
          type="text"
          placeholder="Search connections"
          bind:value={searchQuery}
          aria-label="Filter connections"
        />
      </div>
    {/if}

    <div class="auth-menu-content">
      {#if authOptions.length > 0}
        <div class="auth-section">
          <MenuItem on:click={addNewConnection}>
            <div class="auth-item">
              <Icon name="plus" size="S" weight="bold" />
              <span class="auth-item-label">Add new connection</span>
            </div>
          </MenuItem>
        </div>
        <div class="auth-divider"></div>
      {/if}
      {#if ownDatasource && !authConfigId}
        <div class="auth-section">
          <MenuItem
            on:click={() => {
              authSourceId = undefined
              authConfigId = undefined
              authConfigType = undefined
              menuRef?.hide()
            }}
          >
            <div class="auth-item">
              <Icon name="webhooks-logo" size="S" disabled />
              <span class="auth-item-label">
                {ownDatasource.name}
              </span>
              {#if isUsingOwnDatasource && !authConfigId}
                <div class="auth-item-actions">
                  <Icon name="check" size="S" />
                </div>
              {/if}
            </div>
          </MenuItem>
        </div>
        <div class="auth-divider"></div>
      {/if}
      {#if sortedAuthOptions.length === 0 && authOptions.length === 0}
        <div class="auth-empty">
          <span class="auth-empty-text"
            >No connections yet. Add one to continue.</span
          >
          <Button size="S" primary icon="Add" on:click={addNewConnection}>
            Add connection
          </Button>
        </div>
      {:else if sortedAuthOptions.length === 0}
        <div class="auth-empty">No connections match your search.</div>
      {:else}
        <div class="auth-section">
          {#each sortedAuthOptions as option (option.connectionSourceId + ":" + option.authCfg._id)}
            {@const isSelected =
              authSourceId === option.connectionSourceId &&
              authConfigId === option.authCfg._id}
            <MenuItem
              on:click={() =>
                toggleAuth(
                  option.connectionSourceId,
                  option.authCfg._id || "",
                  option.authCfg.type
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
                <span class="auth-item-label">
                  {option.connectionName} - {option.authCfg.name}
                </span>
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
  .auth-menu {
    padding: 4px 0;
  }

  .auth-menu-header {
    display: flex;
    justify-content: space-between;
    padding: 8px 6px;
    margin: 6px;
    border: 1px solid var(--spectrum-global-color-gray-200);
    border-radius: 5px;
    background: var(--spectrum-global-color-gray-75);
  }

  .auth-filter {
    flex: 1 1 auto;
    margin-right: var(--spacing-s);
    border: none;
    outline: none;
    background: transparent;
    color: var(--spectrum-global-color-gray-900);
  }

  .hide-checkmark :global(i.ph-check) {
    display: none;
  }

  .auth-menu-content {
    max-height: 400px;
    overflow-y: auto;
    padding: 0 6px;
    margin-top: 6px;
  }

  .auth-section {
    display: flex;
    flex-direction: column;
  }

  .auth-divider {
    height: 0.5px;
    background: var(--spectrum-global-color-gray-200);
    margin: var(--spacing-xs) 0;
  }

  .auth-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-m);
    padding: var(--spacing-l);
    font-size: var(--font-size-s);
    color: var(--spectrum-global-color-gray-600);
  }

  .auth-empty-text {
    font-size: 14px;
    color: var(--spectrum-global-color-gray-800);
    text-align: center;
    margin-bottom: 4px;
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

  .connection-select {
    min-width: 320px;
  }

  .drop-btns {
    display: flex;
    justify-content: space-between;
    gap: var(--spacing-s);
    align-items: center;
    transition: opacity 130ms ease-out;
    width: 100%;
  }

  .drop-btns-label {
    display: flex;
    gap: var(--spacing-s);
    align-items: center;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-900);
  }

  .drop-btns.faded {
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
