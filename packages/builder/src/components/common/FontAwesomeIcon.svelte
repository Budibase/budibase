<script context="module">
import { dom, library } from "@fortawesome/fontawesome-svg-core"
import { faDiscord, faGithub } from "@fortawesome/free-brands-svg-icons"
import {
  faArrowsAlt,
  faBold,
  faBook,
  faChevronLeft,
  faCircleCheck,
  faCircleInfo,
  faColumns,
  faEnvelope,
  faEye,
  faFileArrowUp,
  faGear,
  faHeading,
  faImage,
  faItalic,
  faLink,
  faListOl,
  faListUl,
  faLock,
  faPlay,
  faQuestionCircle,
  faQuoteLeft,
  faRectangleList,
  faXmark,
} from "@fortawesome/free-solid-svg-icons"

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
