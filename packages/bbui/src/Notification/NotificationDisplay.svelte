<script>
  import "@spectrum-css/toast/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { flip } from "svelte/animate"
  import { fly } from "svelte/transition"
  import { notifications } from "../Stores/notifications"
</script>

<Portal target=".modal-container">
  <div class="notifications">
    {#each $notifications as { type, icon, message, id } (id)}
      <div
        animate:flip
        transition:fly={{ y: -30 }}
        class="spectrum-Toast spectrum-Toast--{type} notification-offset"
      >
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
          <div class="spectrum-Toast-content">{message}</div>
        </div>
      </div>
    {/each}
  </div>
</Portal>

<style>
  .notifications {
    position: fixed;
    top: 10px;
    left: 0;
    right: 0;
    margin: 0 auto;
    padding: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    pointer-events: none;
  }
  .notification-offset {
    margin-bottom: 10px;
  }
</style>
