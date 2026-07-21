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

<nav class="project-tabs" aria-label="Projects">
  <div class="project-tabs__scroll">
    <button
      type="button"
      class="project-tab"
      class:project-tab--selected={!selectedProjectId}
      aria-pressed={!selectedProjectId}
      onclick={() => onSelect("")}
    >
      <span class="project-tab__label">All projects</span>
    </button>

    {#each projects as project (project._id)}
      {@const selected = selectedProjectId === project._id}
      {#if selected}
        <div class="project-tab project-tab--selected project-tab--with-menu">
          <button
            type="button"
            class="project-tab__select"
            aria-pressed="true"
            onclick={() => onSelect(project._id)}
          >
            {#if project.color}
              <span
                class="project-tab__color"
                style:background-color={project.color}
                data-testid={`project-color-${project._id}`}
              ></span>
            {/if}
            <span class="project-tab__label" title={project.name}>
              {project.name}
            </span>
          </button>

          <ActionMenu align="left" animate={false}>
            <button
              slot="control"
              type="button"
              class="project-tab__menu-control"
              aria-label={`Actions for ${project.name}`}
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
          class="project-tab"
          aria-pressed="false"
          onclick={() => onSelect(project._id)}
        >
          {#if project.color}
            <span
              class="project-tab__color"
              style:background-color={project.color}
              data-testid={`project-color-${project._id}`}
            ></span>
          {/if}
          <span class="project-tab__label" title={project.name}>
            {project.name}
          </span>
        </button>
      {/if}
    {/each}

    <ActionMenu align="left" animate={false}>
      <button
        slot="control"
        type="button"
        class="project-tab project-tab--icon"
        aria-label="Project create and import actions"
      >
        <Icon name="plus" size="S" hoverable color="inherit" />
      </button>

      <MenuItem icon="stack" on:click={onCreateProject}>
        Create new project
      </MenuItem>
      <MenuItem icon="upload-simple" on:click={onImportProject}>
        Import project
      </MenuItem>
    </ActionMenu>
  </div>
</nav>

<style>
  .project-tabs {
    position: relative;
    z-index: 1;
    width: 100%;
    min-width: 0;
    margin-bottom: -1px;
  }

  .project-tabs__scroll {
    display: flex;
    align-items: flex-end;
    gap: 4px;
    min-width: 0;
    overflow-x: auto;
    padding: 4px 4px 0;
    scrollbar-width: none;
  }

  .project-tabs__scroll::-webkit-scrollbar {
    display: none;
  }

  .project-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    flex: 0 0 auto;
    min-height: 28px;
    max-width: 240px;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-bottom: 0;
    border-radius: var(--border-radius-s) var(--border-radius-s) 0 0;
    padding: 5px 11px 6px;
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-700);
    font-family: var(--font-sans);
    font-size: var(--font-size-s);
    font-weight: 400;
    line-height: 17px;
    cursor: pointer;
    white-space: nowrap;
    transition:
      background-color 130ms ease-out,
      border-color 130ms ease-out,
      color 130ms ease-out,
      transform 130ms ease-out;
  }

  .project-tab:hover {
    background: var(--spectrum-global-color-gray-300);
    color: var(--spectrum-global-color-gray-900);
    transform: translateY(-1px);
  }

  .project-tab:focus-visible,
  .project-tab__select:focus-visible,
  .project-tab__menu-control:focus-visible {
    outline: 2px solid var(--spectrum-global-color-blue-400);
    outline-offset: -2px;
  }

  .project-tab--selected {
    position: relative;
    z-index: 2;
    border-color: var(--spectrum-global-color-gray-200);
    background: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-900);
    font-weight: 500;
  }

  .project-tab--selected:hover {
    border-color: var(--spectrum-global-color-gray-200);
    background: var(--spectrum-global-color-gray-100);
    color: var(--spectrum-global-color-gray-900);
    transform: none;
  }

  .project-tab--with-menu {
    gap: 1px;
    padding: 0 5px 0 0;
    cursor: default;
  }

  .project-tab__select {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    height: 100%;
    border: 0;
    background: transparent;
    padding: 5px 5px 6px 11px;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }

  .project-tab__label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .project-tab__color {
    flex: 0 0 auto;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    box-shadow: 0 0 0 1px var(--spectrum-global-color-gray-500);
  }

  .project-tab__menu-control {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: 0;
    border-radius: var(--border-radius-s);
    background: transparent;
    padding: 0;
    color: inherit;
    cursor: pointer;
  }

  .project-tab__menu-control:hover {
    background: var(--translucent-grey);
  }

  .project-tab--icon {
    min-width: 28px;
    padding: 5px;
    color: var(--spectrum-global-color-gray-700);
  }
</style>
