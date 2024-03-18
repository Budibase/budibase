import { createTransport } from "nodemailer"

export function mock() {
  // mock the email system
  const sendMailMock = jest.fn()
  // @ts-expect-error - official types don't include mock functions
  createTransport.mockReturnValue({
    sendMail: sendMailMock,
    verify: jest.fn(),
  })
  return sendMailMock
}
