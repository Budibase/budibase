<script lang="ts">
  import "@spectrum-css/inlinealert/dist/index-vars.css"
  import Button from "../Button/Button.svelte"
  import Icon from "../Icon/Icon.svelte"

  export let type: "info" | "error" | "success" | "help" | "negative" = "info"
  export let header: string = ""
  export let message: string = ""
  export let onConfirm: (() => void) | undefined = undefined
  export let buttonText: string = ""
  export let cta: boolean = false
  export let link: string = ""
  export let linkText: string = ""

  $: icon = selectIcon(type)
  // if newlines used, convert them to different elements
  $: split = message.split("\n")

  function selectIcon(alertType: string): string {
    switch (alertType) {
      case "error":
      case "negative":
        return "warning"
      case "success":
        return "check-circle"
      case "help":
        return "question"
      default:
        return "info"
    }
  }
</script>

<div class="spectrum-InLineAlert spectrum-InLineAlert--{type}">
  <Icon name={icon} size="M" />
  <div class="spectrum-InLineAlert-header">{header}</div>
  <slot>
    {#each split as splitMsg}
      <div class="spectrum-InLineAlert-content">{splitMsg}</div>
    {/each}
  </slot>
  {#if onConfirm}
    <div class="spectrum-InLineAlert-footer button">
      <Button {cta} secondary={cta ? false : true} on:click={onConfirm}
        >{buttonText || "OK"}</Button
      >
    </div>
  {/if}
  {#if link && linkText}
    <div id="docs-link">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        class="docs-link"
      >
        {linkText}
        <Icon name="arrow-square-out" size="XS" />
      </a>
    </div>
  {/if}
</div>

<style>
  .button {
    margin-top: 10px;
  }
  .spectrum-InLineAlert {
    --spectrum-semantic-negative-border-color: #e34850;
    --spectrum-semantic-positive-border-color: #2d9d78;
    --spectrum-semantic-positive-icon-color: #2d9d78;
    --spectrum-semantic-negative-icon-color: #e34850;
    min-width: 100px;
    margin: 0;
    border-width: 1px;
  }

  a {
    color: white;
  }

  #docs-link {
    padding-top: 10px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  #docs-link > * {
    display: flex;
    align-items: center;
    gap: 5px;
  }
</style>
