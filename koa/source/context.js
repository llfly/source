
'use strict';

/**
 * Module dependencies.
 */

const createError = require('http-errors');
const httpAssert = require('http-assert');
const delegate = require('delegates');
const statuses = require('statuses');

/**
 * Context prototype.
 */

const proto = module.exports = {

  /**
   * util.inspect() implementation, which
   * just returns the JSON output.
   *
   * @return {Object}
   * @api public
   */

  inspect() {
    return this.toJSON();           //返回request,response,app,originalUrl,req,res,socket
  },

  /**
   * Return JSON representation.
   *
   * Here we explicitly invoke .toJSON() on each
   * object, as iteration will otherwise fail due
   * to the getters and cause utilities such as
   * clone() to fail.
   *
   * @return {Object}
   * @api public
   */

  toJSON() {                        //序列化调用时候,返回这些参数
    return {
      request: this.request.toJSON(),
      response: this.response.toJSON(),
      app: this.app.toJSON(),
      originalUrl: this.originalUrl,
      req: '<original node req>',
      res: '<original node res>',
      socket: '<original node socket>'
    };
  },

  /**
   * Similar to .throw(), adds assertion.
   *
   *    this.assert(this.user, 401, 'Please login!');
   *
   * See: https://github.com/jshttp/http-assert
   *
   * @param {Mixed} test
   * @param {Number} status
   * @param {String} message
   * @api public
   */

  assert: httpAssert,           //断言

  /**
   * Throw an error with `msg` and optional `status`
   * defaulting to 500. Note that these are user-level
   * errors, and the message may be exposed to the client.
   *
   *    this.throw(403)
   *    this.throw('name required', 400)
   *    this.throw(400, 'name required')
   *    this.throw('something exploded')
   *    this.throw(new Error('invalid'), 400);
   *    this.throw(400, new Error('invalid'));
   *
   * See: https://github.com/jshttp/http-errors
   *
   * @param {String|Number|Error} err, msg or status
   * @param {String|Number|Error} [err, msg or status]
   * @param {Object} [props]
   * @api public
   */

  throw() {                   //抛出异常
    throw createError.apply(null, arguments);
  },

  /**
   * Default error handling.
   *
   * @param {Error} err
   * @api private
   */

  onerror(err) {            //错误处理
    // don't do anything if there is no error.
    // this allows you to pass `this.onerror`
    // to node-style callbacks.
    if (null == err) return;      //没有错误，直接return

    //如果传入类型不是Error,抛出一个新异常
    if (!(err instanceof Error)) err = new Error(`non-error thrown: ${err}`);

    let headerSent = false;
    if (this.headerSent || !this.writable) {      //headerSend ???
      headerSent = err.headerSent = true;
    }

    // delegate
    this.app.emit('error', err, this);            //调用application的onerror方法发射error事件

    // nothing we can do here other
    // than delegate to the app-level
    // handler and log.
    if (headerSent) {                             //这里我们可以处理app级别处理和日志
      return;
    }

    const { res } = this;

    // first unset all headers
    if (typeof res.getHeaderNames === 'function') {
      res.getHeaderNames().forEach(name => res.removeHeader(name));
    } else {
      res._headers = {}; // Node < 7.7
    }

    // then set those specified
    //如果没有设置headers,则指定设置
    this.set(err.headers);

    // force text/plain
    //强制设置返回文本
    this.type = 'text';

    // ENOENT support
    //如果错误码是 ENOENT,返回404状态
    if ('ENOENT' == err.code) err.status = 404;

    // default to 500
    //如果没有异常码,返回500
    if ('number' != typeof err.status || !statuses[err.status]) err.status = 500;

    // respond
    const code = statuses[err.status];                //返回状态码
    const msg = err.expose ? err.message : code;      //设置错误信息
    this.status = err.status;                         //设置异常码
    this.length = Buffer.byteLength(msg);             //设置返回信息长度
    this.res.end(msg);                                //返回异常
  }
};

/**
 * Response delegation.
 */

delegate(proto, 'response')                   //response上面的方法赋给context
  .method('attachment')
  .method('redirect')
  .method('remove')
  .method('vary')
  .method('set')
  .method('append')
  .method('flushHeaders')
  .access('status')
  .access('message')
  .access('body')
  .access('length')
  .access('type')
  .access('lastModified')
  .access('etag')
  .getter('headerSent')
  .getter('writable');

/**
 * Request delegation.
 */

delegate(proto, 'request')                  //request上面的方法赋给context
  .method('acceptsLanguages')
  .method('acceptsEncodings')
  .method('acceptsCharsets')
  .method('accepts')
  .method('get')
  .method('is')
  .access('querystring')
  .access('idempotent')
  .access('socket')
  .access('search')
  .access('method')
  .access('query')
  .access('path')
  .access('url')
  .getter('origin')
  .getter('href')
  .getter('subdomains')
  .getter('protocol')
  .getter('host')
  .getter('hostname')
  .getter('header')
  .getter('headers')
  .getter('secure')
  .getter('stale')
  .getter('fresh')
  .getter('ips')
  .getter('ip');
