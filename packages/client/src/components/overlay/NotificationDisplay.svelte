<script>
  import { notificationStore } from "stores"
  import { Notification } from "@budibase/bbui"
  import { fly } from "svelte/transition"
</script>

<div class="notifications">
  {#if $notificationStore}
    {#key $notificationStore.id}
      <div
        in:fly={{
          duration: 300,
          y: -20,
          delay: $notificationStore.delay ? 300 : 0,
        }}
        out:fly={{ y: -20, duration: 150 }}
      >
        <Notification
          type={$notificationStore.type}
          message={$notificationStore.message}
          icon={$notificationStore.icon}
          dismissable={$notificationStore.dismissable}
          on:dismiss={notificationStore.actions.dismiss}
        />
      </div>
    {/key}
  {/if}
</div>

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
  }
</style>
