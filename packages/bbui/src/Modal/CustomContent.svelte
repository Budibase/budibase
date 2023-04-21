<script>
  import { getContext } from "svelte"
  import Context from "../context"

  import _ from "../../../builder/lang/i18n"

  const { hide } = getContext(Context.Modal)

  let count = 0
  const clicks = 5
  $: if (count === clicks) hide()
  $: remaining = clicks - count

  function increment() {
    count++
  }
</script>

<div on:click={increment}>
  {$_("bbui.src.Modal.Click")}
  {remaining}
  {$_("bbui.src.Modal.more")}{remaining === 1 ? "" : "s"}
  {$_("bbui.src.Modal.close")}
</div>

<style>
  div {
    padding: 40px;
    background-color: var(--purple);
    color: white;
    font-weight: bold;
    text-align: center;
    user-select: none;
    font-size: 20px;
  }
  div:hover {
    cursor: pointer;
  }
</style>
