import SpectrumUIIcons from "@spectrum-css/icon/dist/spectrum-css-icons.svg?raw"
import SpectrumWorkflowIcons from "@adobe/spectrum-css-workflow-icons/dist/spectrum-icons.svg?raw"

export default () => {
  loadIconSet("Spectrum UI Icons", SpectrumUIIcons)
  loadIconSet("Spectrum Workflow Icons", SpectrumWorkflowIcons)
}

const loadIconSet = (name, markup) => {
  // Parse the SVG
  const parser = new DOMParser()
  try {
    const doc = parser.parseFromString(markup, "image/svg+xml")
    const svg = doc.firstChild

    // Check a real SVG was parsed
    if (svg && svg.tagName === "svg") {
      // Hide the element
      svg.style.display = "none"

      // Insert it into the head
      document.head.insertBefore(svg, null)
    } else {
      throw "Invalid tag type for SVG definition"
    }
  } catch (err) {
    // Swallow error, but icons won't work
    console.error(err)
    console.error(`Failed to parse ${name}. Icons won't work.`)
  }
}
