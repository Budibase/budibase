<script>
  import { ActionButton } from "@budibase/bbui"
  import DetailPopover from "components/common/DetailPopover.svelte"
</script>

<DetailPopover title="Automations">
  <svelte:fragment slot="anchor" let:open>
    <ActionButton icon="JourneyVoyager" selected={open} quiet>
      Automations
    </ActionButton>
  </svelte:fragment>
</DetailPopover>
