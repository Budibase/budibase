export const gradient = (node, config = {}) => {
  const defaultConfig = {
    points: 12,
    saturation: 0.85,
    lightness: 0.7,
    softness: 0.9,
    seed: null,
    version: null,
  }

  // Applies a gradient background
  const createGradient = config => {
    config = {
      ...defaultConfig,
      ...config,
    }
    const { saturation, lightness, softness, points } = config
    const seed = config.seed || Math.random().toString(32).substring(2)
    const version = config.version ?? 0

    // Hash function which returns a fixed hash between specified limits
    // for a given seed and a given version
    const rangeHash = (seed, min = 0, max = 100, version = 0) => {
      const range = max - min
      let hash = range + version
      for (let i = 0; i < seed.length * 2 + version; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i % seed.length)
        hash = ((hash & hash) % range) + version
      }
      return min + (hash % range)
    }

    // Generates a random HSL colour using the options specified
    const randomHSL = (seed, version, alpha = 1) => {
      const lowerSaturation = Math.min(100, saturation * 100)
      const upperSaturation = Math.min(100, (saturation + 0.2) * 100)
      const lowerLightness = Math.min(100, lightness * 100)
      const upperLightness = Math.min(100, (lightness + 0.2) * 100)
      const hue = rangeHash(seed, 0, 360, version)
      const sat = `${rangeHash(
        seed,
        lowerSaturation,
        upperSaturation,
        version
      )}%`
      const light = `${rangeHash(
        seed,
        lowerLightness,
        upperLightness,
        version
      )}%`
      return `hsla(${hue},${sat},${light},${alpha})`
    }

    // Generates a radial gradient stop point
    const randomGradientPoint = (seed, version) => {
      const lowerTransparency = Math.min(100, softness * 100)
      const upperTransparency = Math.min(100, (softness + 0.2) * 100)
      const transparency = rangeHash(
        seed,
        lowerTransparency,
        upperTransparency,
        version
      )
      return (
        `radial-gradient(at ` +
        `${rangeHash(seed, 0, 100, version)}% ` +
        `${rangeHash(seed, 0, 100, version + 1)}%,` +
        `${randomHSL(seed, version, saturation)} 0,` +
        `transparent ${transparency}%)`
      )
    }

    let css = `opacity:0.9;background:${randomHSL(seed, version, 0.7)};`
    css += "background-image:"
    for (let i = 0; i < points - 1; i++) {
      css += `${randomGradientPoint(seed, version + i)},`
    }
    css += `${randomGradientPoint(seed, points)};`
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
