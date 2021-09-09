<script>
  import { ModalContent, Icon, Detail } from "@budibase/bbui"

  let inputToggled
  let outputToggled
</script>

<ModalContent
  showCloseIcon={false}
  showConfirmButton={false}
  title="Test Automation"
  cancelText="Close"
>
  <div class="splitHeader">
    <div
      on:click={() => {
        inputToggled = !inputToggled
      }}
      class="toggle"
    >
      {#if inputToggled}
        <Icon size="M" name="ChevronDown" />
      {:else}
        <Icon size="M" name="ChevronRight" />
      {/if}
      <Detail size="S">Input</Detail>
    </div>
  </div>

  <div class="splitHeader">
    <div
      on:click={() => {
        outputToggled = !outputToggled
      }}
      class="toggle"
    >
      {#if outputToggled}
        <Icon size="M" name="ChevronDown" />
      {:else}
        <Icon size="M" name="ChevronRight" />
      {/if}
      <Detail size="S">Output</Detail>
    </div>
  </div>
</ModalContent>

<style>
  .splitHeader {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
  }

  .toggle {
    display: flex;
    align-items: center;
  }
</style>
