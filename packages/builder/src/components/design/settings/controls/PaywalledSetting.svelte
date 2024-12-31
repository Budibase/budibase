<script>
  import { Tag, Tags } from "@budibase/bbui"
  import { getFormattedPlanName } from "@/helpers/planTitle"

  export let license

  $: title = getFormattedPlanName(license)
</script>

<div>
  <Tags>
    <Tag icon="LockClosed">{title}</Tag>
  </Tags>
</div>

<style>
  div {
    height: 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
</style>
