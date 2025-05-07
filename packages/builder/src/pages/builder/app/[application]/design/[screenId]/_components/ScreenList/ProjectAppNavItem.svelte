<script lang="ts">
  import { Icon } from "@budibase/bbui"
  import NavItem from "@/components/common/NavItem.svelte"
  import type { ProjectApp } from "@budibase/types"

  export let projectApp: ProjectApp
</script>

<NavItem
  on:contextmenu={() => {}}
  scrollable
  indentLevel={0}
  text={projectApp.name}
  showTooltip
>
  <Icon on:click={() => {}} size="S" hoverable name="MoreSmallList" />
  <div slot="icon">
    <Icon name={projectApp.icon} size="S" />
  </div>
</NavItem>
