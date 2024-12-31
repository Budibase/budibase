<script>
  import {
    ActionButton,
    Button,
    Icon,
    DrawerContent,
    Layout,
    Input,
    Drawer,
  } from "@budibase/bbui"
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { generate } from "shortid"
  import { screenStore } from "@/stores/builder"
  import DrawerBindableCombobox from "@/components/common/bindings/DrawerBindableCombobox.svelte"

  export let value = []
  export let onChange
  export let navItem
  export let bindings

  const flipDurationMs = 150

  let drawer
  let subLinks = value?.slice() || []

  $: count = value?.length ?? 0
  $: buttonText = `${count || "No"} sub link${count === 1 ? "" : "s"}`
  $: drawerTitle = navItem.text ? `${navItem.text} sub links` : "Sub links"
  $: subLinks.forEach(subLink => {
    if (!subLink.id) {
      subLink.id = generate()
    }
  })
  $: urlOptions = $screenStore.screens
    .map(screen => screen.routing?.route)
    .filter(x => x != null)
    .sort()

  const addSubLink = () => {
    subLinks = [...subLinks, {}]
  }

  const removeSubLink = id => {
    subLinks = subLinks.filter(link => link.id !== id)
  }

  const saveSubLinks = () => {
    onChange(subLinks)
    drawer.hide()
  }

  const updateSubLinks = e => {
    subLinks = e.detail.items
  }
</script>

<Drawer bind:this={drawer} title={drawerTitle} on:drawerShow on:drawerHide>
  <Button cta slot="buttons" on:click={saveSubLinks}>Save</Button>
  <DrawerContent slot="body">
    <div class="container">
      <Layout noPadding gap="S">
        {#if subLinks?.length}
          <div
            class="subLinks"
            use:dndzone={{
              items: subLinks,
              flipDurationMs,
              dropTargetStyle: { outline: "none" },
            }}
            on:consider={updateSubLinks}
            on:finalize={updateSubLinks}
          >
            {#each subLinks as subLink (subLink.id)}
              <div class="subLink" animate:flip={{ duration: flipDurationMs }}>
                <Icon name="DragHandle" size="XL" />
                <Input bind:value={subLink.text} placeholder="Text" />
                <DrawerBindableCombobox
                  value={subLink.url}
                  on:change={e => (subLink.url = e.detail)}
                  placeholder="Link"
                  options={urlOptions}
                  {bindings}
                  appendBindingsAsOptions={false}
                />
                <Icon
                  name="Close"
                  hoverable
                  size="S"
                  on:click={() => removeSubLink(subLink.id)}
                />
              </div>
            {/each}
          </div>
        {/if}
        <div>
          <ActionButton quiet icon="Add" on:click={addSubLink}>
            Add link
          </ActionButton>
        </div>
      </Layout>
    </div>
  </DrawerContent>
</Drawer>

<div class="button">
  <ActionButton on:click={drawer.show}>{buttonText}</ActionButton>
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
  .subLinks {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
  }
  .subLink {
    gap: var(--spacing-l);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: var(--border-radius-s);
    transition: background-color ease-in-out 130ms;
  }
  .subLink:hover {
    background-color: var(--spectrum-global-color-gray-100);
  }
  .subLink > :global(.spectrum-Form-item) {
    flex: 1 1 auto;
    width: 0;
  }
</style>
