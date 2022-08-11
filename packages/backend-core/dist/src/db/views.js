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
const { DocumentTypes, ViewNames, DeprecatedViews, SEPARATOR, } = require("./utils");
const { getGlobalDB } = require("../tenancy");
const DESIGN_DB = "_design/database";
function DesignDoc() {
    return {
        _id: DESIGN_DB,
        // view collation information, read before writing any complex views:
        // https://docs.couchdb.org/en/master/ddocs/views/collation.html#collation-specification
        views: {},
    };
}
function removeDeprecated(db, viewName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!DeprecatedViews[viewName]) {
            return;
        }
        try {
            const designDoc = yield db.get(DESIGN_DB);
            for (let deprecatedNames of DeprecatedViews[viewName]) {
                delete designDoc.views[deprecatedNames];
            }
            yield db.put(designDoc);
        }
        catch (err) {
            // doesn't exist, ignore
        }
    });
}
exports.createNewUserEmailView = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    let designDoc;
    try {
        designDoc = yield db.get(DESIGN_DB);
    }
    catch (err) {
        // no design doc, make one
        designDoc = DesignDoc();
    }
    const view = {
        // if using variables in a map function need to inject them before use
        map: `function(doc) {
      if (doc._id.startsWith("${DocumentTypes.USER}${SEPARATOR}")) {
        emit(doc.email.toLowerCase(), doc._id)
      }
    }`,
    };
    designDoc.views = Object.assign(Object.assign({}, designDoc.views), { [ViewNames.USER_BY_EMAIL]: view });
    yield db.put(designDoc);
});
exports.createUserAppView = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    let designDoc;
    try {
        designDoc = yield db.get("_design/database");
    }
    catch (err) {
        // no design doc, make one
        designDoc = DesignDoc();
    }
    const view = {
        // if using variables in a map function need to inject them before use
        map: `function(doc) {
      if (doc._id.startsWith("${DocumentTypes.USER}${SEPARATOR}") && doc.roles) {
        for (let prodAppId of Object.keys(doc.roles)) {
          let emitted = prodAppId + "${SEPARATOR}" + doc._id
          emit(emitted, null)
        }
      }
    }`,
    };
    designDoc.views = Object.assign(Object.assign({}, designDoc.views), { [ViewNames.USER_BY_APP]: view });
    yield db.put(designDoc);
});
exports.createApiKeyView = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    let designDoc;
    try {
        designDoc = yield db.get("_design/database");
    }
    catch (err) {
        designDoc = DesignDoc();
    }
    const view = {
        map: `function(doc) {
      if (doc._id.startsWith("${DocumentTypes.DEV_INFO}") && doc.apiKey) {
        emit(doc.apiKey, doc.userId)
      }
    }`,
    };
    designDoc.views = Object.assign(Object.assign({}, designDoc.views), { [ViewNames.BY_API_KEY]: view });
    yield db.put(designDoc);
});
exports.createUserBuildersView = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = getGlobalDB();
    let designDoc;
    try {
        designDoc = yield db.get("_design/database");
    }
    catch (err) {
        // no design doc, make one
        designDoc = DesignDoc();
    }
    const view = {
        map: `function(doc) {
      if (doc.builder && doc.builder.global === true) {
        emit(doc._id, doc._id)
      }
    }`,
    };
    designDoc.views = Object.assign(Object.assign({}, designDoc.views), { [ViewNames.USER_BY_BUILDERS]: view });
    yield db.put(designDoc);
});
exports.queryGlobalView = (viewName, params, db = null) => __awaiter(void 0, void 0, void 0, function* () {
    const CreateFuncByName = {
        [ViewNames.USER_BY_EMAIL]: exports.createNewUserEmailView,
        [ViewNames.BY_API_KEY]: exports.createApiKeyView,
        [ViewNames.USER_BY_BUILDERS]: exports.createUserBuildersView,
        [ViewNames.USER_BY_APP]: exports.createUserAppView,
    };
    // can pass DB in if working with something specific
    if (!db) {
        db = getGlobalDB();
    }
    try {
        let response = (yield db.query(`database/${viewName}`, params)).rows;
        response = response.map(resp => params.include_docs ? resp.doc : resp.value);
        return response.length <= 1 ? response[0] : response;
    }
    catch (err) {
        if (err != null && err.name === "not_found") {
            const createFunc = CreateFuncByName[viewName];
            yield removeDeprecated(db, viewName);
            yield createFunc();
            return exports.queryGlobalView(viewName, params);
        }
        else {
            throw err;
        }
    }
});
//# sourceMappingURL=views.js.map