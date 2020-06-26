export const getFontUrls = css => {
  const matches = css.matchAll(/(font-family:.+;)/g)
  return [...matches].reduce((urls, match) => {
    const font = match[0]
      .trim()
      .replace("font-family:", "")
      .replace(";", "")
      .trim()
    const url = fontUrls[font]
    if (url && !urls.includes(url)) {
      urls.push(url)
    }
    return urls
  }, [])
}

export const fontUrls = {
  Inter: "https://rsms.me/inter/inter.css",
  "Roboto Mono": "https://fonts.googleapis.com/css2?family=Roboto+Mono",
  "Playfair Display":
    "https://fonts.googleapis.com/css2?family=Playfair+Display",
}
