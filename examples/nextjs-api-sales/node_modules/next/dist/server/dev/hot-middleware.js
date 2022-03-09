"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
class WebpackHotMiddleware {
    constructor(compilers){
        this.onServerInvalid = ()=>{
            if (!this.serverError) return;
            this.serverError = false;
            if (this.clientLatestStats) {
                this.latestStats = this.clientLatestStats;
                this.publishStats('built', this.latestStats);
            }
        };
        this.onClientInvalid = ()=>{
            if (this.closed || this.serverError) return;
            this.latestStats = null;
            this.eventStream.publish({
                action: 'building'
            });
        };
        this.onServerDone = (statsResult)=>{
            if (this.closed) return;
            // Keep hold of latest stats so they can be propagated to new clients
            // this.latestStats = statsResult
            // this.publishStats('built', this.latestStats)
            this.serverError = statsResult.hasErrors();
            if (this.serverError) {
                this.latestStats = statsResult;
                this.publishStats('built', this.latestStats);
            }
        };
        this.onClientDone = (statsResult)=>{
            this.clientLatestStats = statsResult;
            if (this.closed || this.serverError) return;
            // Keep hold of latest stats so they can be propagated to new clients
            this.latestStats = statsResult;
            this.publishStats('built', this.latestStats);
        };
        this.onHMR = (client)=>{
            if (this.closed) return;
            this.eventStream.handler(client);
            if (this.latestStats) {
                // Explicitly not passing in `log` fn as we don't want to log again on
                // the server
                this.publishStats('sync', this.latestStats);
            }
        };
        this.publishStats = (action, statsResult)=>{
            const stats = statsResult.toJson({
                all: false,
                hash: true,
                warnings: true,
                errors: true
            });
            this.eventStream.publish({
                action: action,
                hash: stats.hash,
                warnings: stats.warnings || [],
                errors: stats.errors || []
            });
        };
        this.publish = (payload)=>{
            if (this.closed) return;
            this.eventStream.publish(payload);
        };
        this.close = ()=>{
            if (this.closed) return;
            // Can't remove compiler plugins, so we just set a flag and noop if closed
            // https://github.com/webpack/tapable/issues/32#issuecomment-350644466
            this.closed = true;
            this.eventStream.close();
        };
        this.eventStream = new EventStream();
        this.latestStats = null;
        this.clientLatestStats = null;
        this.serverError = false;
        this.closed = false;
        compilers[0].hooks.invalid.tap('webpack-hot-middleware', this.onClientInvalid);
        compilers[0].hooks.done.tap('webpack-hot-middleware', this.onClientDone);
        compilers[1].hooks.invalid.tap('webpack-hot-middleware', this.onServerInvalid);
        compilers[1].hooks.done.tap('webpack-hot-middleware', this.onServerDone);
    }
}
exports.WebpackHotMiddleware = WebpackHotMiddleware;
class EventStream {
    constructor(){
        this.clients = new Set();
    }
    everyClient(fn) {
        for (const client of this.clients){
            fn(client);
        }
    }
    close() {
        this.everyClient((client)=>{
            client.close();
        });
        this.clients.clear();
    }
    handler(client) {
        this.clients.add(client);
        client.addEventListener('close', ()=>{
            this.clients.delete(client);
        });
    }
    publish(payload) {
        this.everyClient((client)=>{
            client.send(JSON.stringify(payload));
        });
    }
}

//# sourceMappingURL=hot-middleware.js.map