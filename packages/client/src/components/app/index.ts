// Non user-facing components
export const Placeholder = () => import("./Placeholder.svelte")

// User facing components
export const container = () => import("./container/Container.svelte")
export const dataprovider = () => import("./DataProvider.svelte")
export const divider = () => import("./Divider.svelte")
export const screenslot = () => import("./ScreenSlot.svelte")
export const button = () => import("./Button.svelte")
export const buttongroup = () => import("./ButtonGroup.svelte")
export const repeater = () => import("./Repeater.svelte")
export const layout = () => import("./Layout.svelte")
export const link = () => import("./Link.svelte")
export const image = () => import("./Image.svelte")
export const embed = () => import("./Embed.svelte")
export const icon = () => import("./Icon.svelte")
export const iconphosphor = () => import("./IconV2.svelte")
export const backgroundimage = () => import("./BackgroundImage.svelte")
export const daterangepicker = () => import("./DateRangePicker.svelte")
export const cardstat = () => import("./CardStat.svelte")
export const spectrumcard = () => import("./SpectrumCard.svelte")
export const tag = () => import("./Tag.svelte")
export const embeddedmap = () => import("./embedded-map/EmbeddedMap.svelte")
export const sidepanel = () => import("./SidePanel.svelte")
export const modal = () => import("./Modal.svelte")
export const gridblock = () => import("./GridBlock.svelte")
export const textv2 = () => import("./Text.svelte")
export const filter = () => import("./filter/Filter.svelte")
export const accordion = () => import("./Accordion.svelte")
export const singlerowprovider = () => import("./SingleRowProvider.svelte")
export const codegenerator = () => import("./CodeGenerator.svelte")
export * from "./blocks"
export * from "./charts"
export * from "./dynamic-filter"
export * from "./forms"
export * from "./pdf"

// Deprecated component left for compatibility in old apps
export * from "./deprecated/table"
export const tableblock = () => import("./deprecated/TableBlock.svelte")
export const navigation = () => import("./deprecated/Navigation.svelte")
export const cardhorizontal = () => import("./deprecated/CardHorizontal.svelte")
export const stackedlist = () => import("./deprecated/StackedList.svelte")
export const card = () => import("./deprecated/Card.svelte")
export const section = () => import("./deprecated/Section.svelte")
export const text = () => import("./deprecated/Text.svelte")
export const heading = () => import("./deprecated/Heading.svelte")
export const markdownviewer = () => import("./deprecated/MarkdownViewer.svelte")
