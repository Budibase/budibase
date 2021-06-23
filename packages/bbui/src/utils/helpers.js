export const generateID = () => {
  const rand = Math.random().toString(32).substring(2)

  // Starts with a letter so that its a valid DOM ID
  return `A${rand}`
}

export const capitalise = s => s.substring(0, 1).toUpperCase() + s.substring(1)
