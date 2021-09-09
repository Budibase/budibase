<script>
  import { ModalContent, Tabs, Tab, TextArea, Label } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import AutomationBlockSetup from "../../SetupPanel/AutomationBlockSetup.svelte"
  import { cloneDeep } from "lodash/fp"

  let trigger = cloneDeep($automationStore.automation?.defintion.trigger)
</script>

<ModalContent
  title="Add test data"
  confirmText="Save"
  showConfirmButton={true}
  cancelText="Cancel"
>
  <div class="tabs-positioning">
    <Tabs selected="Form" quiet
      ><Tab icon="Form" title="Form"
        ><AutomationBlockSetup block={trigger} /></Tab
      >>
      <Tab icon="FileJson" title="JSON">
        <Label>JSON</Label><TextArea />
      </Tab>
    </Tabs>
  </div>
</ModalContent>
