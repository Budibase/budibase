export default function (url) {
  return url
    .split("/")
    .map(part => {
      part = decodeURIComponent(part)
      part = part.replace(/ /g, "-")

      // If parameter, then use as is
      if (!part.startsWith(":")) {
        part = encodeURIComponent(part)
      }

      return part
    })
    .join("/")
    .toLowerCase()
}
