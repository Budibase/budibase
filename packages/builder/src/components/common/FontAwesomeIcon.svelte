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
    faCircleInfo,
    faBold,
    faItalic,
    faHeading,
    faQuoteLeft,
    faListUl,
    faListOl,
    faLink,
    faImage,
    faEye,
    faColumns,
    faArrowsAlt,
    faQuestionCircle,
    faCircleCheck,
    faGear,
    faRectangleList,
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
    faChevronLeft,
    faCircleInfo,
    faRectangleList,

    // -- Required for easyMDE use in the builder.
    faBold,
    faItalic,
    faHeading,
    faQuoteLeft,
    faListUl,
    faListOl,
    faLink,
    faImage,
    faEye,
    faColumns,
    faArrowsAlt,
    faQuestionCircle,
    // --

    faCircleCheck,
    faGear
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
