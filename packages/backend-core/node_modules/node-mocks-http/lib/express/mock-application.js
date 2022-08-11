'use strict';

var methods = require('methods');
var deprecate = require('depd')('express');

var app = exports = module.exports = {};
var trustProxyDefaultSymbol = '@@symbol:trust_proxy_default';

app.init = function(){
    this.cache = {};
    this.settings = {};
    this.engines = {};
    this.defaultConfiguration();
};

app.defaultConfiguration = function(){
    this.enable('x-powered-by');
    this.set('etag', 'weak');
    var env = process.env.NODE_ENV || 'development';
    this.set('env', env);
    this.set('query parser', 'extended');
    this.set('subdomain offset', 2);
    this.set('trust proxy', false);
    Object.defineProperty(this.settings, trustProxyDefaultSymbol, {
        configurable: true,
        value: true
    });

    this.locals = Object.create(null);
    this.mountpath = '/';
    this.locals.settings = this.settings;
    this.set('jsonp callback name', 'callback');

    if (env === 'production') {
        this.enable('view cache');
    }

    Object.defineProperty(this, 'router', {
        get: function() {
            throw new Error('\'app.router\' is deprecated!\nPlease see the 3.x to 4.x migration guide for details on how to update your app.');
        }
    });
};

app.lazyrouter = function() {};
app.handle = function() {};
app.route = function() {};
app.render = function() {};
app.listen = function() {};

app.use = function use() {
    return this;
};

app.engine = function() {
    return this;
};

app.param = function() {
    return this;
};

app.set = function(setting, val){
    if (arguments.length === 1) {
        return this.settings[setting];
    }

    this.settings[setting] = val;
    return this;
};

app.path = function(){
    return '';
};

app.enabled = function(setting){
    return !!this.set(setting);
};

app.disabled = function(setting){
    return !this.set(setting);
};

app.enable = function(setting){
    return this.set(setting, true);
};

app.disable = function(setting){
    return this.set(setting, false);
};

methods.forEach(function(method){
    app[method] = function(){
        return this;
    };
});

app.all = function(){
    return this;
};

app.del = deprecate.function(app.delete, 'app.del: Use app.delete instead');
