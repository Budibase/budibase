<svelte:options runes={true} />

<script lang="ts">
  import { ActionMenu, Icon, MenuItem } from "@budibase/bbui"
  import type { ProjectResponse } from "@budibase/types"

  interface Props {
    projects?: ProjectResponse[]
    selectedProjectId?: string
    onSelect?: (_projectId: string) => void
    onCreateProject?: () => void
    onEditProject?: () => void
    onDeleteProject?: () => void
    onImportProject?: () => void
    onExportProject?: () => void
  }

  let {
    projects = [],
    selectedProjectId = "",
    onSelect = () => {},
    onCreateProject = () => {},
    onEditProject = () => {},
    onDeleteProject = () => {},
    onImportProject = () => {},
    onExportProject = () => {},
  }: Props = $props()
</script>

<div class="project-tabs">
  <div class="project-tabs__scroll">
    <button
      type="button"
      class="chip"
      class:chip--selected={!selectedProjectId}
      onclick={() => onSelect("")}
    >
      All projects
    </button>
    {#each projects as project (project._id)}
      {#if selectedProjectId === project._id}
        <div class="chip chip--selected chip--with-menu">
          <span class="chip__label">{project.name}</span>
          <ActionMenu align="left" animate={false}>
            <button
              slot="control"
              type="button"
              class="chip__menu-control"
              aria-label="Project actions"
            >
              <Icon name="dots-three" size="S" hoverable color="inherit" />
            </button>

            <MenuItem icon="pencil" on:click={onEditProject}>
              Edit project
            </MenuItem>
            <MenuItem icon="trash" on:click={onDeleteProject}>
              Delete project
            </MenuItem>
            <MenuItem icon="download-simple" on:click={onExportProject}>
              Export project
            </MenuItem>
          </ActionMenu>
        </div>
      {:else}
        <button
          type="button"
          class="chip"
          onclick={() => onSelect(project._id)}
        >
          {project.name}
        </button>
      {/if}
    {/each}
    <ActionMenu align="left" animate={false}>
      <button
        slot="control"
        type="button"
        class="chip chip--icon"
        aria-label="Project create and import actions"
      >
        <Icon
          name="plus"
          size="S"
          hoverable
          color="var(--spectrum-global-color-gray-600)"
        />
      </button>

      <MenuItem icon="stack" on:click={onCreateProject}>
        Create new project
      </MenuItem>
      <MenuItem icon="upload-simple" on:click={onImportProject}>
        Import project
      </MenuItem>
    </ActionMenu>
  </div>
</div>

<style>
  .project-tabs {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    width: 100%;
    min-width: 0;
  }

  .project-tabs__scroll {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1 1 auto;
    min-width: 0;
    overflow-x: auto;
    padding: 6px 4px;
    scrollbar-width: none;
  }

  .project-tabs__scroll::-webkit-scrollbar {
    display: none;
  }

  .chip {
    flex-shrink: 0;
    border: none;
    background: transparent;
    border-radius: 20px;
    padding: 2px 4px;
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    font-weight: 400;
    line-height: 17px;
    color: var(--spectrum-global-color-gray-700);
    cursor: pointer;
    transition:
      background 130ms ease-out,
      color 130ms ease-out;
  }

  .chip:hover {
    color: var(--spectrum-global-color-gray-800);
  }

  .chip--selected {
    background: var(--color-blue-700);
    color: var(--spectrum-global-color-static-gray-50);
    padding: 4px 6px;
  }

  button.chip--selected:hover {
    color: var(--spectrum-global-color-static-gray-50);
  }

  .chip--with-menu {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    cursor: default;
  }

  .chip--icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
  }

  .chip__label {
    white-space: nowrap;
  }

  .chip__menu-control {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    padding: 0;
    cursor: pointer;
    color: var(--spectrum-global-color-static-gray-50);
  }
</style>
