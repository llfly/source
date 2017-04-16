//jQuery2.0.3
//http://olex.openlogic.com/packages/jquery/2.0.3#package_detail_tabs

//总体架构

//自执行匿名函数
(function() {
	//(21,94)定义变量和函数
	jQuery = function(selector, context) {
		return new jQuery.fn.init(selector, context, rootjQuery);
	};

	//(96,283) 给jQuery对象添加方法和属性

	//(285,347) extend:jQ的继承方法

	//(349,817) jQuery.extend():扩展一些工具方法

	//(877,2856) Sizzle :复杂选择器实现（是一款纯js实现的Css选择器引擎）

	//(2880,3042) Callbacks:回调对象：对函数统一管理

	//(3043,3183) Deferred:延迟对象：对异步统一管理

	//(3184,3295) support: 功能检测

	//(3308,3652) data(): 数据缓存(避免大数据量的元素挂载、预防内存泄露)

	//(3653,3797) queue :队列管理 dequeue

	//(3803,4299) attr() prop() val() addClass() 对元素属性的操作

	//(4300,5128) 事件操作相关方法(on、trigger等)

	//(5140,6057) DOM操作方法

	//(6058,6620) CSS样式操作方法

	//(6621,7854) 提交数据和ajax():跨域、请求script、ajax

	//(7855,8584) animate方法

	//(8585,8792) 位置，尺寸方法

	//(8804,8821) jQuery支持模块化模式

	//(8826) 对外提供接口
	window.jQuery = window.$ = jQuery;
})();

//--------------------------------------------------------------------------------------------------------------------------

//匿名函数自执行

(function(window, undefined) {
	// 对外提供接口，将局部变量jQuery绑到window对象上
	window.jQuery = window.$ = jQuery;
})(window);


//匿名函数
//形成闭包，封装局部变量，防止污染全局作用域。

//参数
//传入window
//减少作用域链的查找距离
//便于压缩


//传入undefined
//undefined是window的一个属性，不是关键字，也不是保留字，可被修改，防greenie修改。


//--------------------------------------------------------------------------------------------------------------------------

//参数说明(21-94)

(function(window, undefined) {

	//"use strict";
	var
	// 在866行 rootjQuery = jQuery(document);
	// 便于对根目录操作的压缩，将document变量提出，便于维护
		rootjQuery,

		// dom 加载相关(扩展工具方法和Sizzle中间部分),Deferred对象详见1.3jQuery.extend.js
		readyList,


		// 字符串形式的undefined
		// window.a == undefined; 不兼容ie9中xmlNode类型
		// typeof window.a == 'undefined'; 全兼容
		core_strundefined = typeof undefined,

		// 变量存储，便于压缩
		location = window.location,
		document = window.document,
		docElem = document.documentElement,

		// 防止冲突(详见扩展工具方法)
		_jQuery = window.jQuery,
		_$ = window.$,

		// 存放类型，用于$.type()类型判断
		// {['Object String']:'string',['Object Array']:'array'}
		class2type = {},

		// 老版本和数据缓存有关，进行id删除，新版本就是一个空数组
		core_deletedIds = [],

		// 版本号
		core_version = "2.0.3",

		// 数组，对象，字符串方法，便于压缩
		core_concat = core_deletedIds.concat,
		core_push = core_deletedIds.push,
		core_slice = core_deletedIds.slice,
		core_indexOf = core_deletedIds.indexOf,
		core_toString = class2type.toString,
		core_hasOwn = class2type.hasOwnProperty,
		core_trim = core_version.trim,

		// 入口函数
		jQuery = function(selector, context) {
			// 通过运算符new来创建并返回一个构造函数的实例，省去了构造函数jQuery()前面的运算符new，即我们创建jQuery对象时，可以省略运算符new直接写jQuery()
			return new jQuery.fn.init(selector, context, rootjQuery);
		},

		// 匹配数字(正数，负数，小数，科学计数法),css方法中使用
		core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

		// 匹配单词（方法：元素间不存在空格即为单词)
		core_rnotwhite = /\S+/g,

		// 正则匹配标签 | 匹配# id
		// 通过location.hash防止xss注入
		// <p>...</p>或者#div
		rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

		// 正则匹配空标签 <p></p> <div></div>
		rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

		// ms IE前缀处理
		// -webkit-margin-left : webkitMarginLeft
		// -ms-margin-left : MsMarginLeft
		rmsPrefix = /^-ms-/,
		// 正则匹配转换大写、数字
		rdashAlpha = /-([\da-z])/gi,

		// 转换成驼峰方法的回调函数
		fcamelCase = function(all, letter) {
			return letter.toUpperCase();
		},

		// dom加载成功触发的回调函数
		completed = function() {
			document.removeEventListener("DOMContentLoaded", completed, false);
			window.removeEventListener("load", completed, false);
			jQuery.ready();
		};
})(window);



//jQuery函数
/*
$(),jQuery() 都调用jQuery函数，返回一个对象new jQuery.fn.init(selector, context, rootjQuery);
而下面jQuery.fn引用jQuery.prototype，也就是返回一个jQuery原型上的init方法
*/


//通常情况下面向对象的方法
function Aaa() {}
Aaa.prototype.init = function() {};
Aaa.prototype.css = function() {};
var a1 = new Aaa();
a1.init();
a1.css();

//jQuery中面向对象的方法
function jQuery() {
	return new jQuery.prototype.init();
}
jQuery.prototype.init = function() {};
jQuery.prototype.css = function() {};
//283
jQuery.prototype.init.prototype = jQuery.prototype;
jQuery().css();


//jQuery对象是一个类数组的对象，含有连续的整形属性，length属性和大量的jQuery方法。jQuery对象由构造函数jQuery()创建，$()是jQuery()的简写。

this = {
	0: li,
	1: li,
	2: li,
	length: 3
}


jQuery = function(selector, context) {
	return new jQuery.fn.init(selector, context, rootjQuery); //返回jQuery的原型下面的init方法
}
jQuery.fn = jQuery.prototype;


//传统面向对象


function A() {}
A.prototype.init = function() {};
A.prototype.css = function() {};

var a1 = new A();
a1.init();
a1.css();


//jQuery面向对象


function jQuery() {
	return new jQuery.prototype.init();
}
jQuery.fn = jQuery.prototype = {
		constructor: jQuery,
		//真正的构造函数
		init: function() {},
		css: function() {}
	}
	//283
	//使init的原型有jQuery的原型
jQuery.fn.init.prototype = jQuery.prototype;

//扩展静态方法，扩展实例方法 用同一套代码实现
jQuery.extend = jQuery.fn.extend = function() {}



// jQuery源码框架组成
// 匿名函数自执行的优点
// 匿名函数对外接口设置
// window下挂载$()与jQuery()
// jQuery.prototype 原型、jQuery 基于面向对象的程序
// jQuery函数调用与jQuery对象调用方法
// jQuery中继承方法：extend
// jQuery扩展工具方法：$.trim()、$.proxy()……
// 静态方法和实例方法的关系和区别简要说明



//1. 防止代码冲突


//--------------------------------------------------------------------------------------------------------------------------

function fn1() {
	alert(1)
};

function fn2() {
	alert(2)
};

var cb = $.callback();
cb.add(fn1);
cb.add(fn2);
cb.fire(); //1,2

var dfd = $.Deferred();

setTimeout(function() {
	alert(1);
	dfd.resolve();
}, 1000);

dfd.done(function() {
	alert(2);
})

//没有挂载到元素身上
$('#div').data('name','hello');
$('#div').data('name');