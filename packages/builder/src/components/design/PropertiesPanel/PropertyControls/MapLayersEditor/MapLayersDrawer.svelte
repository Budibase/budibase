<script>
  import {
    DrawerContent,
    Layout,
    Input,
    Label,
    Body,
    Button,
    Select,
    Icon,
  } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { dndzone } from "svelte-dnd-action"
  import { flip } from "svelte/animate"
  import { generate } from "shortid"

  export let tileLayers = []
  export let bindableProperties = []

  const types = ["XYZ", "WMS"]

  $: tileLayers.forEach(tileLayer => {
    if (!tileLayer.id) {
      tileLayer.id = generate()
    }
  })

  const addLayer = () => {
    tileLayers = [...tileLayers, {}]
  }

  const removeLayer = id => {
    tileLayers = tileLayers.filter(tileLayer => tileLayer.id !== id)
  }

  const flipDurationMs = 150
  let dragDisabled = true

  const handleFinalize = e => {
    updateLayersOrder(e)
    dragDisabled = true
  }

  const updateLayersOrder = e => {
    tileLayers = e.detail.items
  }
</script>

<DrawerContent>
  <div class="container">
    <Layout noPadding gap="S">
      {#if tileLayers?.length}
        <Layout noPadding gap="XS">
          <div class="column">
            <div />
            <Label size="L">Type</Label>
            <Label size="L">URL</Label>
            <Label size="L">Leaflet Options</Label>
            <Label size="L">Visibility</Label>
            <div />
          </div>
          <div
            class="columns"
            use:dndzone={{
              items: tileLayers,
              flipDurationMs,
              dropTargetStyle: { outline: "none" },
              dragDisabled,
            }}
            on:finalize={handleFinalize}
            on:consider={updateLayersOrder}
          >
            {#each tileLayers as tileLayer (tileLayer.id)}
              <div class="column" animate:flip={{ duration: flipDurationMs }}>
                <div
                  class="handle"
                  aria-label="drag-handle"
                  style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
                  on:mousedown={() => (dragDisabled = false)}
                >
                  <Icon name="DragHandle" size="XL" />
                </div>
                <Select
                  bind:value={tileLayer.type}
                  placeholder="Type"
                  options={types}
                  on:change={e => (tileLayer.type = e.detail)}
                />
                <Input bind:value={tileLayer.url} placeholder="URL" />
                <DrawerBindableInput
                  value={tileLayer.leafletOptions}
                  on:change={e => (tileLayer.leafletOptions = e.detail)}
                  placeholder={'{ attributions: "" }'}
                />
                <DrawerBindableInput
                  value={tileLayer.visibility}
                  on:change={e => (tileLayer.visibility = e.detail)}
                  placeholder={"{{ Visibility }}"}
                  bindings={bindableProperties}
                />
                <Icon
                  name="Close"
                  hoverable
                  size="S"
                  on:click={() => removeLayer(tileLayer.id)}
                  disabled={tileLayers.length === 1}
                />
              </div>
            {/each}
          </div>
        </Layout>
      {:else}
        <div class="column">
          <div class="wide">
            <Body size="S">
              You can control the order of rendering of your overlay layers of
              your map, and bind their visibility.
            </Body>
          </div>
        </div>
      {/if}
      <div class="column">
        <div class="buttons wide">
          <Button secondary icon="Add" on:click={addLayer}>Add layer</Button>
        </div>
      </div>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
  }

  .columns {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
  }

  .column {
    gap: var(--spacing-l);
    display: grid;
    grid-template-columns: 20px 80px 1fr 1fr 1fr auto;
    align-items: center;
    border-radius: var(--border-radius-s);
    transition: background-color ease-in-out 130ms;
    padding-right: 10px;
  }

  .handle {
    display: grid;
    place-items: center;
  }

  .column:hover {
    background-color: var(--spectrum-global-color-gray-100);
  }

  .wide {
    grid-column: 2 / -1;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>
