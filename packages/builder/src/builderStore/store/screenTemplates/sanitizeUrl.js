export default function(url) {
  return url
    .split("/")
    .map(part => {
      // if parameter, then use as is
      if (part.startsWith(":")) return part
      return encodeURIComponent(part.replace(" ", "-"))
    })
    .join("/")
    .toLowerCase()
}
