<script>
  import { ActionButton } from "@budibase/bbui"

  const eject = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "e", ctrlKey: true })
    )
  }
</script>

<div>
  <ActionButton secondary on:click={eject}>Eject block</ActionButton>
</div>
