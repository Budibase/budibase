import { sendSmtpEmail } from "../../utilities/workerRequests"
import * as automationUtils from "../automationUtils"
import { SmtpEmailStepInputs, BaseAutomationOutputs } from "@budibase/types"

export async function run({
  inputs,
}: {
  inputs: SmtpEmailStepInputs
}): Promise<BaseAutomationOutputs> {
  let {
    to,
    from,
    subject,
    contents,
    cc,
    bcc,
    addInvite,
    startTime,
    endTime,
    summary,
    location,
    url,
    attachments,
  } = inputs
  if (!contents) {
    contents = "<h1>No content</h1>"
  }

  try {
    if (attachments) {
      if (Array.isArray(attachments)) {
        attachments.forEach(item => automationUtils.guardAttachment(item))
      } else {
        automationUtils.guardAttachment(attachments)
      }
    }

    let response = await sendSmtpEmail({
      to,
      from,
      subject,
      contents,
      cc,
      bcc,
      automation: true,
      attachments,
      invite: addInvite
        ? {
            startTime,
            endTime,
            summary,
            location,
            url,
          }
        : undefined,
    })
    return {
      success: true,
      response,
    }
  } catch (err) {
    return {
      success: false,
      response: automationUtils.getError(err),
    }
  }
}
