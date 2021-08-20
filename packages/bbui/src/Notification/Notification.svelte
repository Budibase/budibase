<script>
  export let type = "info"
  export let icon = "Info"
  export let message = ""
</script>

<div class="spectrum-Toast spectrum-Toast--{type}">
  {#if icon}
    <svg
      class="spectrum-Icon spectrum-Icon--sizeM spectrum-Toast-typeIcon"
      focusable="false"
      aria-hidden="true"
    >
      <use xlink:href="#spectrum-icon-18-{icon}" />
    </svg>
  {/if}
  <div class="spectrum-Toast-body">
    <div class="spectrum-Toast-content">{message || ""}</div>
  </div>
</div>
