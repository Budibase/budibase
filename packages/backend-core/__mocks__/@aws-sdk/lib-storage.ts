export const Upload = jest.fn().mockImplementation(() => {
  return {
    done: jest.fn().mockReturnThis(),
  }
})
