import "@spectrum-css/vars/dist/spectrum-global.css"
import "@spectrum-css/vars/dist/spectrum-medium.css"
import "@spectrum-css/vars/dist/spectrum-large.css"
import "@spectrum-css/vars/dist/spectrum-lightest.css"
import "@spectrum-css/vars/dist/spectrum-light.css"
import "@spectrum-css/vars/dist/spectrum-dark.css"
import "@spectrum-css/vars/dist/spectrum-darkest.css"
import "@spectrum-css/page/dist/index-vars.css"

import loadSpectrumIcons from "@budibase/bbui/spectrum-icons-rollup.js"
loadSpectrumIcons()

// Non user-facing components
export { default as Placeholder } from "./Placeholder.svelte"

// User facing components
export { default as container } from "./Container.svelte"
export { default as section } from "./Section.svelte"
export { default as dataprovider } from "./DataProvider.svelte"
export { default as screenslot } from "./ScreenSlot.svelte"
export { default as button } from "./Button.svelte"
export { default as repeater } from "./Repeater.svelte"
export { default as text } from "./Text.svelte"
export { default as layout } from "./Layout.svelte"
export { default as link } from "./Link.svelte"
export { default as heading } from "./Heading.svelte"
export { default as image } from "./Image.svelte"
export { default as embed } from "./Embed.svelte"
export { default as icon } from "./Icon.svelte"
export { default as backgroundimage } from "./BackgroundImage.svelte"
export { default as daterangepicker } from "./DateRangePicker.svelte"
export { default as cardstat } from "./CardStat.svelte"
export { default as spectrumcard } from "./SpectrumCard.svelte"
export * from "./charts"
export * from "./forms"
export * from "./table"

// Deprecated component left for compatibility in old apps
export { default as navigation } from "./deprecated/Navigation.svelte"
export { default as cardhorizontal } from "./deprecated/CardHorizontal.svelte"
export { default as stackedlist } from "./deprecated/StackedList.svelte"
export { default as card } from "./deprecated/Card.svelte"
