<svelte:options runes={true} />

<script lang="ts">
  import type { UIFunction } from "@/stores/builder/functions"
  import {
    ActionMenu,
    Body,
    Button,
    Heading,
    Helpers,
    Icon,
    MenuItem,
    ProgressCircle,
  } from "@budibase/bbui"

  export interface Props {
    functions?: UIFunction[]
    loading?: boolean
    error?: string
    canManage?: boolean
    onOpen?: (_fn: UIFunction) => void
    onRetry?: () => void
    onCreate?: () => void
    onRename?: (_fn: UIFunction) => void
    onDuplicate?: (_fn: UIFunction) => void
    onDelete?: (_fn: UIFunction) => void
  }

  let {
    functions = [],
    loading = false,
    error = "",
    canManage = false,
    onOpen = () => {},
    onRetry = () => {},
    onCreate = () => {},
    onRename = () => {},
    onDuplicate = () => {},
    onDelete = () => {},
  }: Props = $props()

  const readinessLabels = {
    ready: "Ready",
    build_required: "Build required",
    build_failed: "Build failed",
  }

  const deploymentLabels = {
    not_deployed: "Not deployed",
    published: "Published",
    unpublished_changes: "Unpublished changes",
  }
</script>

<div class="functions-page">
  <div class="heading">
    <div>
      <Heading size="L">Functions</Heading>
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Reusable TypeScript that can run from your automations.
      </Body>
    </div>
    {#if canManage}
      <Button primary on:click={onCreate}>
        <Icon name="plus" size="S" />
        New Function
      </Button>
    {/if}
  </div>

  {#if !canManage}
    <div class="state" data-testid="functions-permission-state">
      <Icon name="lock" size="L" />
      <Heading size="S">You don't have permission to manage Functions</Heading>
    </div>
  {:else if loading}
    <div class="state" data-testid="functions-loading-state">
      <ProgressCircle size="M" />
      <Body size="S">Loading Functions...</Body>
    </div>
  {:else if error}
    <div class="state" data-testid="functions-error-state">
      <Icon name="warning-circle" size="L" />
      <Heading size="S">Unable to load Functions</Heading>
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        {error}
      </Body>
      <Button secondary on:click={onRetry}>Retry</Button>
    </div>
  {:else if !functions.length}
    <div class="state" data-testid="functions-empty-state">
      <Icon name="code" size="XL" />
      <Heading size="S">Create your first Function</Heading>
      <Body size="S" color="var(--spectrum-global-color-gray-600)">
        Functions let automations reuse safe, server-side TypeScript.
      </Body>
      <Button primary on:click={onCreate}>New Function</Button>
    </div>
  {:else}
    <div class="function-table" role="table" aria-label="Functions">
      <div class="table-header" role="row">
        <div role="columnheader">Name</div>
        <div role="columnheader">Readiness</div>
        <div role="columnheader">Deployment</div>
        <div role="columnheader">Linked queries</div>
        <div role="columnheader">Last updated</div>
        <div role="columnheader" aria-label="Actions"></div>
      </div>
      {#each functions as fn (fn._id)}
        <div class="table-row" role="row">
          <div class="name" role="cell">
            <Icon name="code" size="S" />
            <button
              type="button"
              class="name-button"
              onclick={() => onOpen(fn)}
            >
              {fn.name}
            </button>
          </div>
          <div role="cell">
            <span class:failed={fn.readiness === "build_failed"}>
              {readinessLabels[fn.readiness]}
            </span>
          </div>
          <div role="cell">{deploymentLabels[fn.deploymentState]}</div>
          <div role="cell">{fn.capabilities.length}</div>
          <div role="cell">{Helpers.getDateDisplayValue(fn.updatedAt)}</div>
          <div class="actions" role="cell">
            <ActionMenu align="right">
              <button
                slot="control"
                type="button"
                class="action-control"
                aria-label={`Actions for ${fn.name}`}
              >
                <Icon name="dots-three" size="M" hoverable />
              </button>
              <MenuItem icon="pencil" on:click={() => onRename(fn)}>
                Rename
              </MenuItem>
              <MenuItem icon="copy" on:click={() => onDuplicate(fn)}>
                Duplicate
              </MenuItem>
              <MenuItem icon="trash" on:click={() => onDelete(fn)}>
                Delete
              </MenuItem>
            </ActionMenu>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .functions-page {
    padding: var(--spacing-xl);
    overflow: auto;
    flex: 1;
  }
  .heading {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-l);
    margin-bottom: var(--spacing-xl);
  }
  .heading > div {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  .state {
    min-height: 320px;
    border: 1px dashed var(--spectrum-global-color-gray-400);
    border-radius: var(--radius-l);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: var(--spacing-s);
    padding: var(--spacing-xl);
  }
  .function-table {
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: var(--radius-l);
    overflow: hidden;
  }
  .table-header,
  .table-row {
    display: grid;
    grid-template-columns:
      minmax(180px, 2fr) minmax(120px, 1fr) minmax(150px, 1fr)
      110px minmax(150px, 1fr) 52px;
    align-items: center;
    min-height: 52px;
  }
  .table-header {
    min-height: 38px;
    background: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
    font-weight: 500;
  }
  .table-row {
    border-top: 1px solid var(--spectrum-global-color-gray-300);
    color: var(--spectrum-global-color-gray-800);
    font-size: 13px;
  }
  .table-header > div,
  .table-row > div {
    padding: 0 var(--spacing-m);
    min-width: 0;
  }
  .name {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
  }
  .name-button {
    appearance: none;
    border: 0;
    background: transparent;
    color: var(--spectrum-global-color-blue-700);
    cursor: pointer;
    font: inherit;
    padding: 0;
    text-align: left;
  }
  .name-button:hover {
    text-decoration: underline;
  }
  .failed {
    color: var(--spectrum-global-color-red-600);
  }
  .actions {
    display: flex;
    justify-content: flex-end;
  }
  .action-control {
    background: transparent;
    border: 0;
    padding: 0;
  }
</style>
