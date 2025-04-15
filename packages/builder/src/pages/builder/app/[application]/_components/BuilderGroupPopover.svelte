<script>
  import { Icon } from "@budibase/bbui"
  import { helpers } from "@budibase/shared-core"

  export let groups = []
  function tooltip(groups) {
    const sortedNames = groups
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(group => group.name)
    return `Member of ${helpers.lists.punctuateList(sortedNames)}`
  }
</script>

<div class="icon">
  <Icon
    name="Info"
    size="XS"
    color="grey"
    hoverable
    tooltip={tooltip(groups)}
    tooltipPosition="top"
  />
</div>

<style>
  .icon {
    height: auto;
    display: flex;
    justify-content: center;
  }
</style>
