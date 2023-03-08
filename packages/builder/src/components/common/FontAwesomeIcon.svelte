<script context="module">
  import { dom, library } from "@fortawesome/fontawesome-svg-core"
  import {
    faEnvelope,
    faXmark,
    faBook,
    faPlay,
    faLock,
    faFileArrowUp,
    faChevronLeft,
  } from "@fortawesome/free-solid-svg-icons"
  import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons"

  library.add(
    faXmark,
    faBook,
    faPlay,
    faLock,
    faGithub,
    faDiscord,
    faEnvelope,
    faFileArrowUp,
    faChevronLeft
  )
  dom.watch()
</script>

<script>
  export let name
</script>

<span>
  <i class={name} />
</span>

<style>
  span {
    display: contents;
    color: var(--spectrum-global-color-gray-900);
  }
</style>
