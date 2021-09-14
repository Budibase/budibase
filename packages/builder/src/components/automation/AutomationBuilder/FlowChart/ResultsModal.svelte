<script>
  import { ModalContent, Icon, Detail, Badge, TextArea } from "@budibase/bbui"

  export let testResult
  let inputToggled
  let outputToggled
</script>

<ModalContent
  showCloseIcon={false}
  showConfirmButton={false}
  title="Test Automation"
  cancelText="Close"
>
  <div slot="header">
    <div style="float: right;">
      <Badge red><Icon size="S" name="CheckmarkCircle" /></Badge>
    </div>
  </div>

  <div
    on:click={() => {
      inputToggled = !inputToggled
    }}
    class="toggle splitHeader"
  >
    <div>
      <div style="display: flex; align-items: center;">
        <span style="padding-left: var(--spacing-s);">
          <Detail size="S">Input</Detail>
        </span>
      </div>
    </div>
    <div>
      {#if inputToggled}
        <Icon size="M" name="ChevronDown" />
      {:else}
        <Icon size="M" name="ChevronRight" />
      {/if}
    </div>
  </div>
  {#if inputToggled}
    <TextArea disabled value={JSON.stringify(testResult[0].inputs, null, 2)} />
  {/if}

  <div
    on:click={() => {
      outputToggled = !outputToggled
    }}
    class="toggle splitHeader"
  >
    <div>
      <div style="display: flex; align-items: center;">
        <span style="padding-left: var(--spacing-s);">
          <Detail size="S">Output</Detail>
        </span>
      </div>
    </div>
    <div>
      {#if outputToggled}
        <Icon size="M" name="ChevronDown" />
      {:else}
        <Icon size="M" name="ChevronRight" />
      {/if}
    </div>
  </div>
  {#if outputToggled}
    <TextArea disabled value={JSON.stringify(testResult[0].outputs, null, 2)} />
  {/if}
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
