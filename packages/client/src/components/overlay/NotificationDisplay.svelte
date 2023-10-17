<script>
  import { notificationStore } from "stores"
  import { Notification } from "@budibase/bbui"
  import { fly } from "svelte/transition"
</script>

<div class="notifications">
  {#if $notificationStore}
    {#each $notificationStore as { type, icon, message, id, dismissable, count } (id)}
      <div
        in:fly={{
          duration: 300,
          y: -20,
          delay: $notificationStore.delay ? 300 : 0,
        }}
        out:fly={{ y: -20, duration: 150 }}
      >
        <Notification
          {type}
          message={count > 1 ? `(${count}) ${message}` : message}
          {icon}
          {dismissable}
          on:dismiss={() => notificationStore.actions.dismiss(id)}
        />
      </div>
    {/each}
  {/if}
</div>

<style>
  .notifications {
    position: fixed;
    top: 20px;
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
  .notifications :global(.spectrum-Toast) {
    width: 400px;
    max-width: 100vw;
  }
</style>
