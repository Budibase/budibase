"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { readStaticFile } = require("../../utilities/fileSystem");
const { EmailTemplatePurpose, TemplateTypes, TemplatePurpose, GLOBAL_OWNER, } = require("../index");
const { join } = require("path");
const { getTemplateParams } = require("@budibase/backend-core/db");
const { getGlobalDB } = require("@budibase/backend-core/tenancy");
exports.EmailTemplates = {
    [EmailTemplatePurpose.PASSWORD_RECOVERY]: readStaticFile(join(__dirname, "passwordRecovery.hbs")),
    [EmailTemplatePurpose.INVITATION]: readStaticFile(join(__dirname, "invitation.hbs")),
    [EmailTemplatePurpose.BASE]: readStaticFile(join(__dirname, "base.hbs")),
    [EmailTemplatePurpose.WELCOME]: readStaticFile(join(__dirname, "welcome.hbs")),
    [EmailTemplatePurpose.CUSTOM]: readStaticFile(join(__dirname, "custom.hbs")),
};
exports.addBaseTemplates = (templates, type = null) => {
    let purposeList;
    switch (type) {
        case TemplateTypes.EMAIL:
            purposeList = Object.values(EmailTemplatePurpose);
            break;
        default:
            purposeList = Object.values(TemplatePurpose);
            break;
    }
    for (let purpose of purposeList) {
        // check if a template exists already for purpose
        if (templates.find(template => template.purpose === purpose)) {
            continue;
        }
        if (exports.EmailTemplates[purpose]) {
            templates.push({
                contents: exports.EmailTemplates[purpose],
                purpose,
                type,
            });
        }
    }
    return templates;
};
exports.getTemplates = ({ ownerId, type, id } = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    const response = yield db.allDocs(getTemplateParams(ownerId || GLOBAL_OWNER, id, {
        include_docs: true,
    }));
    let templates = response.rows.map(row => row.doc);
    // should only be one template with ID
    if (id) {
        return templates[0];
    }
    if (type) {
        templates = templates.filter(template => template.type === type);
    }
    return exports.addBaseTemplates(templates, type);
});
exports.getTemplateByPurpose = (type, purpose) => __awaiter(void 0, void 0, void 0, function* () {
    const templates = yield exports.getTemplates({ type });
    return templates.find(template => template.purpose === purpose);
});
