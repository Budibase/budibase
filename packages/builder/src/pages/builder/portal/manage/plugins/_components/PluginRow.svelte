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
  import { plugins } from "stores/portal"

  export let plugin

  let detailsModal
</script>

<div class="row">
  <div class="title">
    <div class="name">
      <div>
        <Icon size="M" name={plugin.schema.schema.icon} />
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
    title="Plugin details"
    showConfirmButton={false}
    showCancelButton={false}
  >
    <div class="form-row">
      <Label size="M">Type</Label>
      <Input
        disabled
        value={plugin.schema.type.charAt(0).toUpperCase() +
          plugin.schema.type.slice(1)}
      />
    </div>
    <div class="form-row">
      <Label size="M">Source</Label>
      <Input disabled value={plugin.source} />
    </div>
    <div class="form-row">
      <Label size="M">Version</Label>
      <Input disabled value={plugin.version} />
    </div>
    <div class="form-row">
      <Label size="M">License</Label>
      <Input disabled value={plugin.package.license} />
    </div>
    <div class="form-row">
      <Label size="M">Author</Label>
      <Input disabled value={plugin.package.author || "N/A"} />
    </div>

    <div class="footer" slot="footer">
      <Button
        newStyles
        on:click={() => plugins.deletePlugin(plugin._id, plugin._rev)}
        warning>Delete</Button
      >

      <Button
        newStyles
        on:click={() => plugins.deletePlugin(plugin._id, plugin._rev)}
        >Update</Button
      >

      <Button cta newStyles on:click={detailsModal.hide()}>Done</Button>
    </div>
  </ModalContent>
</Modal>

<style>
  .row {
    display: grid;
    grid-template-columns: 0.3fr auto auto auto;
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

  .form-row {
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
</style>
