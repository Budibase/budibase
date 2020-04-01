import feather from "feather-icons"
const getIcon = (icon, size) =>
  feather.icons[icon].toSvg({ height: size || "16", width: size || "16" })
export default getIcon
