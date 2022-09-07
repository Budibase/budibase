<script>
  import {
    Icon,
    Body,
    Modal,
    ModalContent,
    Button,
    Label,
    Input,
    Dropzone,
  } from "@budibase/bbui"
  import DeletePluginModal from "../_components/DeletePluginModal.svelte"
  import { plugins } from "stores/portal"

  export let plugin

  let detailsModal
  let deleteModal
  let updateModal

  let file
  let icon =
    plugin.schema.type === "component"
      ? plugin.schema.schema.icon || "Book"
      : plugin.schema.schema.icon || "Beaker"

  async function save() {
    let update = true
    await plugins.uploadPlugin(file, plugin.source, update)
  }
</script>

<div class="row">
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
      </div>
    </div>
  </div>
  <div class="desktop">{plugin.version}</div>
  <div class="desktop">
    {plugin.schema.type.charAt(0).toUpperCase() + plugin.schema.type.slice(1)}
  </div>

  <div>
    <Icon on:click={detailsModal.show()} hoverable name="ChevronRight" />
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
      <Button newStyles on:click={deleteModal.show()} warning>Delete</Button>

      <Button
        on:click={() => {
          detailsModal.hide()
          updateModal.show()
        }}
        newStyles>Update</Button
      >
    </div>
  </ModalContent>

  <Modal bind:this={deleteModal}>
    <DeletePluginModal {plugin} />
  </Modal>
</Modal>

<Modal bind:this={updateModal}>
  <ModalContent
    size="M"
    title="Update Plugin"
    showConfirmButton={true}
    showCancelButton={true}
    cancelText="Back"
    onConfirm={() => save()}
    onCancel={() => {
      updateModal.hide()
      detailsModal.show()
    }}
  >
    {#if plugin.source === "File Upload"}
      <div class="form-row">
        <Label size="M">File Upload</Label>
      </div>
      <Dropzone
        gallery={false}
        value={[file]}
        on:change={e => {
          if (!e.detail || e.detail.length === 0) {
            file = null
          } else {
            file = e.detail[0]
          }
        }}
      />
    {/if}
  </ModalContent>
</Modal>

<style>
  .row {
    display: grid;
    grid-template-columns: 35% auto auto auto;
    align-items: center;
    background: var(--background);
    height: 50px;
    padding-left: 20px;
    padding-right: 20px;
    justify-content: space-between;
  }

  .name {
    grid-gap: var(--spacing-m);
    grid-template-columns: 75px 75px;
    align-items: center;
    display: flex;
  }

  .details-row {
    display: grid;
    grid-template-columns: 60px 1fr;
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

  .form-row {
    display: grid;
    grid-template-columns: 60px 1fr;
    grid-gap: var(--spacing-l);
    align-items: center;
  }
</style>
