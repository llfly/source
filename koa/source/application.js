
'use strict';

/**
 * Module dependencies.
 */

const isGeneratorFunction = require('is-generator-function');
const debug = require('debug')('koa:application');
const onFinished = require('on-finished');
const response = require('./response');
const compose = require('koa-compose');
const isJSON = require('koa-is-json');
const context = require('./context');
const request = require('./request');
const statuses = require('statuses');
const Cookies = require('cookies');
const accepts = require('accepts');
const Emitter = require('events');
const assert = require('assert');
const Stream = require('stream');
const http = require('http');
const only = require('only');
const convert = require('koa-convert');
const deprecate = require('depd')('koa');

/**
 * Expose `Application` class.
 * Inherits from `Emitter.prototype`.
 */

module.exports = class Application extends Emitter {
    /**
     * Initialize a new `Application`.
     *
     * @api public
     */

    constructor() {
        super();

        this.proxy = false;
        this.middleware = [];
        this.subdomainOffset = 2;
        this.env = process.env.NODE_ENV || 'development';
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);
    }

    /**
     * Shorthand for:
     *
     *    http.createServer(app.callback()).listen(...)
     *
     * @param {Mixed} ...
     * @return {Server}
     * @api public
     */

    listen() {
        debug('listen');
        const server = http.createServer(this.callback());
        return server.listen.apply(server, arguments);
    }

    /**
     * Return JSON representation.
     * We only bother showing settings.
     *
     * @return {Object}
     * @api public
     */

    toJSON() {
        return only(this, [
            'subdomainOffset',
            'proxy',
            'env'
        ]);
    }

    /**
     * Inspect implementation.
     *
     * @return {Object}
     * @api public
     */

    inspect() {
        return this.toJSON();
    }

    /**
     * Use the given middleware `fn`.
     *
     * Old-style middleware will be converted.
     *
     * @param {Function} fn
     * @return {Application} self
     * @api public
     */

    use(fn) {
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
        if (isGeneratorFunction(fn)) {
            deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
            fn = convert(fn);               //通过convert转换generatorFunction
            // 实际上 convert 接收 function 时通过 co 实现，接收 [] 时，通过 koa-convert 实现，上面做了限制 所以只会调用 co
        }
        debug('use %s', fn._name || fn.name || '-');
        this.middleware.push(fn);
        return this;
    }

    /**
     * Return a request handler callback
     * for node's native http server.
     *
     * @return {Function}
     * @api public
     */

    callback() {
        const fn = compose(this.middleware);                //执行middleware列表，并注入context,next

        if (!this.listeners('error').length) this.on('error', this.onerror);

        const handleRequest = (req, res) => {               //如果没有绑定事件
            res.statusCode = 404;                           //返回404
            const ctx = this.createContext(req, res);       //创建上下文对象
            const onerror = err => ctx.onerror(err);        //声明onerror事件
            const handleResponse = () => respond(ctx);      //
            onFinished(res, onerror);                       //执行finished,关闭socket
            return fn(ctx).then(handleResponse).catch(onerror);
        };

        return handleRequest;
    }

    /**
     * Initialize a new context.
     *
     * @api private
     */

    createContext(req, res) {
        const context = Object.create(this.context);                        //获得当前上下文对象
        const request = context.request = Object.create(this.request);
        const response = context.response = Object.create(this.response);
        context.app = request.app = response.app = this;
        context.req = request.req = response.req = req;
        context.res = request.res = response.res = res;
        request.ctx = response.ctx = context;
        request.response = response;
        response.request = request;
        context.originalUrl = request.originalUrl = req.url;            //原始url
        context.cookies = new Cookies(req, res, {                       //获得cookies,赋值给context.cookies
            keys: this.keys,
            secure: request.secure
        });
        request.ip = request.ips[0] || req.socket.remoteAddress || '';
        context.accept = request.accept = accepts(req);                 //赋值请求允许mine类型,赋给context
        context.state = {};
        return context;
    }

    /**
     * Default error handler.
     *
     * @param {Error} err
     * @api private
     */

    onerror(err) {
        assert(err instanceof Error, `non-error thrown: ${err}`);       //如果有异常,必须是error实例

        if (404 == err.status || err.expose) return;                    //如果404,直接return
        if (this.silent) return;

        const msg = err.stack || err.toString();
        console.error();
        console.error(msg.replace(/^/gm, '  '));                        //缩进,打印堆栈信息
        console.error();
    }
};

/**
 * Response helper.
 */

function respond(ctx) {
    // allow bypassing koa
    if (false === ctx.respond) return;                      //可以绕过koa执行函数 ???

    const res = ctx.res;
    if (!ctx.writable) return;                              //不可写,退出

    let body = ctx.body;
    const code = ctx.status;

    // ignore body
    if (statuses.empty[code]) {                             //204 205 304 缓存，返回空
        // strip headers
        ctx.body = null;
        return res.end();
    }

    if ('HEAD' == ctx.method) {                             //Head 方法   headersSent ???
        if (!res.headersSent && isJSON(body)) {
            ctx.length = Buffer.byteLength(JSON.stringify(body));
        }
        return res.end();
    }

    // status body
    if (null == body) {                                     //body为空
        body = ctx.message || String(code);                 //打出状态码和请求体
        if (!res.headersSent) {
            ctx.type = 'text';
            ctx.length = Buffer.byteLength(body);
        }
        return res.end(body);
    }

    // responses
    if (Buffer.isBuffer(body)) return res.end(body);        //如果是二进制
    if ('string' == typeof body) return res.end(body);      //如果是字符串
    if (body instanceof Stream) return body.pipe(res);      //如果是流,直接流入response

    // body: json
    body = JSON.stringify(body);                            //如果是json,返回string
    if (!res.headersSent) {
        ctx.length = Buffer.byteLength(body);
    }
    res.end(body);
}
