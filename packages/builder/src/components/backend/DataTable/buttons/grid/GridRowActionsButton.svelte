<script>
  import { ActionButton } from "@budibase/bbui"
  import DetailPopover from "components/common/DetailPopover.svelte"
</script>

<DetailPopover title="Row Actions">
  <svelte:fragment slot="anchor" let:open>
    <ActionButton icon="Engagement" selected={open} quiet>
      Row Actions
    </ActionButton>
  </svelte:fragment>
</DetailPopover>
