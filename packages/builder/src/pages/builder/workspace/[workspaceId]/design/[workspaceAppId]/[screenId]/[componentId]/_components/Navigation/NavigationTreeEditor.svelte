<script lang="ts">
  import {
    ActionButton,
    Button,
    Drawer,
    DrawerContent,
    Icon,
    notifications,
  } from "@budibase/bbui"
  import { tick } from "svelte"
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { generate } from "shortid"
  import {
    Constants,
    NavigationUtils,
    RoleUtils,
  } from "@budibase/frontend-core"
  import type { AppNavigationLink, EnrichedBinding } from "@budibase/types"
  import { navigationStore, roles } from "@/stores/builder"
  import { getSequentialName } from "@/helpers/duplicate"
  import NavItemFields from "./NavItemFields.svelte"

  export let bindings: EnrichedBinding[] = []

  const flipDurationMs = 130
  const zoneType = generate()

  let drawer: Drawer
  let columnsEl: HTMLDivElement | undefined
  let links: AppNavigationLink[] = []
  let selectedId: string | null = null
  let columnPath: string[] = []
  let dragDisabled = true

  // Focus the branch you open: scroll the columns to reveal the deepest one.
  const focusOpenBranch = async () => {
    await tick()
    columnsEl?.scrollTo({ left: columnsEl.scrollWidth, behavior: "smooth" })
  }
  $: columnPath, focusOpenBranch()

  $: count = $navigationStore.links?.length ?? 0
  $: buttonText = `${count || "No"} nav item${count === 1 ? "" : "s"}`

  $: columns = buildColumns(links, columnPath)
  $: selectedNode = selectedId
    ? NavigationUtils.findNavNode(links, selectedId)
    : null
  $: selectedPath = selectedId
    ? NavigationUtils.findNavPath(links, selectedId) || []
    : []
  // The role the selected item is gated by through its ancestors: the nearest
  // explicit role above it, since intermediate groups may themselves inherit.
  $: parentRole =
    selectedPath.length > 1
      ? NavigationUtils.effectiveNavRole(
          selectedPath.slice(0, -1),
          Constants.Roles.BASIC
        )
      : null

  interface Column {
    parentId: string | null
    items: AppNavigationLink[]
  }

  const buildColumns = (
    links: AppNavigationLink[],
    path: string[]
  ): Column[] => {
    const cols: Column[] = [
      { parentId: null, items: NavigationUtils.navChildrenOf(links, null) },
    ]
    for (const id of path) {
      // Only a group can open a child column; stop if a path entry is gone or is
      // no longer a group (e.g. it was just toggled to a link).
      const node = NavigationUtils.findNavNode(links, id)
      if (node?.type !== "sublinks") {
        break
      }
      cols.push({
        parentId: id,
        items: NavigationUtils.navChildrenOf(links, id),
      })
    }
    return cols
  }

  const openDrawer = () => {
    links = JSON.parse(JSON.stringify($navigationStore.links || []))
    NavigationUtils.walkNav(links, node => {
      if (!node.id) {
        node.id = generate()
      }
    })
    selectedId = null
    columnPath = []
    drawer.show()
  }

  const isGroup = (node: AppNavigationLink) => node.type === "sublinks"

  // Both of these are dropped by the runtime filter, so say so here rather than
  // letting the item quietly disappear from the app.
  const hiddenReason = (node: AppNavigationLink): string | undefined => {
    if (isGroup(node)) {
      return NavigationUtils.navChildrenOf(links, node.id || null).length
        ? undefined
        : "No sub items - this group won't be shown in your app"
    }
    return node.url
      ? undefined
      : "No link set - this item won't be shown in your app"
  }

  const selectItem = (item: AppNavigationLink, colIndex: number) => {
    if (isGroup(item) && item.id) {
      columnPath = [...columnPath.slice(0, colIndex), item.id]
    } else {
      columnPath = columnPath.slice(0, colIndex)
    }
    selectedId = item.id || null
  }

  const newNode = (
    roleId: string,
    siblings: AppNavigationLink[]
  ): AppNavigationLink => ({
    id: generate(),
    text: getSequentialName(siblings, "New item ", {
      getName: (x: AppNavigationLink) => x.text,
    }),
    url: "",
    roleId,
    type: "link",
  })

  // A new sub item inherits (at least) its parent group's access - the role that
  // actually gates the parent, which may come from further up the chain.
  const roleFor = (parentId: string | null): string =>
    parentId == null
      ? Constants.Roles.BASIC
      : NavigationUtils.effectiveNavRole(
          NavigationUtils.findNavPath(links, parentId) || [],
          Constants.Roles.BASIC
        )

  const addToColumn = (colIndex: number) => {
    const parentId = columns[colIndex].parentId
    const child = newNode(roleFor(parentId), columns[colIndex].items)
    links = NavigationUtils.addNavChild(links, parentId, child)
    selectedId = child.id || null
  }

  const removeItem = (id: string) => {
    links = NavigationUtils.removeNavNode(links, id)
    if (selectedId === id) {
      selectedId = null
    }
    columnPath = columnPath.filter(pid =>
      NavigationUtils.findNavNode(links, pid)
    )
  }

  const updateField = (field: string, value: unknown) => {
    if (!selectedId) {
      return
    }
    links = NavigationUtils.updateNavNode(links, selectedId, {
      [field]: value,
    } as Partial<AppNavigationLink>)
    if (field === "type") {
      // Reflect the toggle in the columns immediately: a new group opens its
      // (empty) child column, a demoted group closes it.
      const ids = (NavigationUtils.findNavPath(links, selectedId) || [])
        .map(n => n.id)
        .filter((id): id is string => !!id)
      columnPath = value === "sublinks" ? ids : ids.slice(0, -1)
    }
    if (field === "roleId" && typeof value === "string" && value) {
      // Sub items must stay at least as restrictive as their group. Items that
      // inherit are already fine; only explicit roles can violate the rule, and
      // raising those is reported rather than done silently.
      const result = NavigationUtils.enforceSubtreeMinRole(
        links,
        selectedId,
        value,
        (r, parent) => RoleUtils.isRoleAtLeastAsRestrictive(r, parent, $roles)
      )
      links = result.links
      if (result.raised.length) {
        const names = result.raised.join(", ")
        notifications.info(
          `Access raised to match on ${result.raised.length} sub item${
            result.raised.length === 1 ? "" : "s"
          }: ${names}`
        )
      }
    }
  }

  const reorderColumn = (colIndex: number, items: AppNavigationLink[]) => {
    const parentId = columns[colIndex].parentId
    links = NavigationUtils.reorderNavChildren(links, parentId, items)
  }

  // The drawer batches the whole editing session in a local copy, so a failed
  // save must keep it open with the edits intact rather than discard them.
  const save = async () => {
    try {
      await navigationStore.save({ ...$navigationStore, links })
      drawer.hide()
    } catch (error) {
      const message = error instanceof Error ? error.message : ""
      notifications.error(
        message
          ? `Could not save navigation: ${message}`
          : "Could not save navigation"
      )
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<Drawer
  bind:this={drawer}
  title="Navigation"
  forceModal
  on:drawerShow
  on:drawerHide
>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <DrawerContent slot="body">
    <div class="editor">
      <div class="columns" bind:this={columnsEl}>
        {#each columns as column, colIndex}
          <div class="column">
            <div class="column-body">
              {#if column.items.length}
                <div
                  class="rows"
                  use:dndzone={{
                    items: column.items,
                    flipDurationMs,
                    dropTargetStyle: { outline: "none" },
                    dragDisabled,
                    type: `${zoneType}-${colIndex}`,
                    dropFromOthersDisabled: true,
                  }}
                  on:consider={e => reorderColumn(colIndex, e.detail.items)}
                  on:finalize={e => {
                    reorderColumn(colIndex, e.detail.items)
                    dragDisabled = true
                  }}
                >
                  {#each column.items as item (item.id)}
                    {@const hidden = hiddenReason(item)}
                    <div
                      class="row"
                      class:selected={selectedId === item.id ||
                        columnPath[colIndex] === item.id}
                      animate:flip={{ duration: flipDurationMs }}
                      on:click={() => selectItem(item, colIndex)}
                    >
                      <div
                        class="handle"
                        aria-label="drag-handle"
                        on:mousedown={() => (dragDisabled = false)}
                      >
                        <Icon name="dots-six-vertical" size="S" />
                      </div>
                      {#if item.icon}
                        <Icon name={item.icon} size="S" />
                      {/if}
                      <span class="label">{item.text || "Untitled"}</span>
                      {#if hidden}
                        <Icon
                          name="warning"
                          size="XS"
                          color="var(--spectrum-global-color-yellow-600)"
                          tooltip={hidden}
                        />
                      {/if}
                      {#if item._conditions?.length}
                        <Icon name="lightning" size="XS" />
                      {/if}
                      {#if isGroup(item)}
                        <Icon name="caret-right" size="S" />
                      {/if}
                      <div
                        class="delete"
                        on:click|stopPropagation={() =>
                          item.id && removeItem(item.id)}
                      >
                        <Icon name="x" size="XS" hoverable />
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
              <ActionButton
                quiet
                icon="plus"
                on:click={() => addToColumn(colIndex)}
              >
                Add item
              </ActionButton>
            </div>
          </div>
        {/each}
      </div>

      <div class="detail">
        {#if selectedNode}
          <div class="crumbs">
            {#each selectedPath as node, i}
              {#if i > 0}<Icon name="caret-right" size="XS" />{/if}
              <span class:current={i === selectedPath.length - 1}
                >{node.text || "Untitled"}</span
              >
            {/each}
          </div>
          <NavItemFields
            node={selectedNode}
            depth={selectedPath.length - 1}
            {parentRole}
            {bindings}
            onChange={updateField}
          />
        {:else}
          <div class="empty">
            <Icon name="hand-pointing" size="XL" />
            <span>Select an item to edit, or add a new one</span>
          </div>
        {/if}
      </div>
    </div>
  </DrawerContent>
</Drawer>

<div class="trigger">
  <ActionButton on:click={openDrawer}>{buttonText}</ActionButton>
</div>

<style>
  .trigger :global(.spectrum-ActionButton) {
    width: 100%;
  }
  .editor {
    display: flex;
    width: 100%;
    min-height: 460px;
    gap: 0;
  }
  .columns {
    display: flex;
    flex: 1 1 auto;
    overflow-x: auto;
    border-right: 1px solid var(--spectrum-global-color-gray-300);
  }
  .column {
    flex: 0 0 240px;
    border-right: 1px solid var(--spectrum-global-color-gray-200);
    display: flex;
    flex-direction: column;
  }
  .column-body {
    padding: var(--spacing-s);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
  .rows {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: var(--spacing-s);
    padding: 6px 8px;
    border-radius: var(--border-radius-s);
    cursor: pointer;
  }
  .row:hover {
    background: var(--spectrum-global-color-gray-200);
  }
  .row.selected {
    background: var(--spectrum-global-color-gray-300);
  }
  .row .handle {
    display: flex;
    align-items: center;
    color: var(--spectrum-global-color-gray-500);
    cursor: grab;
    opacity: 0;
  }
  .row:hover .handle {
    opacity: 1;
  }
  .row .label {
    flex: 1 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .row .delete {
    display: flex;
    align-items: center;
    opacity: 0;
  }
  .row:hover .delete {
    opacity: 1;
  }
  .detail {
    flex: 0 0 340px;
    padding: var(--spacing-l);
    overflow-y: auto;
  }
  .crumbs {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
    margin-bottom: var(--spacing-l);
    color: var(--spectrum-global-color-gray-600);
    font-size: 12px;
  }
  .crumbs .current {
    color: var(--spectrum-global-color-gray-900);
    font-weight: 600;
  }
  .empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-m);
    color: var(--spectrum-global-color-gray-500);
    text-align: center;
  }
</style>
