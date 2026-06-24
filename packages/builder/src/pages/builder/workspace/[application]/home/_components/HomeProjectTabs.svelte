<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { ActionMenu, Icon, MenuItem, PopoverAlignment } from "@budibase/bbui"
  import type { ProjectResponse } from "@budibase/types"

  export let projects: ProjectResponse[] = []
  export let selectedProjectId = ""
  export let hasSelectedProject = false
  export let canExport = false

  const dispatch = createEventDispatcher<{
    select: string
    createProject: void
    editProject: void
    deleteProject: void
    importProject: void
    exportProject: void
  }>()
</script>

<div class="project-tabs">
  <div class="project-tabs__scroll">
    <button
      type="button"
      class="chip"
      class:chip--selected={!selectedProjectId}
      on:click={() => dispatch("select", "")}
    >
      All projects
    </button>
    {#each projects as project (project._id)}
      <button
        type="button"
        class="chip"
        class:chip--selected={selectedProjectId === project._id}
        on:click={() => dispatch("select", project._id)}
      >
        {project.name}
      </button>
    {/each}
  </div>

  <div class="project-tabs__menu">
    <ActionMenu align={PopoverAlignment.Left} animate={false}>
      <div slot="control" class="stack-plus-control">
        <Icon
          name="stack-plus"
          size="S"
          hoverable
          color="var(--spectrum-global-color-gray-600)"
        />
      </div>

      <MenuItem icon="stack" on:click={() => dispatch("createProject")}>
        Create project
      </MenuItem>
      <MenuItem
        icon="pencil"
        on:click={() => dispatch("editProject")}
        disabled={!hasSelectedProject}
      >
        Edit selected project
      </MenuItem>
      <MenuItem
        icon="trash"
        on:click={() => dispatch("deleteProject")}
        disabled={!hasSelectedProject}
      >
        Delete selected project
      </MenuItem>
      <MenuItem icon="upload-simple" on:click={() => dispatch("importProject")}>
        Import project
      </MenuItem>
      <MenuItem
        icon="download-simple"
        on:click={() => dispatch("exportProject")}
        disabled={!canExport}
      >
        Export project
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
    padding: 2px 4px;
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
    padding: 4px 6px;
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
    background: var(--color-brand-950);
    color: var(--spectrum-global-color-gray-900);
    padding: 4px 6px;
  }

  .chip--selected:hover {
    color: var(--spectrum-global-color-gray-900);
  }

  .project-tabs__menu {
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  .stack-plus-control {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    cursor: pointer;
  }
</style>
