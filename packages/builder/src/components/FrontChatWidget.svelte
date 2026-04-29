<script>
  import { admin } from "@/stores/portal/admin"

  const FRONT_CHAT_SCRIPT_ID = "bb-front-chat-script"
  const FRONT_CHAT_CHAT_ID = "427a98ae36e3cdbcc09105d823da8f56"

  let hasInitialised = false
  // $admin.cloud <- add to if statement later
  $: if (true) {
    initFrontChat()
  }

  function initFrontChat() {
    if (hasInitialised || window.__bbFrontChatInitialised) {
      return
    }

    if (typeof window.FrontChat === "function") {
      window.FrontChat("init", {
        chatId: FRONT_CHAT_CHAT_ID,
        useDefaultLauncher: true,
      })
      hasInitialised = true
      window.__bbFrontChatInitialised = true
      return
    }

    const existingScript = document.getElementById(FRONT_CHAT_SCRIPT_ID)
    if (existingScript) {
      return
    }

    const script = document.createElement("script")
    script.id = FRONT_CHAT_SCRIPT_ID
    script.src = "https://chat-assets.frontapp.com/v1/chat.bundle.js"
    script.onload = () => {
      if (typeof window.FrontChat === "function") {
        window.FrontChat("init", {
          chatId: FRONT_CHAT_CHAT_ID,
          useDefaultLauncher: true,
        })
        hasInitialised = true
        window.__bbFrontChatInitialised = true
      }
    }
    document.head.appendChild(script)
  }
</script>
