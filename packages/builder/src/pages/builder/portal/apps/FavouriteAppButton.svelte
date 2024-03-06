<script>
  import { Icon, TooltipPosition, TooltipType } from "@budibase/bbui"
  import { auth } from "stores/portal"

  export let app
  export let size = "S"
  export let position = TooltipPosition.Top
  export let noWrap = false
  export let hoverColor = "var(--ink)"
</script>

<Icon
  name={app?.favourite ? "Star" : "StarOutline"}
  hoverable
  color={app?.favourite ? "var(--spectrum-global-color-yellow-1000)" : null}
  tooltip={app?.favourite ? "Remove from favourites" : "Add to favourites"}
  tooltipType={TooltipType.Info}
  tooltipPosition={position}
  tooltipWrap={noWrap}
  {hoverColor}
  {size}
  on:click={async e => {
    e.stopPropagation()
    await auth.updateSelf({
      appFavourites: [app?.appId],
    })
  }}
  disabled={!app}
/>
