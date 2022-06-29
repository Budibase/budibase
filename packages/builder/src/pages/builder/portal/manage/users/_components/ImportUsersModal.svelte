<script>
  import { Body, ModalContent, RadioGroup, Multiselect } from "@budibase/bbui"
  import { groups } from "stores/portal"

  import { Constants } from "@budibase/frontend-core"
</script>

<ModalContent
  size="M"
  title="Import users"
  confirmText="Done"
  showCancelButton={false}
  cancelText="Cancel"
  showCloseIcon={false}
>
  <Body size="S">Import your users email addrresses from a CSV</Body>

  <div class="container">
    <div class="inner">
      <Body size="S">Upload</Body>
    </div>
  </div>

  <RadioGroup options={Constants.BuilderRoleDescriptions} />

  <Multiselect
    placeholder="Select User Groups"
    label="User Groups"
    options={$groups}
    getOptionLabel={option => option.name}
    getOptionValue={option => option.name}
  />
</ModalContent>

<style>
  .inner {
    display: flex;
  }

  :global(.spectrum-Picker) {
    border-top-left-radius: 0px;
  }

  .container {
    width: 100%;
    height: var(--spectrum-alias-item-height-l);
    background: var(--spectrum-global-color-gray-200);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
