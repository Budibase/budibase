// Custom phosphor icon loader that loads icons on demand from CDN
const loadedWeights = new Set()

export async function loadPhosphorIconWeight(weight = "regular") {
  if (loadedWeights.has(weight)) return

  try {
    // Load CSS from CDN instead of bundled package
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = `https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/${weight}/style.css`

    // Wait for the stylesheet to load
    await new Promise((resolve, reject) => {
      link.onload = resolve
      link.onerror = reject
      document.head.appendChild(link)
    })

    loadedWeights.add(weight)
  } catch (error) {
    console.error(`Failed to load phosphor icon weight: ${weight}`, error)
  }
}

export function isWeightLoaded(weight) {
  return loadedWeights.has(weight)
}
