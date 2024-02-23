<script>
  import {
    Icon,
    Body,
    Modal,
    ModalContent,
    Button,
    Label,
    Input,
  } from "@budibase/bbui"
  import DeletePluginModal from "../_components/DeletePluginModal.svelte"

  export let plugin

  let detailsModal
  let deleteModal

  let icon =
    plugin.schema.type === "component"
      ? plugin.schema.schema.icon || "Book"
      : plugin.schema.schema.icon || "Beaker"

  $: friendlyName = plugin?.schema?.schema?.friendlyName

  function pluginDeleted() {
    if (detailsModal) {
      detailsModal.hide()
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="row" on:click={() => detailsModal.show()}>
  <div class="title">
    <div class="name">
      <div>
        <Icon size="M" name={icon} />
      </div>
      <div>
        <Body
          size="S"
          color="var(--spectrum-global-color-gray-900)"
          weight="800"
        >
          {plugin.name}
        </Body>
        <Body size="XS" color="var(--spectrum-global-color-gray-900)">
          {friendlyName}
        </Body>
      </div>
    </div>
  </div>
  <div class="desktop">{plugin.version}</div>
  <div class="desktop">
    {plugin.schema.type.charAt(0).toUpperCase() + plugin.schema.type.slice(1)}
  </div>
  <div>
    <Icon name="ChevronRight" />
  </div>
</div>

<Modal bind:this={detailsModal}>
  <ModalContent
    size="M"
    title="Plugin details"
    showConfirmButton={false}
    showCancelButton={false}
  >
    <div class="details-row">
      <Label size="M">Name</Label>
      <Input disabled value={plugin.name} />
    </div>

    <div class="details-row">
      <Label size="M">Friendly name</Label>
      <Input disabled value={friendlyName} />
    </div>

    <div class="details-row">
      <Label size="M">Type</Label>
      <Input
        disabled
        value={plugin.schema.type.charAt(0).toUpperCase() +
          plugin.schema.type.slice(1)}
      />
    </div>
    <div class="details-row">
      <Label size="M">Source</Label>
      <Input disabled value={plugin.source || "N/A"} />
    </div>
    <div class="details-row">
      <Label size="M">Version</Label>
      <Input disabled value={plugin.version} />
    </div>
    <div class="details-row">
      <Label size="M">License</Label>
      <Input disabled value={plugin.package.license} />
    </div>
    <div class="details-row">
      <Label size="M">Author</Label>
      <Input disabled value={plugin.package.author || "N/A"} />
    </div>

    <div class="footer" slot="footer">
      <Button on:click={deleteModal.show()} warning>Delete</Button>
    </div>
  </ModalContent>

  <Modal bind:this={deleteModal}>
    <DeletePluginModal {plugin} on:deleted={pluginDeleted} />
  </Modal>
</Modal>

<style>
  .row {
    display: grid;
    grid-template-columns: 1fr 110px 140px 20px;
    align-items: center;
    background: var(--background);
    border-radius: 4px;
    padding: 0 16px;
    height: 56px;
    background: var(--spectrum-global-color-gray-50);
    border: 1px solid var(--spectrum-global-color-gray-300);
    transition: background 130ms ease-out;
  }
  .row:hover {
    cursor: pointer;
    background: var(--spectrum-global-color-gray-75);
  }

  .name {
    grid-gap: var(--spacing-m);
    grid-template-columns: 75px 75px;
    align-items: center;
    display: flex;
  }

  .details-row {
    display: grid;
    grid-template-columns: 70px 1fr;
    grid-gap: var(--spacing-l) var(--spacing-l);
    align-items: center;
  }

  @media (max-width: 640px) {
    .desktop {
      display: none !important;
    }
  }

  .footer {
    display: flex;
    gap: var(--spacing-l);
  }
</style>
