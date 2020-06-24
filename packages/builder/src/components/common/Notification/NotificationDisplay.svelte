<script>
  import { notificationStore } from "builderStore/store/notifications"
  import { onMount, onDestroy } from "svelte"
  import { fade } from "svelte/transition"

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
        state.notifications.shift();
        state.notifications = state.notifications
        return state;
      })
    }, timeout)
  } 
</script>

<ul class="notifications">
  {#each $notificationStore.notifications as notification (notification.id)}
    <li class="toast" style="background: {themes[notification.type]};" transition:fade>
      <div class="content">{notification.message}</div>
      {#if notification.icon}
        <i class={notification.icon} />
      {/if}
    </li>
  {/each}
</ul>

<style>
  .notifications {
    width: 40vw;
    list-style: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    padding: 0;
    z-index: 9999;
  }

  .toast {
    margin-bottom: 10px;
  }

  .content {
    padding: 10px;
    display: block;
    font-weight: 500;
  }
</style>
