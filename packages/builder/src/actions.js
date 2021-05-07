export const gradient = (node, config = {}) => {
  const defaultConfig = {
    points: 10,
    saturation: 0.8,
    lightness: 0.75,
    softness: 0.8,
  }

  // Applies a gradient background
  const createGradient = config => {
    config = {
      ...defaultConfig,
      ...config,
    }
    const { saturation, lightness, softness, points } = config

    // Generates a random number between min and max
    const rand = (min, max) => {
      return Math.round(min + Math.random() * (max - min))
    }

    // Generates a random HSL colour using the options specified
    const randomHSL = () => {
      const lowerSaturation = Math.min(100, saturation * 100)
      const upperSaturation = Math.min(100, (saturation + 0.2) * 100)
      const lowerLightness = Math.min(100, lightness * 100)
      const upperLightness = Math.min(100, (lightness + 0.2) * 100)
      const hue = rand(0, 360)
      const sat = `${rand(lowerSaturation, upperSaturation)}%`
      const light = `${rand(lowerLightness, upperLightness)}%`
      return `hsl(${hue},${sat},${light})`
    }

    // Generates a radial gradient stop point
    const randomGradientPoint = () => {
      const lowerTransparency = Math.min(100, softness * 100)
      const upperTransparency = Math.min(100, (softness + 0.2) * 100)
      const transparency = rand(lowerTransparency, upperTransparency)
      return (
        `radial-gradient(` +
        `at ${rand(10, 90)}% ${rand(10, 90)}%,` +
        `${randomHSL()} 0,` +
        `transparent ${transparency}%)`
      )
    }

    let css = `opacity:0.9;background-color:${randomHSL()};background-image:`
    for (let i = 0; i < points - 1; i++) {
      css += `${randomGradientPoint()},`
    }
    css += `${randomGradientPoint()};`
    node.style = css
  }

  // Apply the initial gradient
  createGradient(config)

  return {
    // Apply a new gradient
    update: config => {
      createGradient(config)
    },
  }
}
