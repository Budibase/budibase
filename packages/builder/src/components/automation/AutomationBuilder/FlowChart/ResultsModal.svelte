<script>
  import { ModalContent, Icon, Detail, TextArea } from "@budibase/bbui"

  export let testResult
  export let isTrigger
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
      {#if isTrigger || testResult[0].outputs.success}
        <div class="iconSuccess">
          <Icon size="S" name="CheckmarkCircle" />
        </div>
      {:else}
        <div class="iconFailure">
          <Icon size="S" name="CloseCircle" />
        </div>
      {/if}
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
    <div class="text-area-container">
      <TextArea
        disabled
        value={JSON.stringify(testResult[0].inputs, null, 2)}
      />
    </div>
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
    <div class="text-area-container">
      <TextArea
        disabled
        value={JSON.stringify(testResult[0].outputs, null, 2)}
      />
    </div>
  {/if}
</ModalContent>

<style>
  .iconSuccess {
    color: var(--spectrum-global-color-green-600);
  }

  .iconFailure {
    color: var(--spectrum-global-color-red-600);
  }

  .splitHeader {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
  }

  .toggle {
    display: flex;
    align-items: center;
  }

  .text-area-container :global(textarea) {
    height: 150px;
  }
</style>
