<script>
  import { notificationStore } from "builderStore/store/notifications"
  import { onMount, onDestroy } from "svelte"
  import { fade } from "svelte/transition"

  export let themes = {
    danger: "#bb2124",
    success: "#22bb33",
    warning: "#f0ad4e",
    info: "#5bc0de",
    default: "#aaaaaa",
  }

  export let timeout = 3000

  let count = 0
  let notifications = []
  let unsubscribe

  function createToast(msg, theme, to) {
    const background = themes[theme] || themes["default"]
    const id = count
    notifications = [
      {
        id,
        msg,
        background,
        timeout: to || timeout,
        width: "100%",
      },
      ...notifications,
    ]
    setTimeout(() => removeNotification(id), to || timeout)
    count = count + 1
  }

  unsubscribe = notificationStore.subscribe(value => {
    if (!value) {
      return
    }
    createToast(value.message, value.type, value.timeout)
    notificationStore.set()
  })

  onDestroy(unsubscribe)

  function removeNotification(id) {
    notifications = notifications.filter(t => t.id != id)
  }
</script>

<ul class="notifications">
  {#each notifications as toast (toast.id)}
    <li class="toast" style="background: {toast.background};" out:fade>
      <div class="content">{toast.msg}</div>
    </li>
  {/each}
</ul>

<style>
  :global(.notifications) {
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

  :global(.notifications) > .toast {
    position: relative;
    margin: 10px;
    min-width: 40vw;
    position: relative;
    animation: animate-in 350ms forwards;
    color: #fff;
  }

  :global(.notifications) > .toast > .content {
    padding: 10px;
    display: block;
    font-weight: 500;
  }

  :global(.notifications) > .toast:before,
  :global(.notifications) > .toast:after {
    content: "";
    position: absolute;
    z-index: -1;
    top: 50%;
    bottom: 0;
    left: 10px;
    right: 10px;
    border-radius: 100px / 10px;
  }

  :global(.notifications) > .toast:after {
    right: 10px;
    left: auto;
    transform: skew(8deg) rotate(3deg);
  }

  @keyframes animate-in {
    0% {
      width: 0;
      opacity: 0;
      transform: scale(1.15) translateY(20px);
    }
    100% {
      width: 40vw;
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
</style>
