<script>
  import "@spectrum-css/toast/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { notifications } from "../Stores/notifications"
  import Notification from "./Notification.svelte"
  import { fly } from "svelte/transition"
</script>

<Portal target=".modal-container">
  <div class="notifications">
    {#each $notifications as { type, icon, message, id, dismissable } (id)}
      <div transition:fly={{ y: -30 }}>
        <Notification
          {type}
          {icon}
          {message}
          {dismissable}
          on:dismiss={() => notifications.dismiss(id)}
        />
      </div>
    {/each}
  </div>
</Portal>

<style>
  .notifications {
    position: fixed;
    top: 20px;
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
