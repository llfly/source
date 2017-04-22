

exports.decode = exports.parse = require('./decode');

'use strict';

function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};

    if (typeof qs !== 'string' || qs.length === 0) {
        return obj;
    }

    var regexp = /\+/g;
    qs = qs.split(sep);

    var maxKeys = 1000;
    if (options && typeof options.maxKeys === 'number') {
        maxKeys = options.maxKeys;
    }

    var len = qs.length;
    // maxKeys <= 0 means that we should not limit keys count
    if (maxKeys > 0 && len > maxKeys) {
        len = maxKeys;
    }

    for (var i = 0; i < len; ++i) {
        var x = qs[i].replace(regexp, '%20'),//把+替换成空格
            idx = x.indexOf(eq),
            kstr, vstr, k, v;

        if (idx >= 0) {
            kstr = x.substr(0, idx);
            vstr = x.substr(idx + 1);
        } else {
            kstr = x;
            vstr = '';
        }

        k = decodeURIComponent(kstr);//%20 => ' '
        v = decodeURIComponent(vstr);

        if (!hasOwnProperty(obj, k)) {//k不是obj自身（不继承）属性
            obj[k] = v;
        } else if (Array.isArray(obj[k])) {//k属性已存在，且是数组，push
            obj[k].push(v);
        } else {//巧妙 k值存在且不为数组（第二次出现），将k之前对应的v值和v存入数组中
            obj[k] = [obj[k], v];
        }
    }

    return obj;
};




exports.encode = exports.stringify = require('./encode');




'use strict';

var stringifyPrimitive = function(v) {
    switch (typeof v) {
        case 'string':
            return v;

        case 'boolean':
            return v ? 'true' : 'false';

        case 'number':
            return isFinite(v) ? v : '';//isFinite() 函数用于检查其参数是否是无穷大

        default:
            return '';
    }
};

module.exports = function(obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
        obj = undefined;
    }

    if (typeof obj === 'object') {
        return Object.keys(obj).map(function(k) {
            var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
            if (Array.isArray(obj[k])) {
                return obj[k].map(function(v) {
                    return ks + encodeURIComponent(stringifyPrimitive(v));
                }).join(sep);
            } else {
                return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
            }
        }).join(sep);

    }

    if (!name) return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq +
        encodeURIComponent(stringifyPrimitive(obj));
};
