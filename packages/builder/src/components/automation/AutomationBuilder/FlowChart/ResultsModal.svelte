<script>
  import { ModalContent, Icon, Detail, TextArea, Label } from "@budibase/bbui"

  export let testResult
  export let isTrigger
  let inputToggled
  let outputToggled
</script>

<ModalContent
  showCloseIcon={false}
  showConfirmButton={false}
  cancelText="Close"
>
  <div slot="header" class="result-modal-header">
    <span>Test Results</span>
    <div>
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
  <span>
    {#if testResult[0].outputs.iterations}
      <div style="display: flex;">
        <Icon name="Reuse" />
        <div style="margin-left: 10px;">
          <Label>
            This loop ran {testResult[0].outputs.iterations} times.</Label
          >
        </div>
      </div>
    {/if}
  </span>
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
  .result-modal-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

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
