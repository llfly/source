'use strict';

var toStr = Object.prototype.toString;
var fnToStr = Function.prototype.toString;
var isFnRegex = /^\s*(?:function)?\*/;
var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
var getProto = Object.getPrototypeOf;



var getGeneratorFunc = function () { // eslint-disable-line consistent-return
    if (!hasToStringTag) {
        return false;
    }
    try {
        return Function('return function*() {}')();
    } catch (e) {
    }
};
var generatorFunc = getGeneratorFunc();
var GeneratorFunction = generatorFunc ? getProto(generatorFunc) : {};


//entry
const isGeneratorFunction = function (fn) {
    if (typeof fn !== 'function') {
        return false;
    }
    if (isFnRegex.test(fnToStr.call(fn))) {
        return true;
    }
    if (!hasToStringTag) {//Symbol 不存在  toString()比较
        var str = toStr.call(fn);
        return str === '[object GeneratorFunction]';
    }
    return getProto(fn) === GeneratorFunction;
};


const log = msg => console.log(msg);



//test
log(isGeneratorFunction(function *foo(){}));//true
log(isGeneratorFunction(function * foo(){}));//true
log(isGeneratorFunction(async function foo(){}));//false


module.exports = isGeneratorFunction;