import { helpers } from "@budibase/shared-core"
import dayjs from "dayjs"

export const deepGet = helpers.deepGet

/**
 * Generates a DOM safe UUID.
 * Starting with a letter is important to make it DOM safe.
 */
export function uuid(): string {
  return "cxxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Capitalises a string
 */
export const capitalise = (string?: string | null): string => {
  if (!string) {
    return ""
  }
  return string.substring(0, 1).toUpperCase() + string.substring(1)
}

/**
 * Computes a short hash of a string
 */
export const hashString = (string?: string | null): string => {
  if (!string) {
    return "0"
  }
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    let char = string.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

/**
 * Sets a key within an object. The key supports dot syntax for retrieving deep
 * fields - e.g. "a.b.c".
 * Exact matches of keys with dots in them take precedence over nested keys of
 * the same path - e.g. setting "a.b" of { "a.b": "foo", a: { b: "bar" } }
 * will override the value "foo" rather than "bar".
 * If a deep path is specified and the parent keys don't exist then these will
 * be created.
 */
export const deepSet = (
  obj: Record<string, any> | null,
  key: string | null,
  value: any
): void => {
  if (!obj || !key) {
    return
  }
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    obj[key] = value
    return
  }
  const split = key.split(".")
  for (let i = 0; i < split.length - 1; i++) {
    const nextKey = split[i]
    if (obj && obj[nextKey] == null) {
      obj[nextKey] = {}
    }
    obj = obj?.[nextKey]
  }
  if (!obj) {
    return
  }
  obj[split[split.length - 1]] = value
}

/**
 * Deeply clones an object. Functions are not supported.
 */
export const cloneDeep = <T>(obj: T): T => {
  if (!obj) {
    return obj
  }
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Copies a value to the clipboard
 */
export const copyToClipboard = (value: any): Promise<void> => {
  return new Promise(res => {
    if (navigator.clipboard && window.isSecureContext) {
      // Try using the clipboard API first
      navigator.clipboard.writeText(value).then(res)
    } else {
      // Fall back to the textarea hack
      let textArea = document.createElement("textarea")
      textArea.value = value
      textArea.style.position = "fixed"
      textArea.style.left = "-9999px"
      textArea.style.top = "-9999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand("copy")
      textArea.remove()
      res()
    }
  })
}

// Parse a date value. This is usually an ISO string, but can be a
// bunch of different formats and shapes depending on schema flags.
export const parseDate = (
  value: string | dayjs.Dayjs | null,
  { enableTime = true }
): dayjs.Dayjs | null => {
  // If empty then invalid
  if (!value) {
    return null
  }

  // Certain string values need transformed
  if (typeof value === "string") {
    // Check for time only values
    if (!isNaN(new Date(`0-${value}`).valueOf())) {
      value = `0-${value}`
    }

    // If date only, check for cases where we received a UTC string
    else if (!enableTime && value.endsWith("Z")) {
      value = value.split("Z")[0]
    }
  }

  // Parse value and check for validity
  const parsedDate = dayjs(value)
  if (!parsedDate.isValid()) {
    return null
  }

  // By rounding to the nearest second we avoid locking up in an endless
  // loop in the builder, caused by potentially enriching {{ now }} to every
  // millisecond.
  return dayjs(Math.floor(parsedDate.valueOf() / 1000) * 1000)
}

// Stringifies a dayjs object to create an ISO string that respects the various
// schema flags
export const stringifyDate = (
  value: null | dayjs.Dayjs,
  { enableTime = true, timeOnly = false, ignoreTimezones = false } = {}
): string | null => {
  if (!value) {
    return null
  }

  // Time only fields always ignore timezones, otherwise they make no sense.
  // For non-timezone-aware fields, create an ISO 8601 timestamp of the exact
  // time picked, without timezone
  const offsetForTimezone = (enableTime && ignoreTimezones) || timeOnly
  if (offsetForTimezone) {
    // Ensure we use the correct offset for the date
    const referenceDate = value.toDate()
    const offset = referenceDate.getTimezoneOffset() * 60000
    const date = new Date(value.valueOf() - offset)
    if (timeOnly) {
      // Extract HH:mm
      return date.toISOString().slice(11, 16)
    }
    return date.toISOString().slice(0, -1)
  }

  // For date-only fields, construct a manual timestamp string without a time
  // or time zone
  else if (!enableTime) {
    const year = value.year()
    const month = `${value.month() + 1}`.padStart(2, "0")
    const day = `${value.date()}`.padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Otherwise use a normal ISO string with time and timezone
  else {
    return value.toISOString()
  }
}

// Determine the dayjs-compatible format of the browser's default locale
const getPatternForPart = (part: Intl.DateTimeFormatPart): string => {
  switch (part.type) {
    case "day":
      return "D".repeat(part.value.length)
    case "month":
      return "M".repeat(part.value.length)
    case "year":
      return "Y".repeat(part.value.length)
    case "literal":
      return part.value
    default:
      console.log("Unsupported date part", part)
      return ""
  }
}
const localeDateFormat = new Intl.DateTimeFormat()
  .formatToParts(new Date("2021-01-01"))
  .map(getPatternForPart)
  .join("")

// Formats a dayjs date according to schema flags
export const getDateDisplayValue = (
  value: dayjs.Dayjs | string | null,
  { enableTime = true, timeOnly = false } = {}
): string => {
  if (typeof value === "string") {
    value = dayjs(value)
  }
  if (!value?.isValid()) {
    return ""
  }
  if (timeOnly) {
    return value.format("HH:mm")
  } else if (!enableTime) {
    return value.format(localeDateFormat)
  } else {
    return value.format(`${localeDateFormat} HH:mm`)
  }
}

export const hexToRGBA = (color: string, opacity: number): string => {
  if (color.includes("#")) {
    color = color.replace("#", "")
  }
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export function rgbToHex(rgbStr: string | undefined): string {
  if (rgbStr?.startsWith("#")) return rgbStr

  const rgbMatch = rgbStr?.match(
    /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/
  )
  if (!rgbMatch) return rgbStr || "#FFFFFF"

  const r = parseInt(rgbMatch[1])
  const g = parseInt(rgbMatch[2])
  const b = parseInt(rgbMatch[3])

  return `#${((1 << 24) | (r << 16) | (g << 8) | b)
    .toString(16)
    .slice(1)
    .toUpperCase()}`
}

// Icon conversions for app icons
export const AppIconMap: Record<string, string> = {
  Apps: "dots-nine",
  Actions: "pencil-ruler",
  ConversionFunnel: "funnel-simple",
  App: "app-store-logo",
  Briefcase: "briefcase",
  Money: "money",
  ShoppingCart: "shopping-cart",
  Form: "list",
  Help: "question",
  Monitoring: "monitor",
  Sandbox: "columns",
  Project: "folder",
  Organisations: "city",
  Magnify: "magnifying-glass",
  Launch: "rocket-launch",
  Car: "car",
  Camera: "camera",
  Bug: "bug",
  Channel: "snowflake",
  Calculator: "calculator",
  Calendar: "calendar-dots",
  GraphDonut: "chart-donut",
  GraphBarHorizontal: "chart-bar-horizontal",
  Demographic: "users-three",
}

// Comprehensive Spectrum to Phosphor mapping
export const SpectrumIconMap: Record<string, string> = {
  "123": "list-numbers",
  "3DMaterials": "cube",
  ABC: "text-aa",
  AEMScreens: "desktop-tower",
  Actions: "cursor-click",
  AdDisplay: "monitor",
  AdPrint: "printer",
  Add: "plus",
  AddCircle: "plus-circle",
  AddTo: "plus",
  AddToSelection: "selection-plus",
  Airplane: "airplane",
  Alert: "warning",
  AlertAdd: "warning-circle",
  AlertCheck: "warning-circle",
  AlertCircle: "warning-circle",
  AlertCircleFilled: "warning-circle",
  Algorithm: "flow-arrow",
  Alias: "link-simple",
  AlignBottom: "align-bottom",
  AlignCenter: "align-center-horizontal",
  AlignLeft: "align-left",
  AlignMiddle: "align-center-vertical",
  AlignRight: "align-right",
  AlignTop: "align-top",
  Amusementpark: "ferris-wheel",
  Anchor: "anchor",
  AnchorSelect: "anchor",
  Annotate: "pencil",
  AnnotatePen: "pen-nib",
  Answer: "chat-circle-dots",
  AnswerFavorite: "chat-circle-dots",
  App: "squares-four",
  AppRefresh: "arrow-clockwise",
  AppleFiles: "apple-logo",
  ApplicationDelivery: "truck",
  ApproveReject: "checks",
  Apps: "squares-four",
  Archive: "archive-tray",
  ArchiveRemove: "tray-arrow-up",
  Arrow: "arrow-right",
  ArrowDown: "arrow-down",
  ArrowLeft: "arrow-left",
  ArrowRight: "arrow-right",
  ArrowUp: "arrow-up",
  ArrowUpRight: "arrow-up-right",
  Artboard: "square",
  Article: "newspaper",
  Asset: "stack",
  AssetCheck: "stack",
  AssetsAdded: "stack",
  AssetsDownloaded: "stack",
  AssetsExpired: "stack",
  AssetsLinkedPublished: "stack",
  AssetsModified: "stack",
  AssetsPublished: "stack",
  Asterisk: "asterisk",
  At: "at",
  Attach: "paperclip",
  AttachmentExclude: "paperclip",
  Attributes: "list-bullets",
  Audio: "music-note",
  AutomatedSegment: "funnel",
  Back: "rotate-counter-clockwise",
  Back30Seconds: "rewind",
  BackAndroid: "arrow-left",
  Beaker: "beaker",
  BeakerCheck: "beaker",
  BeakerShare: "beaker",
  Bell: "bell",
  BidRule: "sliders-horizontal",
  BidRuleAdd: "sliders-horizontal",
  Blower: "wind",
  Blur: "drop-half",
  Book: "book",
  Bookmark: "bookmark",
  BookmarkSingle: "bookmark",
  BookmarkSingleOutline: "bookmark",
  BookmarkSmall: "bookmark-simple",
  BookmarkSmallOutline: "bookmark-simple",
  Boolean: "intersect",
  Border: "square",
  Box: "cube",
  BoxAdd: "cube",
  BoxExport: "cube",
  BoxImport: "cube",
  Brackets: "brackets-angle",
  BracketsSquare: "brackets-square",
  Branch1: "git-branch",
  Branch2: "git-branch",
  Branch3: "git-branch",
  BranchCircle: "git-branch",
  BreadcrumbNavigation: "dots-three-outline",
  Breakdown: "chart-line",
  BreakdownAdd: "chart-line",
  Briefcase: "briefcase",
  Browse: "folder-open",
  Brush: "paint-brush",
  Bug: "bug",
  Building: "buildings",
  BulkEditUsers: "users-three",
  Button: "square",
  CCLibrary: "books",
  Calculator: "calculator",
  Calendar: "calendar",
  CalendarAdd: "calendar-plus",
  CalendarLocked: "calendar",
  CalendarUnlocked: "calendar",
  CallCenter: "headset",
  Camera: "camera",
  CameraFlip: "camera-rotate",
  CameraRefresh: "camera",
  Campaign: "megaphone",
  CampaignAdd: "megaphone",
  CampaignClose: "megaphone",
  CampaignDelete: "megaphone",
  CampaignEdit: "megaphone",
  Cancel: "x",
  Capitals: "text-aa",
  Captcha: "puzzle-piece",
  Car: "car",
  Card: "credit-card",
  Channel: "share-network",
  Chat: "chat-circle",
  ChatAdd: "chat-circle",
  CheckPause: "pause-circle",
  Checkmark: "check",
  CheckmarkCircle: "check-circle",
  CheckmarkCircleOutline: "check-circle",
  Chevron: "caret-right",
  ChevronDoubleLeft: "caret-double-left",
  ChevronDoubleRight: "caret-double-right",
  ChevronDown: "caret-down",
  ChevronLeft: "caret-left",
  ChevronRight: "caret-right",
  ChevronUp: "caret-up",
  ChevronUpDown: "arrows-vertical",
  Circle: "circle",
  ClassicGridView: "squares-four",
  Clock: "clock",
  ClockCheck: "clock-check",
  CloneStamp: "stamp",
  Close: "x",
  CloseCaptions: "closed-captioning",
  CloseCircle: "xcircle",
  Cloud: "cloud",
  CloudDisconnected: "cloud-slash",
  CloudError: "cloud-warning",
  CloudOutline: "cloud",
  Code: "code",
  Collection: "stack",
  CollectionAdd: "stack",
  CollectionAddTo: "stack",
  CollectionCheck: "stack",
  CollectionEdit: "stack",
  CollectionExclude: "stack",
  CollectionLink: "stack",
  ColorFill: "paint-bucket",
  ColorPalette: "palette",
  ColorWheel: "circle-half-tilt",
  ColumnSettings: "columns",
  ColumnTwoA: "columns",
  ColumnTwoB: "columns",
  ColumnTwoC: "columns",
  Comment: "chat-circle",
  Compare: "swap",
  Compass: "compass",
  Condition: "git-merge",
  ConfidenceFour: "cell-signal-full",
  ConfidenceOne: "cell-signal-low",
  ConfidenceThree: "cell-signal-high",
  ConfidenceTwo: "cell-signal-medium",
  Connect: "link",
  ConnectedObjects: "link",
  ContactInfo: "address-book",
  ContrastFill: "circle-half-tilt",
  ConversionFunnel: "funnel",
  ConvertAnchorPoint: "anchor",
  Copy: "copy",
  CornerRadius: "square",
  CreatePDF: "file-pdf",
  Crop: "crop",
  CropLighten: "crop",
  CropRotate: "crop",
  CrossSize: "plus",
  CurveTool: "bezier-curve",
  Cut: "scissors",
  Data: "database",
  DataAdd: "database",
  DataBook: "database",
  DataCheck: "database",
  DataCorrelated: "database",
  DataDownload: "database",
  DataEdit: "database",
  DataMapping: "database",
  DataRefresh: "database",
  DataRemove: "database",
  DataSettings: "database",
  DataUpload: "database",
  DataUser: "database",
  DataUnavailable: "database-slash",
  Date: "calendar",
  DateInput: "calendar",
  Deduplication: "copy",
  Delete: "trash",
  DeleteOutline: "trash",
  Demographic: "users-three",
  DeselectCircular: "circle-dashed",
  Desktop: "desktop",
  DeviceDesktop: "desktop",
  DeviceLaptop: "laptop",
  DevicePhone: "device-mobile",
  DevicePreview: "devices",
  DeviceRotateLandscape: "device-rotate",
  DeviceRotatePortrait: "device-rotate",
  DeviceTablet: "device-tablet",
  DeviceTV: "television",
  Devices: "devices",
  Dimensions: "ruler",
  DirectRight: "arrow-right",
  DistributeBottomEdge: "align-bottom",
  DistributeHorizontalCenter: "align-center-horizontal",
  DistributeLeftEdge: "align-left",
  DistributeRightEdge: "align-right",
  DistributeSpaceHoriz: "align-horizontal",
  DistributeSpaceVert: "align-vertical",
  DistributeTopEdge: "align-top",
  DistributeVerticalCenter: "align-center-vertical",
  DistributeVertically: "align-vertical",
  Document: "file-text",
  DocumentFragment: "file-text",
  DocumentFragmentGroup: "files",
  DocumentOutline: "file-text",
  DocumentRefresh: "file-text",
  Download: "download",
  DownloadFromCloud: "cloud-arrow-down",
  DownloadFromCloudOutline: "cloud-arrow-down",
  Draft: "note-pencil",
  DragHandle: "dots-six",
  Draw: "pencil",
  Dropdown: "caret-down",
  Duplicate: "copy",
  Edit: "pencil",
  EditCircle: "pencil-circle",
  EditExclude: "pencil",
  EditIn: "pencil",
  Education: "graduation-cap",
  Effect: "sparkle",
  Email: "envelope",
  EmailCancel: "envelope",
  EmailCheck: "envelope",
  EmailExclude: "envelope",
  EmailGear: "envelope",
  EmailKey: "envelope",
  EmailLightning: "envelope",
  EmailOutline: "envelope",
  EmailRefresh: "envelope",
  EmailReject: "envelope",
  EmailSchedule: "envelope",
  Engagement: "handshake",
  Enterprise: "buildings",
  Erase: "eraser",
  Event: "calendar",
  EventExclude: "calendar",
  EventShare: "calendar",
  Events: "calendar",
  ExcludeOverlap: "intersect",
  Experience: "star",
  ExperienceAdd: "star",
  ExperienceAddTo: "star",
  ExperienceExport: "star",
  ExperienceImport: "star",
  Export: "export",
  ExportOriginal: "export",
  Exposure: "circle-half-tilt",
  Extension: "puzzle-piece",
  FaceHappy: "smiley",
  FaceSad: "smiley-sad",
  FastForward: "fast-forward",
  FastForwardCircle: "fast-forward-circle",
  Feature: "star",
  Feed: "rss",
  FeedAdd: "rss",
  FeedManagement: "rss",
  File: "file",
  FileAdd: "file-plus",
  FileCSV: "file-csv",
  FileCode: "file-code",
  FileData: "file-text",
  FileEmail: "file-text",
  FileGear: "file-text",
  FileHTML: "file-html",
  FileImportant: "file-text",
  FileKey: "file-text",
  FilePDF: "file-pdf",
  FileSingleWebPage: "file-html",
  FileTemplate: "file-text",
  FileTxt: "file-text",
  FileUser: "file-text",
  FileWorkflow: "file-text",
  FileZip: "file-zip",
  FilingCabinet: "filing-cabinet",
  Filter: "funnel",
  FilterAdd: "funnel",
  FilterCheck: "funnel",
  FilterColored: "funnel",
  FilterDelete: "funnel",
  FilterEdit: "funnel",
  FilterHeart: "funnel",
  FilterRemove: "funnel",
  FilterStar: "funnel",
  FindAndReplace: "magnifying-glass",
  Flag: "flag",
  FlagExclude: "flag",
  Flashlight: "flashlight",
  FlashlightOff: "flashlight",
  FlashlightOn: "flashlight",
  FlashOn: "lightning",
  Flight: "airplane",
  Flip: "flip-horizontal",
  FlipHorizontal: "flip-horizontal",
  FlipVertical: "flip-vertical",
  Folder: "folder",
  Folder2Color: "folder",
  FolderAdd: "folder-plus",
  FolderAddTo: "folder-plus",
  FolderArchive: "folder",
  FolderBreadcrumb: "folder",
  FolderDelete: "folder-minus",
  FolderGear: "folder",
  FolderLocked: "folder-lock",
  FolderOpen: "folder-open",
  FolderOpenOutline: "folder-open",
  FolderOutline: "folder",
  FolderRemove: "folder-minus",
  FolderSearch: "folder",
  FolderUser: "folder",
  Follow: "plus",
  FontDecrease: "text-size",
  FontIncrease: "text-size",
  FontSize: "text-size",
  Form: "list",
  Forward: "arrow-right",
  Forward30Seconds: "fast-forward",
  FullScreen: "arrows-out",
  FullScreenExit: "arrows-in",
  Function: "function",
  Gauge1: "gauge",
  Gauge2: "gauge",
  Gauge3: "gauge",
  Gauge4: "gauge",
  Gauge5: "gauge",
  Gears: "gears",
  GearsAdd: "gears",
  GearsDelete: "gears",
  GearsEdit: "gears",
  Gift: "gift",
  Globe: "globe",
  GlobeCheck: "globe",
  GlobeClock: "globe",
  GlobeEnter: "globe",
  GlobeExit: "globe",
  GlobeGrid: "globe",
  GlobeOutline: "globe",
  GlobeRemove: "globe",
  GlobeSearch: "globe",
  GlobeStrike: "globe",
  GlobeStrikeThrough: "globe",
  GovernmentBuilding: "bank",
  Gradient: "gradient",
  GraphArea: "chart-line",
  GraphAreaStacked: "chart-line",
  GraphBarHorizontal: "chart-bar-horizontal",
  GraphBarHorizontalAdd: "chart-bar-horizontal",
  GraphBarHorizontalStacked: "chart-bar-horizontal",
  GraphBarVertical: "chart-bar",
  GraphBarVerticalAdd: "chart-bar",
  GraphBarVerticalStacked: "chart-bar",
  GraphBubble: "chart-scatter",
  GraphBullet: "chart-bar",
  GraphConfidenceBand: "chart-line",
  GraphDonut: "chart-donut",
  GraphDonutAdd: "chart-donut",
  GraphGantt: "chart-bar",
  GraphHistogram: "chart-bar",
  GraphLine: "chart-line",
  GraphPie: "chart-pie",
  GraphProfitCurve: "chart-line",
  GraphScatter: "chart-scatter",
  GraphStream: "chart-line",
  GraphStreamRanked: "chart-line",
  GraphSunburst: "chart-donut",
  GraphTree: "tree-structure",
  GraphTrend: "trend-up",
  GraphTrendAdd: "trend-up",
  Graphic: "image",
  GraphicCircle: "circle",
  GraphicRectangle: "rectangle",
  Grid: "grid-four",
  GridView: "grid-four",
  Group: "squares-four",
  GroupedBarChart: "chart-bar",
  Hand: "hand",
  Hand0: "hand",
  Hand1: "hand",
  Hand2: "hand",
  Hand3: "hand",
  Hand4: "hand",
  HangingIndent: "text-indent",
  HardDrive: "hard-drive",
  Hashtag: "hash",
  Heal: "bandage",
  Heart: "heart",
  HeartOutline: "heart",
  Help: "question",
  HelpOutline: "question",
  Hide: "eye-slash",
  Histogram: "chart-bar",
  History: "clock-counter-clockwise",
  Home: "house",
  HomeFilled: "house",
  HomePage: "house",
  HorizontalContainer: "rectangle",
  HotSpot: "target",
  Hotel: "bed",
  Hourglass: "hourglass",
  House: "house",
  IdentityService: "identification-card",
  Image: "image",
  ImageAdd: "image",
  ImageAlbum: "images",
  ImageAutoMode: "image",
  ImageCarousel: "images",
  ImageCheck: "image",
  ImageCheckedOut: "image",
  ImageMapCircle: "image",
  ImageMapPolygon: "image",
  ImageMapRectangle: "image",
  ImageNext: "image",
  ImageProfile: "image",
  ImageSearch: "image",
  ImageText: "image",
  Images: "images",
  Import: "download",
  ImportantDetail: "warning",
  Inbox: "tray",
  IndentDecrease: "text-indent",
  IndentIncrease: "text-indent",
  Individual: "user",
  Info: "info",
  InfoOutline: "info",
  InkDrop: "drop",
  Insert: "plus",
  Insights: "chart-line",
  Intersect: "intersect",
  IntersectOverlap: "intersect",
  Invite: "user-plus",
  ItalicText: "text-italic",
  Journey: "path",
  JourneyAction: "path",
  JourneyData: "path",
  JourneyEvent: "path",
  JourneyVoyager: "path",
  JumpToTop: "arrow-up",
  Key: "key",
  KeyClock: "key",
  KeyExclude: "key",
  KeyMetrics: "key",
  Keyboard: "keyboard",
  Label: "tag",
  LabelExclude: "tag",
  Landscape: "mountains",
  Launch: "rocket-launch",
  Layer: "stack",
  LayerBackward: "stack",
  LayerForward: "stack",
  LayersBackward: "stack",
  LayersForward: "stack",
  LayersSendToBack: "stack",
  Layout: "layout",
  Learn: "graduation-cap",
  Light: "lightbulb",
  Line: "line-segment",
  LineHeight: "text-line-spacing",
  Link: "link",
  LinkCheck: "link",
  LinkGlobe: "link",
  LinkNav: "link",
  LinkOff: "link-break",
  LinkOut: "arrow-square-out",
  LinkOutLight: "arrow-square-out",
  LinkPage: "link",
  LinkUser: "link",
  Location: "map-pin",
  LocationBasedDate: "map-pin",
  LocationBasedEvent: "map-pin",
  LocationContribution: "map-pin",
  Lock: "lock",
  LockClosed: "lock",
  LockOpen: "lock-open",
  LogOut: "sign-out",
  Login: "sign-in",
  Look: "eye",
  LookupObjects: "magnifying-glass",
  Loupe: "magnifying-glass",
  LoupeView: "magnifying-glass",
  MBox: "envelope",
  MagicWand: "magic-wand",
  Magnify: "magnifying-glass",
  MailTo: "envelope",
  MapView: "map",
  MarginBottom: "align-bottom",
  MarginLeft: "align-left",
  MarginRight: "align-right",
  MarginTop: "align-top",
  MarketingActivities: "megaphone",
  Maximize: "arrows-out",
  Measure: "ruler",
  MediaRefresh: "arrow-clockwise",
  Megaphone: "megaphone",
  Merge: "git-merge",
  MergeLayers: "stack",
  Message: "chat-circle",
  Minimize: "arrows-in",
  Mobile: "device-mobile",
  ModernGridView: "grid-four",
  Money: "money",
  Monitor: "monitor",
  Monitoring: "monitor",
  More: "dots-three",
  MoreCircle: "dots-three-circle",
  MoreSmallList: "dots-three",
  MoreSmallListVert: "dots-three-vertical",
  MoreVertical: "dots-three-vertical",
  Move: "arrows-four",
  MoveLeftRight: "arrows-horizontal",
  MoveTo: "arrow-right",
  MoveUpDown: "arrows-vertical",
  MultipleAdd: "plus",
  MultipleCheck: "check",
  MultipleExclude: "minus",
  Music: "music-note",
  MusicNote: "music-note",
  NewItem: "plus",
  News: "newspaper",
  NewsAdd: "newspaper",
  Next: "arrow-right",
  NoDuplicate: "copy",
  NoEdit: "pencil-slash",
  Note: "note",
  NoteAdd: "note",
  Notification: "bell",
  NotificationImportant: "bell",
  Number: "hash",
  Number0: "number-zero",
  Number1: "number-one",
  Number2: "number-two",
  Number3: "number-three",
  Number4: "number-four",
  Number5: "number-five",
  Number6: "number-six",
  Number7: "number-seven",
  Number8: "number-eight",
  Number9: "number-nine",
  OpenIn: "arrow-square-out",
  OpenInLight: "arrow-square-out",
  OpenRecent: "clock-counter-clockwise",
  OpenRecentOutline: "clock-counter-clockwise",
  Operations: "gears",
  Orbit: "planet",
  OrderedList: "list-numbers",
  Organize: "squares-four",
  Orientation: "device-rotate",
  Outline: "square",
  Output: "export",
  Overlap: "intersect",
  Package: "package",
  PaddingBottom: "align-bottom",
  PaddingLeft: "align-left",
  PaddingRight: "align-right",
  PaddingTop: "align-top",
  Page: "file-text",
  PageBreak: "file-text",
  PageExclude: "file-text",
  PageGear: "file-text",
  PageRule: "file-text",
  PageShare: "file-text",
  PageTag: "file-text",
  Pages: "files",
  PagesExclude: "files",
  Pan: "hand",
  Panel: "sidebar",
  Paste: "clipboard",
  PasteHTML: "clipboard",
  PasteList: "clipboard",
  PasteText: "clipboard",
  PatternFill: "pattern",
  Pause: "pause",
  PauseCircle: "pause-circle",
  Paypal: "currency-dollar",
  Pen: "pen",
  Pencil: "pencil",
  PendingItems: "clock",
  People: "users-three",
  PersonalizationField: "user",
  Perspective: "cube",
  Phone: "phone",
  PhoneVerification: "phone",
  PieChart: "chart-pie",
  Pin: "push-pin",
  PinOff: "push-pin-slash",
  PinOn: "push-pin",
  Pivot: "arrows-clockwise",
  Play: "play",
  PlayCircle: "play-circle",
  Playlist: "playlist",
  PlaylistAdd: "playlist",
  PlaylistRemove: "playlist",
  Plugin: "puzzle-piece",
  PolarGrid: "grid-nine",
  Polygon: "polygon",
  PopIn: "arrow-square-in",
  Portrait: "user",
  Preferences: "gear",
  Preview: "eye",
  Previous: "arrow-left",
  Print: "printer",
  PrintPreview: "printer",
  Privacy: "lock",
  Project: "folder",
  ProjectAdd: "folder-plus",
  ProjectEdit: "folder",
  ProjectNameEdit: "folder",
  Properties: "list-bullets",
  PropertiesCopy: "list-bullets",
  Publish: "upload",
  PublishCheck: "upload",
  PublishPending: "upload",
  PublishReject: "upload",
  PublishRemove: "upload",
  PublishSchedule: "upload",
  PushNotification: "bell",
  QRCode: "qr-code",
  Question: "question",
  QuestionMarkCircle: "question",
  Queue: "queue",
  QuickSelect: "cursor-click",
  RadioButton: "radio-button",
  Rail: "sidebar",
  RailBottom: "align-bottom",
  RailLeft: "align-left",
  RailRight: "align-right",
  RailRightClose: "align-right",
  RailRightOpen: "align-right",
  RailTop: "align-top",
  RapidGrowth: "trend-up",
  RealTime: "clock",
  RealTimeCustomerProfile: "user",
  Receipt: "receipt",
  RecentItems: "clock-counter-clockwise",
  Rectangle: "rectangle",
  RectangleSelect: "rectangle",
  Redo: "arrow-clockwise",
  Refresh: "arrow-clockwise",
  RegionSelect: "selection",
  Reject: "x",
  Remove: "minus",
  RemoveCircle: "minus-circle",
  Rename: "pencil",
  Reorder: "list-bullets",
  Replay: "arrow-clockwise",
  Reply: "arrow-bend-up-left",
  ReplyAll: "arrow-bend-up-left",
  Report: "chart-bar",
  ReportAdd: "chart-bar",
  Resize: "arrows-out",
  ResourceFork: "git-fork",
  Restore: "arrow-counter-clockwise",
  Retweet: "repeat",
  Reuse: "recycle",
  Revert: "arrow-counter-clockwise",
  Rewind: "rewind",
  RewindCircle: "rewind-circle",
  Ribbon: "medal",
  Rotate: "arrow-clockwise",
  RotateLeft: "arrow-counter-clockwise",
  RotateLeftOutline: "arrow-counter-clockwise",
  RotateRight: "arrow-clockwise",
  RotateRightOutline: "arrow-clockwise",
  RotateCW: "arrow-clockwise",
  SMS: "chat-circle",
  SQLQuery: "database",
  Sandbox: "columns",
  Save: "floppy-disk",
  SaveAsFloppy: "floppy-disk",
  SaveFloppy: "floppy-disk",
  SaveTo: "floppy-disk",
  SaveToLight: "floppy-disk",
  Scale: "resize",
  Scribble: "scribble-loop",
  Search: "magnifying-glass",
  SearchExclude: "magnifying-glass",
  Seat: "chair",
  SeatAdd: "chair",
  Segmentation: "funnel",
  Select: "cursor-click",
  SelectAdd: "selection-plus",
  SelectBox: "selection",
  SelectBoxAll: "selection",
  SelectCircular: "circle-dashed",
  SelectContainer: "selection",
  SelectGear: "selection",
  SelectIntersect: "intersect",
  SelectSubtract: "minus",
  Selection: "selection",
  SelectionChecked: "selection",
  SelectionMove: "selection",
  Send: "paper-plane-tilt",
  SendBackward: "arrow-down",
  SendToBack: "arrow-line-down",
  Sentiment: "smiley",
  SentimentNegative: "smiley-sad",
  SentimentNeutral: "smiley-meh",
  SentimentPositive: "smiley",
  SequenceAfter: "arrow-right",
  SequenceBefore: "arrow-left",
  Server: "server",
  ServiceRequest: "headset",
  Settings: "gear",
  Share: "share",
  ShareAndroid: "share",
  ShareCheck: "share",
  ShareLight: "share",
  Shield: "shield",
  ShieldCheck: "shield-check",
  Ship: "boat",
  Shop: "storefront",
  ShoppingCart: "shopping-cart",
  ShowAllLayers: "stack",
  ShowMenu: "list-bullets",
  ShowOneLayer: "stack",
  Shuffle: "shuffle",
  SideKick: "robot",
  Slice: "scissors",
  Slow: "hourglass",
  SmallCaps: "text-aa",
  Snapshot: "camera",
  SocialNetwork: "share-network",
  SortOrderDown: "sort-descending",
  SortOrderUp: "sort-ascending",
  Spam: "prohibit",
  Spellcheck: "check",
  Spin: "spinner-gap",
  SplitView: "columns",
  SpotHeal: "bandage",
  Stadium: "circle",
  Stage: "square",
  Stamp: "stamp",
  Star: "star",
  StarOutline: "star",
  Starburst: "sparkle",
  StatusLight: "circle",
  StepBackward: "skip-back",
  StepBackwardCircle: "skip-back-circle",
  StepForward: "skip-forward",
  StepForwardCircle: "skip-forward-circle",
  Stop: "stop",
  StopCircle: "stop-circle",
  Stopwatch: "stopwatch",
  Straighten: "ruler",
  StraightenOutline: "ruler",
  StrokeWidth: "minus",
  Subscribe: "bell",
  SubstractBackPath: "minus",
  SubstractFromSelection: "minus",
  SubtractBackPath: "minus",
  SubtractFromSelection: "minus",
  SubtractFrontPath: "minus",
  SuccessMetric: "trend-up",
  Summarize: "list-checks",
  Survey: "clipboard-text",
  Switch: "toggle-left",
  Sync: "arrows-clockwise",
  SyncRemove: "arrows-clockwise",
  Table: "table",
  TableAdd: "table",
  TableAndChart: "table",
  TableColumnAddLeft: "table",
  TableColumnAddRight: "table",
  TableColumnMerge: "table",
  TableColumnRemoveCenter: "table",
  TableColumnSplit: "table",
  TableEdit: "table",
  TableHistogram: "table",
  TableMergeCells: "table",
  TableRowAddBottom: "table",
  TableRowAddTop: "table",
  TableRowMerge: "table",
  TableRowRemoveCenter: "table",
  TableRowSplit: "table",
  TableSelectColumn: "table",
  TableSelectRow: "table",
  Tableau: "chart-bar",
  TagBold: "text-bolder",
  TagItalic: "text-italic",
  TagUnderline: "text-underline",
  Target: "target",
  Targeted: "target",
  TaskList: "list-checks",
  Teapot: "coffee",
  Temperature: "thermometer",
  TestAB: "flask",
  TestABEdit: "flask",
  TestABGear: "flask",
  TestABRemove: "flask",
  TestProfile: "flask",
  Text: "article",
  TextAdd: "article",
  TextAlignCenter: "text-align-center",
  TextAlignJustify: "text-align-justify",
  TextAlignLeft: "text-align-left",
  TextAlignRight: "text-align-right",
  TextBaselineShift: "text-line-spacing",
  TextBold: "text-bolder",
  TextBulleted: "list-bullets",
  TextBulletedAttach: "list-bullets",
  TextBulletedHierarchy: "list-bullets",
  TextBulletedHierarchyExclude: "list-bullets",
  TextColor: "paint-bucket",
  TextDecrease: "text-line-spacing",
  TextEdit: "article",
  TextExclude: "article",
  TextIncrease: "text-line-spacing",
  TextIndentDecrease: "text-indent",
  TextIndentIncrease: "text-indent",
  TextItalic: "text-italic",
  TextKerning: "text-line-spacing",
  TextLetteredLowerCase: "text-aa",
  TextLetteredUpperCase: "text-aa",
  TextNumbered: "list-numbers",
  TextParagraph: "text-align-justify",
  TextRomanLowercase: "text-aa",
  TextRomanUppercase: "text-aa",
  TextSize: "text-size",
  TextSizeAdd: "text-size",
  TextSpaceAfter: "text-line-spacing",
  TextSpaceBefore: "text-line-spacing",
  TextStrikethrough: "text-strikethrough",
  TextStroke: "text",
  TextStyle: "sparkle",
  TextSubscript: "text-subscript",
  TextSuperscript: "text-superscript",
  TextTracking: "text-line-spacing",
  TextUnderline: "text-underline",
  ThumbDown: "thumbs-down",
  ThumbDownOutline: "thumbs-down",
  ThumbUp: "thumbs-up",
  ThumbUpOutline: "thumbs-up",
  Tips: "lightbulb",
  Train: "train",
  TransferToPlatform: "arrow-up-tray",
  Transparency: "squares-four",
  Trap: "target",
  TreeCollapse: "caret-right",
  TreeCollapseAll: "caret-double-right",
  TreeExpand: "caret-down",
  TreeExpandAll: "caret-double-down",
  TrendInspect: "chart-line",
  TrimPath: "crop",
  TripleGripper: "list-bullets",
  Trophy: "trophy",
  Type: "text-t",
  USA: "flag",
  Underline: "text-underline",
  Undo: "arrow-counter-clockwise",
  Ungroup: "squares-four",
  Unlink: "link-break",
  Unmerge: "intersect",
  UploadToCloud: "cloud-arrow-up",
  UploadToCloudOutline: "cloud-arrow-up",
  User: "user",
  UserActivity: "graph-line",
  UserAdd: "user-plus",
  UserAdmin: "user-gear",
  UserArrow: "user-switch",
  UserCheckedOut: "user-circle-minus",
  UserDeveloper: "user-gear",
  UserEdit: "user-circle-gear",
  UserExclude: "user-minus",
  UserGroup: "users-three",
  UserLock: "user-lock",
  UserShare: "share-network",
  UsersAdd: "users-three",
  UsersExclude: "users-three",
  UsersLock: "users-three",
  UsersShare: "users-three",
  Variable: "function",
  VectorDraw: "bezier-curve",
  VideoCheckedOut: "film-slate",
  VideoFilled: "film-slate",
  VideoOutline: "film-slate",
  ViewAllTags: "tags",
  ViewBiWeek: "calendar",
  ViewCard: "squares-four",
  ViewColumn: "columns",
  ViewDay: "calendar",
  ViewDetail: "list-dashes",
  ViewGrid: "squares-four",
  ViewList: "list-bullets",
  ViewRow: "rows",
  ViewSingle: "square",
  ViewStack: "stack",
  ViewWeek: "calendar",
  ViewedMarkAs: "eye",
  Vignette: "circle-half-tilt",
  Visibility: "eye",
  VisibilityOff: "eye-slash",
  Visit: "arrow-square-out",
  VisitShare: "arrow-square-out",
  VoiceOver: "microphone",
  VolumeMute: "speaker-none",
  VolumeOne: "speaker-low",
  VolumeThree: "speaker-high",
  VolumeTwo: "speaker-high",
  Watch: "watch",
  WebPage: "browser",
  WebPages: "browsers",
  Workflow: "tree-structure",
  WorkflowAdd: "tree-structure",
  Wrench: "wrench",
  ZoomIn: "magnifying-glass-plus",
  ZoomOut: "magnifying-glass-minus",
}

export function getPhosphorIcon(icon: string): string {
  return SpectrumIconMap[icon] || icon
}
