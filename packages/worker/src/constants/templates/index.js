const { readStaticFile } = require("../../utilities/fileSystem")
const { EmailTemplatePurpose } = require("../index")
const { join } = require("path")

const TEMPLATE_PATH = join(__dirname, "..", "constants", "templates")

exports.EmailTemplates = {
  [EmailTemplatePurpose.PASSWORD_RECOVERY]: readStaticFile(
    join(TEMPLATE_PATH, "passwordRecovery.html")
  ),
  [EmailTemplatePurpose.INVITATION]: readStaticFile(
    join(TEMPLATE_PATH, "invitation.html")
  ),
  [EmailTemplatePurpose.HEADER]: readStaticFile(
    join(TEMPLATE_PATH, "header.html")
  ),
  [EmailTemplatePurpose.FOOTER]: readStaticFile(
    join(TEMPLATE_PATH, "footer.html")
  ),
  [EmailTemplatePurpose.STYLES]: readStaticFile(
    join(TEMPLATE_PATH, "style.css")
  ),
}

exports.getTemplateByPurpose = purpose => {
  if (exports.EmailTemplates[purpose]) {
    return exports.EmailTemplates[purpose]
  }
}
