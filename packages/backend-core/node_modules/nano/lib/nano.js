// Licensed under the Apache License, Version 2.0 (the 'License'); you may not
// use this file except in compliance with the License. You may obtain a copy of
// the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations under
// the License.

const { HttpsCookieAgent, HttpCookieAgent } = require('http-cookie-agent/http')
const { URL } = require('url')
const assert = require('assert')
const querystring = require('qs')
const axios = require('axios')
const { CookieJar } = require('tough-cookie')
const cookieJar = new CookieJar()
const stream = require('stream')
const pkg = require('../package.json')
const AGENT_DEFAULTS = { jar: cookieJar, keepAlive: true, maxSockets: 50, keepAliveMsecs: 30000 }
const SCRUBBED_STR = 'XXXXXX'
const defaultHttpAgent = new HttpCookieAgent(AGENT_DEFAULTS)
const defaultHttpsAgent = new HttpsCookieAgent(AGENT_DEFAULTS)
const ChangesReader = require('./changesreader.js')
const MultiPartFactory = require('./multipart.js')

function isEmpty (val) {
  return val == null || !(Object.keys(val) || val).length
}

function getCallback (opts, callback) {
  if (typeof opts === 'function') {
    callback = opts
    opts = {}
  }
  opts = opts || {}
  return {
    opts,
    callback
  }
}

// feed this any number of arguements, it will return true if
// any of them are missing (falsey)
function missing (...params) {
  return params.some(param => !param)
}

// calls the supplied callback or if not supplied, returns a rejected promise
function callbackOrRejectError (callback, error = new Error('Invalid parameters')) {
  if (callback) {
    return callback(error, null)
  } else {
    return Promise.reject(error)
  }
}

module.exports = exports = function dbScope (cfg) {
  let serverScope = {}

  if (typeof cfg === 'string') {
    cfg = { url: cfg }
  }

  assert.strictEqual(typeof cfg, 'object',
    'You must specify the endpoint url when invoking this module')
  assert.ok(/^https?:/.test(cfg.url), 'url is not valid')

  cfg = Object.assign({}, cfg)

  serverScope.config = cfg
  cfg.requestDefaults = cfg.requestDefaults || {}

  const dummyLogger = () => {}
  const log = typeof cfg.log === 'function' ? cfg.log : dummyLogger
  const parseUrl = 'parseUrl' in cfg ? cfg.parseUrl : true

  function maybeExtractDatabaseComponent () {
    if (!parseUrl) {
      return
    }

    const path = new URL(cfg.url)
    const pathArray = path.pathname.split('/').filter(function (e) { return e })
    const db = pathArray.pop()
    const rootPath = path.pathname.replace(/\/?$/, '/..')

    if (db) {
      cfg.url = urlResolveFix(cfg.url, rootPath).replace(/\/?$/, '')
      return db
    }
  }

  function scrubURL (str) {
    if (str) {
      str = str.replace(/\/\/(.*)@/, `//${SCRUBBED_STR}:${SCRUBBED_STR}@`)
    }
    return str
  }

  function scrubRequest (req, cloned) {
    // scrub credentials
    req.url = scrubURL(req.url)
    if (req.headers.cookie) {
      req.headers.cookie = 'XXXXXXX'
    }
    if (req.auth) {
      if (!cloned) {
        req.auth = JSON.parse(JSON.stringify(req.auth)) // clone just auth if not already cloned
      }
      req.auth.username = SCRUBBED_STR
      req.auth.password = SCRUBBED_STR
    }
  }

  const responseHandler = function (response, req, opts, resolve, reject, callback) {
    const statusCode = response.status || (response.response && response.response.status) || 500
    if (response.isAxiosError && response.response) {
      response = response.response
    }
    let body = response.data
    response.statusCode = statusCode

    // let parsed
    const responseHeaders = Object.assign({
      uri: scrubURL(req.url),
      statusCode
    }, response.headers)
    if (!response.status) {
      if (axios.isCancel(response)) {
        if (resolve) {
          resolve('canceled')
        }
        if (callback) {
          callback(null, 'canceled', responseHeaders)
        }
        return
      }

      log({ err: 'socket', body, headers: responseHeaders })
      if (reject) {
        reject(new Error(`error happened in your connection. Reason: ${response.message}`))
      }
      if (callback) {
        const returnError = new Error(`error happened in your connection. Reason: ${response.message}`)
        returnError.scope = 'socket'
        returnError.errid = 'request'
        callback(returnError)
      }
      return
    }

    delete responseHeaders.server
    delete responseHeaders['content-length']

    /* if (opts.dontParse) {
      parsed = body
    } else {
      try { parsed = JSON.parse(body) } catch (err) { parsed = body }
    } */

    if (statusCode >= 200 && statusCode < 400) {
      log({ err: null, body, headers: responseHeaders })
      if (resolve) {
        resolve(body)
      }
      if (callback) {
        callback(null, body, responseHeaders)
      }
      return
    }

    // cloudant stacktrace
    if (typeof body === 'string') {
      body = { message: body }
    }

    if (!body.message && (body.reason || body.error)) {
      body.message = (body.reason || body.error)
    }

    // fix cloudant issues where they give an erlang stacktrace as js
    delete body.stack

    // scrub credentials
    scrubRequest(req)

    log({ err: 'couch', body, headers: responseHeaders })

    const message = body.message || 'couch returned ' + statusCode
    const errors = new Error(message)
    errors.scope = 'couch'
    errors.statusCode = statusCode
    errors.request = req
    errors.headers = responseHeaders
    errors.errid = 'non_200'
    errors.name = 'Error'
    errors.description = message
    // add any attributes from the HTTP response into the
    // Error object (except message, which would overwrite
    // the text message of the Error)
    delete body.message
    Object.assign(errors, body)

    if (reject) {
      reject(errors)
    }
    if (callback) {
      callback(errors)
    }
  }

  const streamResponseHandler = function (response, req, stream) {
    const statusCode = response.status || (response.response && response.response.status) || 500
    if (response.isAxiosError && response.response) {
      response = response.response
    }
    const message = response.statusText

    scrubRequest(req)

    const responseHeaders = Object.assign({
      uri: req.url,
      statusCode
    }, response.headers)

    const error = new Error(message)
    error.scope = 'couch'
    error.statusCode = statusCode
    error.request = req
    error.headers = responseHeaders
    error.errid = 'non_200'
    error.name = 'Error'
    error.description = message
    error.reason = message

    log({ err: 'couch', body: message, headers: responseHeaders })

    stream.emit('error', error)
  }

  function relax (opts, callback) {
    if (typeof opts === 'function') {
      callback = opts
      opts = { path: '' }
    }

    if (typeof opts === 'string') {
      opts = { path: opts }
    }

    if (!opts) {
      opts = { path: '' }
      callback = null
    }

    const qs = Object.assign({}, opts.qs)

    const headers = {
      'content-type': 'application/json',
      accept: 'application/json',
      'user-agent': `${pkg.name}/${pkg.version} (Node.js ${process.version})`,
      'Accept-Encoding': 'deflate, gzip'
    }

    const req = Object.assign({
      method: (opts.method || 'GET'),
      headers,
      uri: cfg.url
    }, {
      ...cfg.requestDefaults,
      headers: Object.assign(headers, cfg.requestDefaults && cfg.requestDefaults.headers ? cfg.requestDefaults.headers : {})
    })

    // https://github.com/mikeal/request#requestjar
    const isJar = opts.jar || cfg.jar || (cfg.requestDefaults && cfg.requestDefaults.jar)

    if (opts.signal) {
      req.signal = opts.signal
    }

    if (isJar) {
      req.jar = cookieJar
      req.withCredentials = true
    }

    // http://wiki.apache.org/couchdb/HTTP_database_API#Naming_and_Addressing
    if (opts.db) {
      req.uri = urlResolveFix(req.uri, encodeURIComponent(opts.db))
    }

    if (opts.multipart) {
      // generate the multipart/related body, header and boundary to
      // upload multiple binary attachments in one request
      const mp = new MultiPartFactory(opts.multipart)
      opts.contentType = mp.header
      req.body = mp.data
    }

    req.headers = Object.assign(req.headers, opts.headers, cfg.defaultHeaders)

    if (opts.path) {
      req.uri += '/' + opts.path
    } else if (opts.doc) {
      if (!/^_design|_local/.test(opts.doc)) {
        // http://wiki.apache.org/couchdb/HTTP_Document_API#Naming.2FAddressing
        req.uri += '/' + encodeURIComponent(opts.doc)
      } else {
        // http://wiki.apache.org/couchdb/HTTP_Document_API#Document_IDs
        req.uri += '/' + opts.doc
      }

      // http://wiki.apache.org/couchdb/HTTP_Document_API#Attachments
      if (opts.att) {
        req.uri += '/' + opts.att
      }
    }

    // prevent bugs where people set encoding when piping
    if (opts.encoding !== undefined) {
      req.encoding = opts.encoding
      delete req.headers['content-type']
      delete req.headers.accept
    }

    if (opts.contentType) {
      req.headers['content-type'] = opts.contentType
      delete req.headers.accept
    }

    if (opts.accept) {
      req.headers.accept = opts.accept
    }

    // http://guide.couchdb.org/draft/security.html#cookies
    if (cfg.cookie) {
      req.headers['X-CouchDB-WWW-Authenticate'] = 'Cookie'
      req.headers.cookie = cfg.cookie
    }

    // http://wiki.apache.org/couchdb/HTTP_view_API#Querying_Options
    if (typeof opts.qs === 'object' && !isEmpty(opts.qs)) {
      ['startkey', 'endkey', 'key', 'keys', 'start_key', 'end_key'].forEach(function (key) {
        if (key in opts.qs) {
          qs[key] = JSON.stringify(opts.qs[key])
        }
      })
      req.qs = qs
    }

    if (opts.body) {
      if (Buffer.isBuffer(opts.body) || opts.dontStringify) {
        req.body = opts.body
      } else {
        req.body = JSON.stringify(opts.body, function (key, value) {
          // don't encode functions
          if (typeof (value) === 'function') {
            return value.toString()
          } else {
            return value
          }
        })
      }
    }

    if (opts.form) {
      req.headers['content-type'] =
        'application/x-www-form-urlencoded; charset=utf-8'
      req.body = querystring.stringify(opts.form).toString('utf8')
    }

    // ask request to render query string arrays as repeated values e.g.
    // ?drilldown=["author","Dickens"]&drilldown=["publisher","Penguin"]
    req.qsStringifyOptions = { arrayFormat: 'repeat' }

    cfg.cookies = cookieJar.getCookiesSync(cfg.url)

    // This where the HTTP request is made.
    // Nano used to use the now-deprecated "request" library but now we're going to
    // use axios, so let's modify the "req" object to suit axios
    req.url = req.uri
    delete req.uri
    req.method = req.method.toLowerCase()
    req.params = req.qs
    delete req.qs
    req.paramsSerializer = {
      serialize: (params) => querystring.stringify(params, { arrayFormat: 'brackets' })
    }
    req.data = req.body
    delete req.body
    req.maxRedirects = 0
    if (opts.stream) {
      req.responseType = 'stream'
    } else if (opts.dontParse) {
      req.responseType = 'arraybuffer'
    }

    // scrub and log
    const scrubbedReq = {
      method: req.method,
      headers: JSON.parse(JSON.stringify(req.headers)),
      url: req.url
    }
    scrubRequest(scrubbedReq, true)
    log(scrubbedReq)

    // add http agents
    req.httpAgent = cfg.requestDefaults.agent || defaultHttpAgent
    req.httpsAgent = cfg.requestDefaults.agent || defaultHttpsAgent
    req.httpAgent.jar = req.httpAgent.jar ? req.httpAgent.jar : cookieJar
    req.httpsAgent.jar = req.httpsAgent.jar ? req.httpsAgent.jar : cookieJar
    const ax = axios.create({
      httpAgent: req.httpAgent,
      httpsAgent: req.httpsAgent
    })

    // actually do the HTTP request
    if (opts.stream) {
      // return the Request object for streaming
      const outStream = new stream.PassThrough()
      ax(req)
        .then((response) => {
          response.data.pipe(outStream)
        }).catch(e => {
          streamResponseHandler(e, req, outStream)
        })
      return outStream
    } else {
      if (typeof callback === 'function') {
        ax(req).then((response) => {
          responseHandler(response, req, opts, null, null, callback)
        }).catch((e) => {
          responseHandler(e, req, opts, null, null, callback)
        })
      } else {
        return new Promise((resolve, reject) => {
          ax(req).then((response) => {
            responseHandler(response, req, opts, resolve, reject)
          }).catch((e) => {
            responseHandler(e, req, opts, resolve, reject)
          })
        })
      }
    }
  }

  // http://docs.couchdb.org/en/latest/api/server/authn.html#cookie-authentication
  function auth (username, password, callback) {
    return relax({
      method: 'POST',
      db: '_session',
      form: {
        name: username,
        password
      }
    }, callback)
  }

  // http://docs.couchdb.org/en/latest/api/server/authn.html#post--_session
  function session (callback) {
    return relax({ db: '_session' }, callback)
  }

  // https://docs.couchdb.org/en/latest/api/server/common.html#api-server-root
  function info (callback) {
    return relax({ path: '' }, callback)
  }

  // http://docs.couchdb.org/en/latest/api/server/common.html#get--_db_updates
  function updates (qs0, callback0) {
    const { opts, callback } = getCallback(qs0, callback0)
    return relax({
      db: '_db_updates',
      qs: opts
    }, callback)
  }

  // http://docs.couchdb.org/en/latest/api/database/common.html#put--db
  function createDb (dbName, qs0, callback0) {
    const { opts, callback } = getCallback(qs0, callback0)
    if (missing(dbName)) {
      return callbackOrRejectError(callback)
    }
    return relax({ db: dbName, method: 'PUT', qs: opts }, callback)
  }

  // http://docs.couchdb.org/en/latest/api/database/common.html#delete--db
  function destroyDb (dbName, callback) {
    if (missing(dbName)) {
      return callbackOrRejectError(callback)
    }
    return relax({ db: dbName, method: 'DELETE' }, callback)
  }

  // http://docs.couchdb.org/en/latest/api/database/common.html#get--db
  function getDb (dbName, callback) {
    if (missing(dbName)) {
      return callbackOrRejectError(callback)
    }
    return relax({ db: dbName }, callback)
  }

  // http://docs.couchdb.org/en/latest/api/server/common.html#get--_all_dbs
  function listDbs (callback) {
    return relax({ db: '_all_dbs' }, callback)
  }

  // http://docs.couchdb.org/en/latest/api/server/common.html#get--_all_dbs
  function listDbsAsStream () {
    return relax({ db: '_all_dbs', stream: true })
  }

  // http://docs.couchdb.org/en/latest/api/database/compact.html#post--db-_compact
  function compactDb (dbName, ddoc, callback) {
    if (typeof ddoc === 'function') {
      callback = ddoc
      ddoc = null
    }
    if (missing(dbName)) {
      return callbackOrRejectError(callback)
    }
    return relax({
      db: dbName,
      doc: '_compact',
      att: ddoc,
      method: 'POST'
    }, callback)
  }

  // http://docs.couchdb.org/en/latest/api/database/changes.html#get--db-_changes
  function changesDb (dbName, qs0, callback0) {
    const { opts, callback } = getCallback(qs0, callback0)
    if (missing(dbName)) {
      return callbackOrRejectError(callback)
    }
    return relax({ db: dbName, path: '_changes', qs: opts }, callback)
  }

  function changesDbAsStream (dbName, opts) {
    return relax({ db: dbName, path: '_changes', stream: true, qs: opts })
  }

  function _serializeAsUrl (db) {
    if (typeof db === 'object' && db.config && db.config.url && db.config.db) {
      return urlResolveFix(db.config.url, encodeURIComponent(db.config.db))
    } else {
      try {
        // if it parses, return it
        const parsed = new URL(db)
        return parsed.toString()
      } catch (e) {
        // otherwise treat it as a database name
        return urlResolveFix(cfg.url, encodeURIComponent(db))
      }
    }
  }

  // http://docs.couchdb.org/en/latest/api/server/common.html#post--_replicate
  function replicateDb (source, target, opts0, callback0) {
    const { opts, callback } = getCallback(opts0, callback0)

    if (missing(source, target)) {
      return callbackOrRejectError(callback)
    }

    // _replicate
    opts.source = _serializeAsUrl(source)
    opts.target = _serializeAsUrl(target)

    return relax({ db: '_replicate', body: opts, method: 'POST' }, callback)
  }

  // http://docs.couchdb.org/en/latest/api/server/common.html#uuids
  function uuids (count, callback) {
    if (typeof count === 'function') {
      callback = count
      count = 1
    }
    count = count || 1
    return relax({ method: 'GET', path: '_uuids', qs: { count } }, callback)
  }

  // http://guide.couchdb.org/draft/replication.html
  function enableReplication (source, target, opts0, callback0) {
    const { opts, callback } = getCallback(opts0, callback0)

    if (missing(source, target)) {
      return callbackOrRejectError(callback)
    }

    // _replicator
    opts.source = _serializeAsUrl(source)
    opts.target = _serializeAsUrl(target)

    return relax({ db: '_replicator', body: opts, method: 'POST' }, callback)
  }

  // http://guide.couchdb.org/draft/replication.html
  function queryReplication (id, opts0, callback0) {
    const { opts, callback } = getCallback(opts0, callback0)
    if (missing(id)) {
      return callbackOrRejectError(callback)
    }
    return relax({ db: '_replicator', method: 'GET', path: id, qs: opts }, callback)
  }

  // http://guide.couchdb.org/draft/replication.html
  function disableReplication (id, rev, opts0, callback0) {
    const { opts, callback } = getCallback(opts0, callback0)
    if (missing(id, rev)) {
      return callbackOrRejectError(callback)
    }
    const req = {
      db: '_replicator',
      method: 'DELETE',
      path: id,
      qs: Object.assign(opts, { rev })
    }
    return relax(req, callback)
  }

  function docModule (dbName) {
    let docScope = {}
    dbName = decodeURIComponent(dbName)

    // http://docs.couchdb.org/en/latest/api/document/common.html#put--db-docid
    // http://docs.couchdb.org/en/latest/api/database/common.html#post--db
    function insertDoc (doc, qs0, callback0) {
      const req = { db: dbName, body: doc, method: 'POST' }

      let { opts, callback } = getCallback(qs0, callback0)

      if (typeof opts === 'string') {
        opts = { docName: opts }
      }

      if (opts) {
        if (opts.docName) {
          req.doc = opts.docName
          req.method = 'PUT'
          delete opts.docName
        }
        req.qs = opts
      }

      return relax(req, callback)
    }

    // http://docs.couchdb.org/en/latest/api/document/common.html#delete--db-docid
    function destroyDoc (docName, rev, callback) {
      if (missing(docName)) {
        return callbackOrRejectError(callback)
      }

      return relax({
        db: dbName,
        doc: docName,
        method: 'DELETE',
        qs: { rev }
      }, callback)
    }

    // http://docs.couchdb.org/en/latest/api/document/common.html#get--db-docid
    function getDoc (docName, qs0, callback0) {
      const { opts, callback } = getCallback(qs0, callback0)

      if (missing(docName)) {
        return callbackOrRejectError(callback)
      }

      return relax({ db: dbName, doc: docName, qs: opts }, callback)
    }

    // http://docs.couchdb.org/en/latest/api/document/common.html#head--db-docid
    function headDoc (docName, callback) {
      if (missing(docName)) {
        return callbackOrRejectError(callback)
      }
      if (callback) {
        relax({
          db: dbName,
          doc: docName,
          method: 'HEAD',
          qs: {}
        }, callback)
      } else {
        // this function doesn't pass on the Promise from relax because it needs
        // to return the headers when resolving the Promise
        return new Promise(function (resolve, reject) {
          relax({
            db: dbName,
            doc: docName,
            method: 'HEAD',
            qs: {}
          }, function (err, body, headers) {
            if (err) {
              reject(err)
            } else {
              resolve(headers)
            }
          })
        })
      }
    }

    // http://docs.couchdb.org/en/latest/api/database/bulk-api.html#get--db-_all_docs
    function listDoc (qs0, callback0) {
      const { opts, callback } = getCallback(qs0, callback0)
      return relax({ db: dbName, path: '_all_docs', qs: opts }, callback)
    }

    // http://docs.couchdb.org/en/latest/api/database/bulk-api.html#get--db-_all_docs
    function listDocAsStream (opts) {
      return relax({ db: dbName, path: '_all_docs', qs: opts, stream: true })
    }

    // http://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_all_docs
    function fetchDocs (docNames, qs0, callback0) {
      const { opts, callback } = getCallback(qs0, callback0)
      opts.include_docs = true

      if (missing(docNames) || typeof docNames !== 'object' ||
          !docNames.keys || !Array.isArray(docNames.keys) ||
          docNames.keys.length === 0) {
        return callbackOrRejectError(callback)
      }

      return relax({
        db: dbName,
        path: '_all_docs',
        method: 'POST',
        qs: opts,
        body: docNames
      }, callback)
    }

    function fetchRevs (docNames, qs0, callback0) {
      const { opts, callback } = getCallback(qs0, callback0)

      if (missing(docNames) || typeof docNames !== 'object' ||
          !docNames.keys || !Array.isArray(docNames.keys) ||
          docNames.keys.length === 0) {
        return callbackOrRejectError(callback)
      }

      return relax({
        db: dbName,
        path: '_all_docs',
        method: 'POST',
        qs: opts,
        body: docNames
      }, callback)
    }

    function view (ddoc, viewName, meta, qs0, callback0) {
      const { opts, callback } = getCallback(qs0, callback0)

      if (missing(ddoc, viewName) && !meta.viewPath) {
        return callbackOrRejectError(callback)
      }

      if (typeof meta.stream !== 'boolean') {
        meta.stream = false
      }

      // prevent mutation of the client qs object by using a clone
      const qs1 = Object.assign({}, opts)

      const viewPath = meta.viewPath || '_design/' + ddoc + '/_' + meta.type +
            '/' + viewName

      if (meta.type === 'search') {
        return relax({
          db: dbName,
          path: viewPath,
          method: 'POST',
          body: qs1,
          stream: meta.stream
        }, callback)
      } else if (qs1 && qs1.keys) {
        const body = { keys: qs1.keys }
        delete qs1.keys
        return relax({
          db: dbName,
          path: viewPath,
          method: 'POST',
          qs: qs1,
          body,
          stream: meta.stream
        }, callback)
      } else if (qs1 && qs1.queries) {
        const body = { queries: qs1.queries }
        delete qs1.queries
        return relax({
          db: dbName,
          path: viewPath,
          method: 'POST',
          qs: qs1,
          body
        }, callback)
      } else {
        const req = {
          db: dbName,
          method: meta.method || 'GET',
          path: viewPath,
          qs: qs1,
          stream: meta.stream
        }

        if (meta.body) {
          req.body = meta.body
        }

        return relax(req, callback)
      }
    }

    // http://docs.couchdb.org/en/latest/api/ddoc/views.html#post--db-_design-ddoc-_view-view
    function viewDocs (ddoc, viewName, qs, callback) {
      return view(ddoc, viewName, { type: 'view' }, qs, callback)
    }

    // http://docs.couchdb.org/en/latest/api/ddoc/views.html#post--db-_design-ddoc-_view-view
    function viewDocsAsStream (ddoc, viewName, qs) {
      return view(ddoc, viewName, { type: 'view', stream: true }, qs)
    }

    // cloudant
    function viewSearch (ddoc, viewName, qs, callback) {
      return view(ddoc, viewName, { type: 'search' }, qs, callback)
    }

    // cloudant
    function viewSearchAsStream (ddoc, viewName, qs) {
      return view(ddoc, viewName, { type: 'search', stream: true }, qs)
    }

    // http://docs.couchdb.org/en/latest/api/ddoc/render.html#get--db-_design-ddoc-_show-func
    function showDoc (ddoc, viewName, docName, qs, callback) {
      if (missing(ddoc, viewName, docName)) {
        return callbackOrRejectError(callback)
      }

      return view(ddoc, viewName + '/' + docName, { type: 'show' }, qs, callback)
    }

    // http://docs.couchdb.org/en/latest/api/ddoc/render.html#put--db-_design-ddoc-_update-func-docid
    function updateWithHandler (ddoc, viewName, docName, body, callback) {
      if (typeof body === 'function') {
        callback = body
        body = undefined
      }
      if (missing(ddoc, viewName, docName)) {
        return callbackOrRejectError(callback)
      }
      return view(ddoc, viewName + '/' + encodeURIComponent(docName), {
        type: 'update',
        method: 'PUT',
        body
      }, callback)
    }

    function viewWithList (ddoc, viewName, listName, qs, callback) {
      return view(ddoc, listName + '/' + viewName, {
        type: 'list'
      }, qs, callback)
    }

    function viewWithListAsStream (ddoc, viewName, listName, qs, callback) {
      return view(ddoc, listName + '/' + viewName, {
        type: 'list', stream: true
      }, qs, callback)
    }

    // http://docs.couchdb.org/en/latest/api/database/bulk-api.html#post--db-_bulksDoc
    function bulksDoc (docs, qs0, callback0) {
      const { opts, callback } = getCallback(qs0, callback0)
      return relax({
        db: dbName,
        path: '_bulk_docs',
        body: docs,
        method: 'POST',
        qs: opts
      }, callback)
    }

    // http://docs.couchdb.org/en/latest/api/document/common.html#creating-multiple-attachments
    function insertMultipart (doc, attachments, qs, callback) {
      if (typeof qs === 'string') {
        qs = { docName: qs }
      }
      qs = qs || {}

      const docName = qs.docName
      delete qs.docName

      if (missing(doc, attachments, docName)) {
        return callbackOrRejectError(callback)
      }

      doc = Object.assign({ _attachments: {} }, doc)

      const multipart = []

      attachments.forEach(function (att) {
        doc._attachments[att.name] = {
          follows: true,
          length: Buffer.isBuffer(att.data) ? att.data.length : Buffer.byteLength(att.data),
          /* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
          content_type: att.content_type
        }
        multipart.push(att)
      })

      multipart.unshift({
        content_type: 'application/json',
        data: JSON.stringify(doc),
        name: 'document'
      })

      return relax({
        db: dbName,
        method: 'PUT',
        contentType: 'multipart/related',
        doc: docName,
        qs,
        multipart
      }, callback)
    }

    function getMultipart (docName, qs0, callback0) {
      const { opts, callback } = getCallback(qs0, callback0)
      opts.attachments = true

      if (missing(docName)) {
        return callbackOrRejectError(callback)
      }

      return relax({
        db: dbName,
        doc: docName,
        encoding: null,
        accept: 'multipart/related',
        qs: opts
      }, callback)
    }

    function insertAtt (docName, attName, att, contentType, qs0, callback0) {
      const { opts, callback } = getCallback(qs0, callback0)
      if (missing(docName, attName, att, contentType)) {
        return callbackOrRejectError(callback)
      }

      return relax({
        db: dbName,
        att: attName,
        method: 'PUT',
        contentType,
        doc: docName,
        qs: opts,
        body: att,
        dontStringify: true
      }, callback)
    }

    function getAtt (docName, attName, qs0, callback0) {
      const { opts, callback } = getCallback(qs0, callback0)

      if (missing(docName, attName)) {
        return callbackOrRejectError(callback)
      }

      return relax({
        db: dbName,
        att: attName,
        doc: docName,
        qs: opts,
        encoding: null,
        dontParse: true
      }, callback)
    }

    function getAttAsStream (docName, attName, opts) {
      return relax({
        db: dbName,
        att: attName,
        doc: docName,
        qs: opts,
        stream: true,
        encoding: null,
        dontParse: true
      })
    }

    function destroyAtt (docName, attName, qs, callback) {
      if (missing(docName, attName)) {
        return callbackOrRejectError(callback)
      }

      return relax({
        db: dbName,
        att: attName,
        method: 'DELETE',
        doc: docName,
        qs
      }, callback)
    }

    function find (query, callback) {
      if (missing(query) || typeof query !== 'object') {
        return callbackOrRejectError(callback)
      }

      return relax({
        db: dbName,
        path: '_find',
        method: 'POST',
        body: query
      }, callback)
    }

    function findAsStream (query) {
      return relax({
        db: dbName,
        path: '_find',
        method: 'POST',
        body: query,
        stream: true
      })
    }

    function createIndex (indexDef, callback) {
      if (missing(indexDef) || typeof indexDef !== 'object') {
        return callbackOrRejectError(callback)
      }

      return relax({
        db: dbName,
        path: '_index',
        method: 'POST',
        body: indexDef
      }, callback)
    }

    function partitionInfo (partitionKey, callback) {
      if (missing(partitionKey)) {
        return callbackOrRejectError(callback)
      }

      return relax({
        db: dbName,
        path: '_partition/' + encodeURIComponent(partitionKey)
      }, callback)
    }

    function partitionedList (partitionKey, qs0, callback0) {
      const { opts, callback } = getCallback(qs0, callback0)
      if (missing(partitionKey)) {
        return callbackOrRejectError(callback)
      }
      return relax({
        db: dbName,
        path: '_partition/' + encodeURIComponent(partitionKey) + '/_all_docs',
        qs: opts
      }, callback)
    }

    function partitionedListAsStream (partitionKey, qs) {
      return relax({
        db: dbName,
        path: '_partition/' + encodeURIComponent(partitionKey) + '/_all_docs',
        qs,
        stream: true
      })
    }

    function partitionedFind (partition, query, callback) {
      if (missing(partition, query) || typeof query !== 'object') {
        return callbackOrRejectError(callback)
      }

      return relax({
        db: dbName,
        path: '_partition/' + encodeURIComponent(partition) + '/_find',
        method: 'POST',
        body: query
      }, callback)
    }

    function partitionedFindAsStream (partition, query) {
      return relax({
        db: dbName,
        path: '_partition/' + encodeURIComponent(partition) + '/_find',
        method: 'POST',
        body: query,
        stream: true
      })
    }

    function partitionedSearch (partition, ddoc, searchName, opts, callback) {
      if (missing(partition, ddoc, searchName, opts) || typeof opts !== 'object') {
        return callbackOrRejectError(callback)
      }
      return relax({
        db: dbName,
        path: '_partition/' + encodeURIComponent(partition) + '/_design/' + ddoc + '/_search/' + searchName,
        qs: opts
      }, callback)
    }

    function partitionedSearchAsStream (partition, ddoc, searchName, opts) {
      return relax({
        db: dbName,
        path: '_partition/' + encodeURIComponent(partition) + '/_design/' + ddoc + '/_search/' + searchName,
        qs: opts,
        stream: true
      })
    }

    function partitionedView (partition, ddoc, viewName, opts, callback) {
      if (missing(partition, ddoc, viewName)) {
        return callbackOrRejectError(callback)
      }
      return relax({
        db: dbName,
        path: '_partition/' + encodeURIComponent(partition) + '/_design/' + ddoc + '/_view/' + viewName,
        qs: opts
      }, callback)
    }

    function partitionedViewAsStream (partition, ddoc, viewName, opts) {
      return relax({
        db: dbName,
        path: '_partition/' + encodeURIComponent(partition) + '/_design/' + ddoc + '/_view/' + viewName,
        qs: opts,
        stream: true
      })
    }

    // db level exports
    docScope = {
      info: function (cb) {
        return getDb(dbName, cb)
      },
      replicate: function (target, opts, cb) {
        return replicateDb(dbName, target, opts, cb)
      },
      compact: function (cb) {
        return compactDb(dbName, cb)
      },
      changes: function (qs, cb) {
        return changesDb(dbName, qs, cb)
      },
      changesAsStream: function (qs) {
        return changesDbAsStream(dbName, qs)
      },
      changesReader: new ChangesReader(dbName, relax),
      auth,
      session,
      insert: insertDoc,
      get: getDoc,
      head: headDoc,
      destroy: destroyDoc,
      bulk: bulksDoc,
      list: listDoc,
      listAsStream: listDocAsStream,
      fetch: fetchDocs,
      fetchRevs,
      config: { url: cfg.url, db: dbName },
      multipart: {
        insert: insertMultipart,
        get: getMultipart
      },
      attachment: {
        insert: insertAtt,
        get: getAtt,
        getAsStream: getAttAsStream,
        destroy: destroyAtt
      },
      show: showDoc,
      atomic: updateWithHandler,
      updateWithHandler,
      baseView: view,
      search: viewSearch,
      searchAsStream: viewSearchAsStream,
      view: viewDocs,
      viewAsStream: viewDocsAsStream,
      find,
      findAsStream,
      createIndex,
      viewWithList,
      viewWithListAsStream,
      server: serverScope,
      replication: {
        enable: function (target, opts, cb) {
          return enableReplication(dbName, target, opts, cb)
        },
        disable: function (id, revision, opts, cb) {
          return disableReplication(id, revision, opts, cb)
        },
        query: function (id, opts, cb) {
          return queryReplication(id, opts, cb)
        }
      },
      partitionInfo,
      partitionedList,
      partitionedListAsStream,
      partitionedFind,
      partitionedFindAsStream,
      partitionedSearch,
      partitionedSearchAsStream,
      partitionedView,
      partitionedViewAsStream
    }

    docScope.view.compact = function (ddoc, cb) {
      return compactDb(dbName, ddoc, cb)
    }

    return docScope
  }

  // server level exports
  serverScope = Object.assign(serverScope, {
    db: {
      create: createDb,
      get: getDb,
      destroy: destroyDb,
      list: listDbs,
      listAsStream: listDbsAsStream,
      use: docModule,
      scope: docModule,
      compact: compactDb,
      replicate: replicateDb,
      replication: {
        enable: enableReplication,
        disable: disableReplication,
        query: queryReplication
      },
      changes: changesDb,
      updates
    },
    use: docModule,
    scope: docModule,
    request: relax,
    relax,
    dinosaur: relax,
    auth,
    session,
    updates,
    uuids,
    info
  })

  const db = maybeExtractDatabaseComponent()

  return db ? docModule(db) : serverScope
}

/*
 * and now an ascii dinosaur
 *              _
 *            / _) ROAR! i'm a vegan!
 *     .-^^^-/ /
 *  __/       /
 * /__.|_|-|_|
 *
 * thanks for visiting! come again!
 */

function urlResolveFix (couchUrl, dbName) {
  if (/[^/]$/.test(couchUrl)) {
    couchUrl += '/'
  }
  return new URL(dbName, couchUrl).toString()
}
