<script>
  import {
    ActionButton,
    Button,
    Icon,
    DrawerContent,
    Layout,
    Input,
    Combobox,
    Drawer,
  } from "@budibase/bbui"
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { generate } from "shortid"
  import { screenStore } from "stores/builder"
  import RoleSelect from "components/design/settings/controls/RoleSelect.svelte"

  export let value = []

  const flipDurationMs = 150

  let dragDisabled = true
  let drawer

  $: links = value || []
  $: links.forEach(link => {
    if (!link.id) {
      link.id = generate()
    }
  })
  $: urlOptions = $screenStore.screens
    .map(screen => screen.routing?.route)
    .filter(x => x != null)

  const addLink = () => {
    links = [...links, {}]
  }

  const removeLink = id => {
    links = links.filter(link => link.id !== id)
  }

  const updateLinks = e => {
    links = e.detail.items
  }

  const handleFinalize = e => {
    updateLinks(e)
    dragDisabled = true
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<Drawer bind:this={drawer}>
  <DrawerContent>
    <div class="container">
      <Layout noPadding gap="S">
        {#if links?.length}
          <div
            class="links"
            use:dndzone={{
              items: links,
              flipDurationMs,
              dropTargetStyle: { outline: "none" },
              dragDisabled,
            }}
            on:finalize={handleFinalize}
            on:consider={updateLinks}
          >
            {#each links as link (link.id)}
              <div class="link" animate:flip={{ duration: flipDurationMs }}>
                <div
                  class="handle"
                  aria-label="drag-handle"
                  style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
                  on:mousedown={() => (dragDisabled = false)}
                >
                  <Icon name="DragHandle" size="XL" />
                </div>
                <Input bind:value={link.text} placeholder="Text" />
                <Combobox
                  bind:value={link.url}
                  placeholder="URL"
                  options={urlOptions}
                />
                <RoleSelect
                  bind:value={link.roleId}
                  placeholder="Minimum role"
                />
                <Icon
                  name="Close"
                  hoverable
                  size="S"
                  on:click={() => removeLink(link.id)}
                />
              </div>
            {/each}
          </div>
        {/if}
        <div>
          <Button secondary icon="Add" on:click={addLink}>Add Link</Button>
        </div>
      </Layout>
    </div>
  </DrawerContent>
</Drawer>

<div class="button">
  <ActionButton>No sub links</ActionButton>
</div>

<style>
  .button :global(.spectrum-ActionButton) {
    width: 100%;
  }
  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  .links {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
  }
  .link {
    gap: var(--spacing-l);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--border-radius-s);
    transition: background-color ease-in-out 130ms;
  }
  .link:hover {
    background-color: var(--spectrum-global-color-gray-100);
  }
  .link > :global(.spectrum-Form-item) {
    flex: 1 1 auto;
    width: 0;
  }
  .handle {
    display: grid;
    place-items: center;
  }
</style>
