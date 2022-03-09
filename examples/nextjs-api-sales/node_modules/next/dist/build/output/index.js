"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.startedDevelopmentServer = startedDevelopmentServer;
exports.formatAmpMessages = formatAmpMessages;
exports.ampValidation = ampValidation;
exports.watchCompilers = watchCompilers;
exports.reportTrigger = reportTrigger;
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _stripAnsi = _interopRequireDefault(require("next/dist/compiled/strip-ansi"));
var _textTable = _interopRequireDefault(require("next/dist/compiled/text-table"));
var _unistore = _interopRequireDefault(require("next/dist/compiled/unistore"));
var _formatWebpackMessages = _interopRequireDefault(require("../../client/dev/error-overlay/format-webpack-messages"));
var _store = require("./store");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function startedDevelopmentServer(appUrl, bindAddr) {
    _store.store.setState({
        appUrl,
        bindAddr
    });
}
let previousClient = null;
let previousServer = null;
let previousEdgeServer = null;
function formatAmpMessages(amp) {
    let output = _chalk.default.bold('Amp Validation') + '\n\n';
    let messages = [];
    const chalkError = _chalk.default.red('error');
    function ampError(page, error) {
        messages.push([
            page,
            chalkError,
            error.message,
            error.specUrl || ''
        ]);
    }
    const chalkWarn = _chalk.default.yellow('warn');
    function ampWarn(page, warn) {
        messages.push([
            page,
            chalkWarn,
            warn.message,
            warn.specUrl || ''
        ]);
    }
    for(const page in amp){
        let { errors , warnings  } = amp[page];
        const devOnlyFilter = (err)=>err.code !== 'DEV_MODE_ONLY'
        ;
        errors = errors.filter(devOnlyFilter);
        warnings = warnings.filter(devOnlyFilter);
        if (!(errors.length || warnings.length)) {
            continue;
        }
        if (errors.length) {
            ampError(page, errors[0]);
            for(let index = 1; index < errors.length; ++index){
                ampError('', errors[index]);
            }
        }
        if (warnings.length) {
            ampWarn(errors.length ? '' : page, warnings[0]);
            for(let index = 1; index < warnings.length; ++index){
                ampWarn('', warnings[index]);
            }
        }
        messages.push([
            '',
            '',
            '',
            ''
        ]);
    }
    if (!messages.length) {
        return '';
    }
    output += (0, _textTable).default(messages, {
        align: [
            'l',
            'l',
            'l',
            'l'
        ],
        stringLength (str) {
            return (0, _stripAnsi).default(str).length;
        }
    });
    return output;
}
const buildStore = (0, _unistore).default();
let buildWasDone = false;
let clientWasLoading = true;
let serverWasLoading = true;
let edgeServerWasLoading = false;
buildStore.subscribe((state)=>{
    const { amp , client , server , edgeServer , trigger  } = state;
    const { appUrl  } = _store.store.getState();
    if (client.loading || server.loading || (edgeServer === null || edgeServer === void 0 ? void 0 : edgeServer.loading)) {
        _store.store.setState({
            bootstrap: false,
            appUrl: appUrl,
            loading: true,
            trigger
        }, true);
        clientWasLoading = !buildWasDone && clientWasLoading || client.loading;
        serverWasLoading = !buildWasDone && serverWasLoading || server.loading;
        edgeServerWasLoading = !buildWasDone && serverWasLoading || !!(edgeServer === null || edgeServer === void 0 ? void 0 : edgeServer.loading);
        buildWasDone = false;
        return;
    }
    if (edgeServer === null || edgeServer === void 0 ? void 0 : edgeServer.loading) return;
    buildWasDone = true;
    let partialState = {
        bootstrap: false,
        appUrl: appUrl,
        loading: false,
        typeChecking: false,
        partial: clientWasLoading && (serverWasLoading || edgeServerWasLoading) ? 'client and server' : undefined,
        modules: (clientWasLoading ? client.modules : 0) + (serverWasLoading ? server.modules : 0) + (edgeServerWasLoading ? (edgeServer === null || edgeServer === void 0 ? void 0 : edgeServer.modules) || 0 : 0),
        hasEdgeServer: !!edgeServer
    };
    if (client.errors) {
        // Show only client errors
        _store.store.setState({
            ...partialState,
            errors: client.errors,
            warnings: null
        }, true);
    } else if (server.errors) {
        // Show only server errors
        _store.store.setState({
            ...partialState,
            errors: server.errors,
            warnings: null
        }, true);
    } else if (edgeServer && edgeServer.errors) {
        // Show only edge server errors
        _store.store.setState({
            ...partialState,
            errors: edgeServer.errors,
            warnings: null
        }, true);
    } else {
        // Show warnings from all of them
        const warnings = [
            ...client.warnings || [],
            ...server.warnings || [],
            ...edgeServer && edgeServer.warnings || [], 
        ].concat(formatAmpMessages(amp) || []);
        _store.store.setState({
            ...partialState,
            errors: null,
            warnings: warnings.length === 0 ? null : warnings
        }, true);
    }
});
function ampValidation(page, errors, warnings) {
    const { amp  } = buildStore.getState();
    if (!(errors.length || warnings.length)) {
        buildStore.setState({
            amp: Object.keys(amp).filter((k)=>k !== page
            ).sort()// eslint-disable-next-line no-sequences
            .reduce((a, c)=>(a[c] = amp[c], a)
            , {
            })
        });
        return;
    }
    const newAmp = {
        ...amp,
        [page]: {
            errors,
            warnings
        }
    };
    buildStore.setState({
        amp: Object.keys(newAmp).sort()// eslint-disable-next-line no-sequences
        .reduce((a, c)=>(a[c] = newAmp[c], a)
        , {
        })
    });
}
function watchCompilers(client, server, edgeServer) {
    if (previousClient === client && previousServer === server && previousEdgeServer === edgeServer) {
        return;
    }
    buildStore.setState({
        client: {
            loading: true
        },
        server: {
            loading: true
        },
        edgeServer: edgeServer ? {
            loading: true
        } : undefined,
        trigger: 'initial'
    });
    function tapCompiler(key, compiler, onEvent) {
        compiler.hooks.invalid.tap(`NextJsInvalid-${key}`, ()=>{
            onEvent({
                loading: true
            });
        });
        compiler.hooks.done.tap(`NextJsDone-${key}`, (stats)=>{
            buildStore.setState({
                amp: {
                }
            });
            const { errors , warnings  } = (0, _formatWebpackMessages).default(stats.toJson({
                preset: 'errors-warnings',
                moduleTrace: true
            }));
            const hasErrors = !!(errors === null || errors === void 0 ? void 0 : errors.length);
            const hasWarnings = !!(warnings === null || warnings === void 0 ? void 0 : warnings.length);
            onEvent({
                loading: false,
                modules: stats.compilation.modules.size,
                errors: hasErrors ? errors : null,
                warnings: hasWarnings ? warnings : null
            });
        });
    }
    tapCompiler('client', client, (status)=>{
        if (!status.loading && !buildStore.getState().server.loading) {
            buildStore.setState({
                client: status,
                trigger: undefined
            });
        } else {
            buildStore.setState({
                client: status
            });
        }
    });
    tapCompiler('server', server, (status)=>{
        if (!status.loading && !buildStore.getState().client.loading) {
            buildStore.setState({
                server: status,
                trigger: undefined
            });
        } else {
            buildStore.setState({
                server: status
            });
        }
    });
    if (edgeServer) {
        tapCompiler('edgeServer', edgeServer, (status)=>{
            buildStore.setState({
                edgeServer: status,
                trigger: undefined
            });
        });
    }
    previousClient = client;
    previousServer = server;
    previousEdgeServer = edgeServer;
}
function reportTrigger(trigger) {
    buildStore.setState({
        trigger
    });
}

//# sourceMappingURL=index.js.map