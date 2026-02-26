<script lang="ts">
  import "@spectrum-css/toast/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { onMount, tick } from "svelte"
  import { notifications } from "../Stores/notifications"
  import Notification from "./Notification.svelte"
  import { fly } from "svelte/transition"

  let portalTargetReady = false
  onMount(() => {
    const delays = [0, 50, 100, 200, 500]
    const tryMount = (i: number) => {
      if (document.querySelector(".modal-container")) {
        portalTargetReady = true
        return
      }
      if (i < delays.length) {
        setTimeout(() => tryMount(i + 1), delays[i])
      }
    }
    tick().then(() => tryMount(0))
  })
</script>

{#if portalTargetReady}
  <Portal target=".modal-container">
    <div class="notifications">
      {#each $notifications as { type, icon, message, id, dismissable, action, actionMessage, wide } (id)}
        <div transition:fly={{ y: 30 }}>
          <Notification
            {type}
            {icon}
            {message}
            {dismissable}
            {action}
            {actionMessage}
            {wide}
            on:dismiss={() => notifications.dismiss(id)}
          />
        </div>
      {/each}
    </div>
  </Portal>
{/if}

<style>
  .notifications {
    position: fixed;
    bottom: 40px;
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
    gap: 10px;
  }
</style>
