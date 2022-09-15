const util = require("util")
const assert = require("assert")
const wrapEmitter = require("emitter-listener")
const async_hooks = require("async_hooks")

const CONTEXTS_SYMBOL = "cls@contexts"
const ERROR_SYMBOL = "error@context"

const DEBUG_CLS_HOOKED = process.env.DEBUG_CLS_HOOKED

let currentUid = -1

module.exports = {
  getNamespace: getNamespace,
  createNamespace: createNamespace,
  destroyNamespace: destroyNamespace,
  reset: reset,
  ERROR_SYMBOL: ERROR_SYMBOL,
}

function Namespace(name) {
  this.name = name
  // changed in 2.7: no default context
  this.active = null
  this._set = []
  this.id = null
  this._contexts = new Map()
  this._indent = 0
  this._hook = null
}

Namespace.prototype.set = function set(key, value) {
  if (!this.active) {
    throw new Error(
      "No context available. ns.run() or ns.bind() must be called first."
    )
  }

  this.active[key] = value

  if (DEBUG_CLS_HOOKED) {
    const indentStr = " ".repeat(this._indent < 0 ? 0 : this._indent)
    debug2(
      indentStr +
        "CONTEXT-SET KEY:" +
        key +
        "=" +
        value +
        " in ns:" +
        this.name +
        " currentUid:" +
        currentUid +
        " active:" +
        util.inspect(this.active, { showHidden: true, depth: 2, colors: true })
    )
  }

  return value
}

Namespace.prototype.get = function get(key) {
  if (!this.active) {
    if (DEBUG_CLS_HOOKED) {
      const asyncHooksCurrentId = async_hooks.currentId()
      const triggerId = async_hooks.triggerAsyncId()
      const indentStr = " ".repeat(this._indent < 0 ? 0 : this._indent)
      debug2(
        `${indentStr}CONTEXT-GETTING KEY NO ACTIVE NS: (${this.name}) ${key}=undefined currentUid:${currentUid} asyncHooksCurrentId:${asyncHooksCurrentId} triggerId:${triggerId} len:${this._set.length}`
      )
    }
    return undefined
  }
  if (DEBUG_CLS_HOOKED) {
    const asyncHooksCurrentId = async_hooks.executionAsyncId()
    const triggerId = async_hooks.triggerAsyncId()
    const indentStr = " ".repeat(this._indent < 0 ? 0 : this._indent)
    debug2(
      indentStr +
        "CONTEXT-GETTING KEY:" +
        key +
        "=" +
        this.active[key] +
        " (" +
        this.name +
        ") currentUid:" +
        currentUid +
        " active:" +
        util.inspect(this.active, { showHidden: true, depth: 2, colors: true })
    )
    debug2(
      `${indentStr}CONTEXT-GETTING KEY: (${this.name}) ${key}=${
        this.active[key]
      } currentUid:${currentUid} asyncHooksCurrentId:${asyncHooksCurrentId} triggerId:${triggerId} len:${
        this._set.length
      } active:${util.inspect(this.active)}`
    )
  }
  return this.active[key]
}

Namespace.prototype.createContext = function createContext() {
  // Prototype inherit existing context if created a new child context within existing context.
  let context = Object.create(this.active ? this.active : Object.prototype)
  context._ns_name = this.name
  context.id = currentUid

  if (DEBUG_CLS_HOOKED) {
    const asyncHooksCurrentId = async_hooks.executionAsyncId()
    const triggerId = async_hooks.triggerAsyncId()
    const indentStr = " ".repeat(this._indent < 0 ? 0 : this._indent)
    debug2(
      `${indentStr}CONTEXT-CREATED Context: (${
        this.name
      }) currentUid:${currentUid} asyncHooksCurrentId:${asyncHooksCurrentId} triggerId:${triggerId} len:${
        this._set.length
      } context:${util.inspect(context, {
        showHidden: true,
        depth: 2,
        colors: true,
      })}`
    )
  }

  return context
}

Namespace.prototype.run = function run(fn) {
  let context = this.createContext()
  this.enter(context)

  try {
    if (DEBUG_CLS_HOOKED) {
      const triggerId = async_hooks.triggerAsyncId()
      const asyncHooksCurrentId = async_hooks.executionAsyncId()
      const indentStr = " ".repeat(this._indent < 0 ? 0 : this._indent)
      debug2(
        `${indentStr}CONTEXT-RUN BEGIN: (${
          this.name
        }) currentUid:${currentUid} triggerId:${triggerId} asyncHooksCurrentId:${asyncHooksCurrentId} len:${
          this._set.length
        } context:${util.inspect(context)}`
      )
    }
    fn(context)
    return context
  } catch (exception) {
    if (exception) {
      exception[ERROR_SYMBOL] = context
    }
    throw exception
  } finally {
    if (DEBUG_CLS_HOOKED) {
      const triggerId = async_hooks.triggerAsyncId()
      const asyncHooksCurrentId = async_hooks.executionAsyncId()
      const indentStr = " ".repeat(this._indent < 0 ? 0 : this._indent)
      debug2(
        `${indentStr}CONTEXT-RUN END: (${
          this.name
        }) currentUid:${currentUid} triggerId:${triggerId} asyncHooksCurrentId:${asyncHooksCurrentId} len:${
          this._set.length
        } ${util.inspect(context)}`
      )
    }
    this.exit(context)
  }
}

Namespace.prototype.runAndReturn = function runAndReturn(fn) {
  let value
  this.run(function (context) {
    value = fn(context)
  })
  return value
}

/**
 * Uses global Promise and assumes Promise is cls friendly or wrapped already.
 * @param {function} fn
 * @returns {*}
 */
Namespace.prototype.runPromise = function runPromise(fn) {
  let context = this.createContext()
  this.enter(context)

  let promise = fn(context)
  if (!promise || !promise.then || !promise.catch) {
    throw new Error("fn must return a promise.")
  }

  if (DEBUG_CLS_HOOKED) {
    debug2(
      "CONTEXT-runPromise BEFORE: (" +
        this.name +
        ") currentUid:" +
        currentUid +
        " len:" +
        this._set.length +
        " " +
        util.inspect(context)
    )
  }

  return promise
    .then(result => {
      if (DEBUG_CLS_HOOKED) {
        debug2(
          "CONTEXT-runPromise AFTER then: (" +
            this.name +
            ") currentUid:" +
            currentUid +
            " len:" +
            this._set.length +
            " " +
            util.inspect(context)
        )
      }
      this.exit(context)
      return result
    })
    .catch(err => {
      err[ERROR_SYMBOL] = context
      if (DEBUG_CLS_HOOKED) {
        debug2(
          "CONTEXT-runPromise AFTER catch: (" +
            this.name +
            ") currentUid:" +
            currentUid +
            " len:" +
            this._set.length +
            " " +
            util.inspect(context)
        )
      }
      this.exit(context)
      throw err
    })
}

Namespace.prototype.bind = function bindFactory(fn, context) {
  if (!context) {
    if (!this.active) {
      context = this.createContext()
    } else {
      context = this.active
    }
  }

  let self = this
  return function clsBind() {
    self.enter(context)
    try {
      return fn.apply(this, arguments)
    } catch (exception) {
      if (exception) {
        exception[ERROR_SYMBOL] = context
      }
      throw exception
    } finally {
      self.exit(context)
    }
  }
}

Namespace.prototype.enter = function enter(context) {
  assert.ok(context, "context must be provided for entering")
  if (DEBUG_CLS_HOOKED) {
    const asyncHooksCurrentId = async_hooks.executionAsyncId()
    const triggerId = async_hooks.triggerAsyncId()
    const indentStr = " ".repeat(this._indent < 0 ? 0 : this._indent)
    debug2(
      `${indentStr}CONTEXT-ENTER: (${
        this.name
      }) currentUid:${currentUid} triggerId:${triggerId} asyncHooksCurrentId:${asyncHooksCurrentId} len:${
        this._set.length
      } ${util.inspect(context)}`
    )
  }

  this._set.push(this.active)
  this.active = context
}

Namespace.prototype.exit = function exit(context) {
  assert.ok(context, "context must be provided for exiting")
  if (DEBUG_CLS_HOOKED) {
    const asyncHooksCurrentId = async_hooks.executionAsyncId()
    const triggerId = async_hooks.triggerAsyncId()
    const indentStr = " ".repeat(this._indent < 0 ? 0 : this._indent)
    debug2(
      `${indentStr}CONTEXT-EXIT: (${
        this.name
      }) currentUid:${currentUid} triggerId:${triggerId} asyncHooksCurrentId:${asyncHooksCurrentId} len:${
        this._set.length
      } ${util.inspect(context)}`
    )
  }

  // Fast path for most exits that are at the top of the stack
  if (this.active === context) {
    assert.ok(this._set.length, "can't remove top context")
    this.active = this._set.pop()
    return
  }

  // Fast search in the stack using lastIndexOf
  let index = this._set.lastIndexOf(context)

  if (index < 0) {
    if (DEBUG_CLS_HOOKED) {
      debug2(
        "??ERROR?? context exiting but not entered - ignoring: " +
          util.inspect(context)
      )
    }
    assert.ok(
      index >= 0,
      "context not currently entered; can't exit. \n" +
        util.inspect(this) +
        "\n" +
        util.inspect(context)
    )
  } else {
    assert.ok(index, "can't remove top context")
    this._set.splice(index, 1)
  }
}

Namespace.prototype.bindEmitter = function bindEmitter(emitter) {
  assert.ok(
    emitter.on && emitter.addListener && emitter.emit,
    "can only bind real EEs"
  )

  let namespace = this
  let thisSymbol = "context@" + this.name

  // Capture the context active at the time the emitter is bound.
  function attach(listener) {
    if (!listener) {
      return
    }
    if (!listener[CONTEXTS_SYMBOL]) {
      listener[CONTEXTS_SYMBOL] = Object.create(null)
    }

    listener[CONTEXTS_SYMBOL][thisSymbol] = {
      namespace: namespace,
      context: namespace.active,
    }
  }

  // At emit time, bind the listener within the correct context.
  function bind(unwrapped) {
    if (!(unwrapped && unwrapped[CONTEXTS_SYMBOL])) {
      return unwrapped
    }

    let wrapped = unwrapped
    let unwrappedContexts = unwrapped[CONTEXTS_SYMBOL]
    Object.keys(unwrappedContexts).forEach(function (name) {
      let thunk = unwrappedContexts[name]
      wrapped = thunk.namespace.bind(wrapped, thunk.context)
    })
    return wrapped
  }

  wrapEmitter(emitter, attach, bind)
}

/**
 * If an error comes out of a namespace, it will have a context attached to it.
 * This function knows how to find it.
 *
 * @param {Error} exception Possibly annotated error.
 */
Namespace.prototype.fromException = function fromException(exception) {
  return exception[ERROR_SYMBOL]
}

function getNamespace(name) {
  return process.namespaces[name]
}

function createNamespace(name) {
  assert.ok(name, "namespace must be given a name.")

  if (DEBUG_CLS_HOOKED) {
    debug2(`NS-CREATING NAMESPACE (${name})`)
  }
  let namespace = new Namespace(name)
  namespace.id = currentUid

  const hook = async_hooks.createHook({
    init(asyncId, type, triggerId, resource) {
      currentUid = async_hooks.executionAsyncId()

      //CHAIN Parent's Context onto child if none exists. This is needed to pass net-events.spec
      // let initContext = namespace.active;
      // if(!initContext && triggerId) {
      //   let parentContext = namespace._contexts.get(triggerId);
      //   if (parentContext) {
      //     namespace.active = parentContext;
      //     namespace._contexts.set(currentUid, parentContext);
      //     if (DEBUG_CLS_HOOKED) {
      //       const indentStr = ' '.repeat(namespace._indent < 0 ? 0 : namespace._indent);
      //       debug2(`${indentStr}INIT [${type}] (${name}) WITH PARENT CONTEXT asyncId:${asyncId} currentUid:${currentUid} triggerId:${triggerId} active:${util.inspect(namespace.active, true)} resource:${resource}`);
      //     }
      //   } else if (DEBUG_CLS_HOOKED) {
      //       const indentStr = ' '.repeat(namespace._indent < 0 ? 0 : namespace._indent);
      //       debug2(`${indentStr}INIT [${type}] (${name}) MISSING CONTEXT asyncId:${asyncId} currentUid:${currentUid} triggerId:${triggerId} active:${util.inspect(namespace.active, true)} resource:${resource}`);
      //     }
      // }else {
      //   namespace._contexts.set(currentUid, namespace.active);
      //   if (DEBUG_CLS_HOOKED) {
      //     const indentStr = ' '.repeat(namespace._indent < 0 ? 0 : namespace._indent);
      //     debug2(`${indentStr}INIT [${type}] (${name}) asyncId:${asyncId} currentUid:${currentUid} triggerId:${triggerId} active:${util.inspect(namespace.active, true)} resource:${resource}`);
      //   }
      // }
      if (namespace.active) {
        namespace._contexts.set(asyncId, namespace.active)

        if (DEBUG_CLS_HOOKED) {
          const indentStr = " ".repeat(
            namespace._indent < 0 ? 0 : namespace._indent
          )
          debug2(
            `${indentStr}INIT [${type}] (${name}) asyncId:${asyncId} currentUid:${currentUid} triggerId:${triggerId} active:${util.inspect(
              namespace.active,
              { showHidden: true, depth: 2, colors: true }
            )} resource:${resource}`
          )
        }
      } else if (currentUid === 0) {
        // CurrentId will be 0 when triggered from C++. Promise events
        // https://github.com/nodejs/node/blob/master/doc/api/async_hooks.md#triggerid
        const triggerId = async_hooks.triggerAsyncId()
        const triggerIdContext = namespace._contexts.get(triggerId)
        if (triggerIdContext) {
          namespace._contexts.set(asyncId, triggerIdContext)
          if (DEBUG_CLS_HOOKED) {
            const indentStr = " ".repeat(
              namespace._indent < 0 ? 0 : namespace._indent
            )
            debug2(
              `${indentStr}INIT USING CONTEXT FROM TRIGGERID [${type}] (${name}) asyncId:${asyncId} currentUid:${currentUid} triggerId:${triggerId} active:${util.inspect(
                namespace.active,
                { showHidden: true, depth: 2, colors: true }
              )} resource:${resource}`
            )
          }
        } else if (DEBUG_CLS_HOOKED) {
          const indentStr = " ".repeat(
            namespace._indent < 0 ? 0 : namespace._indent
          )
          debug2(
            `${indentStr}INIT MISSING CONTEXT [${type}] (${name}) asyncId:${asyncId} currentUid:${currentUid} triggerId:${triggerId} active:${util.inspect(
              namespace.active,
              { showHidden: true, depth: 2, colors: true }
            )} resource:${resource}`
          )
        }
      }

      if (DEBUG_CLS_HOOKED && type === "PROMISE") {
        debug2(util.inspect(resource, { showHidden: true }))
        const parentId = resource.parentId
        const indentStr = " ".repeat(
          namespace._indent < 0 ? 0 : namespace._indent
        )
        debug2(
          `${indentStr}INIT RESOURCE-PROMISE [${type}] (${name}) parentId:${parentId} asyncId:${asyncId} currentUid:${currentUid} triggerId:${triggerId} active:${util.inspect(
            namespace.active,
            { showHidden: true, depth: 2, colors: true }
          )} resource:${resource}`
        )
      }
    },
    before(asyncId) {
      currentUid = async_hooks.executionAsyncId()
      let context

      /*
      if(currentUid === 0){
        // CurrentId will be 0 when triggered from C++. Promise events
        // https://github.com/nodejs/node/blob/master/doc/api/async_hooks.md#triggerid
        //const triggerId = async_hooks.triggerAsyncId();
        context = namespace._contexts.get(asyncId); // || namespace._contexts.get(triggerId);
      }else{
        context = namespace._contexts.get(currentUid);
      }
      */

      //HACK to work with promises until they are fixed in node > 8.1.1
      context =
        namespace._contexts.get(asyncId) || namespace._contexts.get(currentUid)

      if (context) {
        if (DEBUG_CLS_HOOKED) {
          const triggerId = async_hooks.triggerAsyncId()
          const indentStr = " ".repeat(
            namespace._indent < 0 ? 0 : namespace._indent
          )
          debug2(
            `${indentStr}BEFORE (${name}) asyncId:${asyncId} currentUid:${currentUid} triggerId:${triggerId} active:${util.inspect(
              namespace.active,
              { showHidden: true, depth: 2, colors: true }
            )} context:${util.inspect(context)}`
          )
          namespace._indent += 2
        }

        namespace.enter(context)
      } else if (DEBUG_CLS_HOOKED) {
        const triggerId = async_hooks.triggerAsyncId()
        const indentStr = " ".repeat(
          namespace._indent < 0 ? 0 : namespace._indent
        )
        debug2(
          `${indentStr}BEFORE MISSING CONTEXT (${name}) asyncId:${asyncId} currentUid:${currentUid} triggerId:${triggerId} active:${util.inspect(
            namespace.active,
            { showHidden: true, depth: 2, colors: true }
          )} namespace._contexts:${util.inspect(namespace._contexts, {
            showHidden: true,
            depth: 2,
            colors: true,
          })}`
        )
        namespace._indent += 2
      }
    },
    after(asyncId) {
      currentUid = async_hooks.executionAsyncId()
      let context // = namespace._contexts.get(currentUid);
      /*
      if(currentUid === 0){
        // CurrentId will be 0 when triggered from C++. Promise events
        // https://github.com/nodejs/node/blob/master/doc/api/async_hooks.md#triggerid
        //const triggerId = async_hooks.triggerAsyncId();
        context = namespace._contexts.get(asyncId); // || namespace._contexts.get(triggerId);
      }else{
        context = namespace._contexts.get(currentUid);
      }
      */
      //HACK to work with promises until they are fixed in node > 8.1.1
      context =
        namespace._contexts.get(asyncId) || namespace._contexts.get(currentUid)

      if (context) {
        if (DEBUG_CLS_HOOKED) {
          const triggerId = async_hooks.triggerAsyncId()
          namespace._indent -= 2
          const indentStr = " ".repeat(
            namespace._indent < 0 ? 0 : namespace._indent
          )
          debug2(
            `${indentStr}AFTER (${name}) asyncId:${asyncId} currentUid:${currentUid} triggerId:${triggerId} active:${util.inspect(
              namespace.active,
              { showHidden: true, depth: 2, colors: true }
            )} context:${util.inspect(context)}`
          )
        }

        namespace.exit(context)
      } else if (DEBUG_CLS_HOOKED) {
        const triggerId = async_hooks.triggerAsyncId()
        namespace._indent -= 2
        const indentStr = " ".repeat(
          namespace._indent < 0 ? 0 : namespace._indent
        )
        debug2(
          `${indentStr}AFTER MISSING CONTEXT (${name}) asyncId:${asyncId} currentUid:${currentUid} triggerId:${triggerId} active:${util.inspect(
            namespace.active,
            { showHidden: true, depth: 2, colors: true }
          )} context:${util.inspect(context)}`
        )
      }
    },
    destroy(asyncId) {
      currentUid = async_hooks.executionAsyncId()
      if (DEBUG_CLS_HOOKED) {
        const triggerId = async_hooks.triggerAsyncId()
        const indentStr = " ".repeat(
          namespace._indent < 0 ? 0 : namespace._indent
        )
        debug2(
          `${indentStr}DESTROY (${name}) currentUid:${currentUid} asyncId:${asyncId} triggerId:${triggerId} active:${util.inspect(
            namespace.active,
            { showHidden: true, depth: 2, colors: true }
          )} context:${util.inspect(namespace._contexts.get(currentUid))}`
        )
      }

      namespace._contexts.delete(asyncId)
    },
  })

  hook.enable()
  namespace._hook = hook

  process.namespaces[name] = namespace
  return namespace
}

function destroyNamespace(name) {
  let namespace = getNamespace(name)

  assert.ok(namespace, "can't delete nonexistent namespace! \"" + name + '"')
  assert.ok(
    namespace.id,
    "don't assign to process.namespaces directly! " + util.inspect(namespace)
  )

  namespace._hook.disable()
  namespace._contexts = null
  process.namespaces[name] = null
}

function reset() {
  // must unregister async listeners
  if (process.namespaces) {
    Object.keys(process.namespaces).forEach(function (name) {
      destroyNamespace(name)
    })
  }
  process.namespaces = Object.create(null)
}

process.namespaces = process.namespaces || {}

//const fs = require('fs');
function debug2(...args) {
  if (DEBUG_CLS_HOOKED) {
    //fs.writeSync(1, `${util.format(...args)}\n`);
    process._rawDebug(`${util.format(...args)}`)
  }
}

/*function getFunctionName(fn) {
  if (!fn) {
    return fn;
  }
  if (typeof fn === 'function') {
    if (fn.name) {
      return fn.name;
    }
    return (fn.toString().trim().match(/^function\s*([^\s(]+)/) || [])[1];
  } else if (fn.constructor && fn.constructor.name) {
    return fn.constructor.name;
  }
}*/
