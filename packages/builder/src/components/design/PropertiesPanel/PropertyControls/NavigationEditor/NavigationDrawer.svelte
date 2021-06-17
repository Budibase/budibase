<script>
  import {
    Button,
    Icon,
    DrawerContent,
    Layout,
    Input,
    Combobox,
  } from "@budibase/bbui"
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { generate } from "shortid"
  import { store } from "builderStore"

  export let links = []

  const flipDurationMs = 150

  $: urlOptions = $store.screens
    .map(screen => screen.routing?.route)
    .filter(x => x != null)

  const addLink = () => {
    links = [...links, { id: generate() }]
  }

  const removeLink = id => {
    links = links.filter(link => link.id !== id)
  }

  const updateLinks = e => {
    links = e.detail.items
  }
</script>

<DrawerContent>
  <div class="container">
    <Layout>
      {#if links?.length}
        <div
          class="links"
          use:dndzone={{
            items: links,
            flipDurationMs,
            dropTargetStyle: { outline: "none" },
          }}
          on:finalize={updateLinks}
          on:consider={updateLinks}
        >
          {#each links as link (link.id)}
            <div class="link" animate:flip={{ duration: flipDurationMs }}>
              <Icon name="DragHandle" size="XL" />
              <Input bind:value={link.text} placeholder="Text" />
              <Combobox
                bind:value={link.url}
                placeholder="URL"
                options={urlOptions}
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
      <div class="button-container">
        <Button secondary icon="Add" on:click={addLink}>Add Link</Button>
      </div>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 600px;
    margin: var(--spacing-m) auto;
  }
  .links {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
  }
  .link {
    padding: 4px 8px;
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
  .button-container {
    margin-left: var(--spacing-l);
  }
</style>
