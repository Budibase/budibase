<script>
  import { notificationStore } from "builderStore/store/notifications"
  import { onMount, onDestroy } from "svelte"
  import { fly } from "svelte/transition"

  export let themes = {
    danger: "#E26D69",
    success: "#84C991",
    warning: "#f0ad4e",
    info: "#5bc0de",
    default: "#aaaaaa",
  }

  export let timeout = 3000

  $: if ($notificationStore.notifications.length) {
    setTimeout(() => {
      notificationStore.update(state => {
        state.notifications.shift()
        state.notifications = state.notifications
        return state
      })
    }, timeout)
  }
</script>

<div class="notifications">
  {#each $notificationStore.notifications as notification (notification.id)}
    <div
      class="toast"
      style="background: {themes[notification.type]};"
      transition:fly={{ y: -30 }}>
      <div class="content">{notification.message}</div>
      {#if notification.icon}<i class={notification.icon} />{/if}
    </div>
  {/each}
</div>

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

  .toast {
    flex: 0 0 auto;
    margin-bottom: 10px;
    border-radius: var(--border-radius-s);
    /* The toasts now support being auto sized, so this static width could be removed */
    width: 40vw;
  }

  .content {
    padding: 10px;
    display: block;
    color: var(--white);
    font-weight: 500;
  }
</style>
