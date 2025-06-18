export const Octokit = jest.fn().mockImplementation(() => ({
  rest: {
    repos: {
      getContent: jest.fn(),
      listForUser: jest.fn(),
      get: jest.fn(),
    },
    users: {
      getByUsername: jest.fn(),
    },
  },
}))
