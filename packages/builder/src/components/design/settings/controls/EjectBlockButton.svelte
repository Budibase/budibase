<script>
  import { _ } from "../../../../../lang/i18n"
  import { ActionButton } from "@budibase/bbui"

  const eject = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "e", ctrlKey: true })
    )
  }
</script>

<div>
  <ActionButton secondary on:click={eject}
    >{$_(
      "components.design.settings.controls.EjectBlockButton.Eject_block"
    )}</ActionButton
  >
</div>
