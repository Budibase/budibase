<script context="module">
  import { dom, library } from "@fortawesome/fontawesome-svg-core"
  import {
    faEnvelope,
    faXmark,
    faBook,
    faPlay,
    faLock,
  } from "@fortawesome/free-solid-svg-icons"
  import { faGithub, faDiscord } from "@fortawesome/free-brands-svg-icons"

  library.add(faXmark, faBook, faPlay, faLock, faGithub, faDiscord, faEnvelope)
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
  }
  .svg-inline--fa {
    color: var(--spectrum-body-m-text-color, var(--spectrum-alias-text-color));
  }
</style>
