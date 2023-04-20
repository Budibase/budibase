<script>
  import PanelHeader from "./PanelHeader.svelte"

  import { _ } from "../../../../../../../lang/i18n"

  export let onBack = () => {}
</script>

<div>
  <PanelHeader
    title={$_(
      "pages.builder.portal.apps.onboarding._components.DataPanel.Give_it_some_data"
    )}
    subtitle={$_(
      "pages.builder.portal.apps.onboarding._components.DataPanel.Not_ready"
    )}
    {onBack}
  />
  <slot />
</div>
