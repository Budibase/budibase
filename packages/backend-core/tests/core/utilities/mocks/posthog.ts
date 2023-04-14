jest.mock("posthog-node", () => {
  return jest.fn().mockImplementation(() => {
    return {
      capture: jest.fn(),
    }
  })
})
