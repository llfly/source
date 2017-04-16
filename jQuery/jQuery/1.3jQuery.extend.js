//jQuery工具方法


// expando: 生成唯一JQ字符串（内部）(数据缓存，事件操作，ajax)
// noConflict() : 防止冲突
// isReady: DOM是否加载完（内部）
// readyWait:等待多少文件的计数器（内部）
// holdReady():推迟DOM触发
// ready():准备DOM触发
// isFunction():是否为函数
// isArray():是否为数组
// isWindow():是否为window
// isNumberic():是否为数字
// type():判断数据类型
// isPlainObject():是否为对象自变量
// isEmptyObject():是否为空的对象
// error():抛出异常
// parseHTML():解析节点
// parseJSON():解析JSON
// parseXML():解析XML
// noop():空函数
// globalEval():全局解析JS
// camelCase():转驼峰
// nodeName():是否为指定节点名（内部）
// each():遍历集合
// trim():去前后空格
// makeArray():类数组转真数组
// isArray():数组版indexOf
// merge():合并数组
// grep():过滤新数组
// map():映射新数组
// guid:唯一标识符（内部）
// proxy():改this指向
// access():多功能值操作（内部）
// now():当前时间
// swap():css交换（内部）

//jQuery.ready.promise = function(){}



//demo


// console.log($.expando);


//防冲突
// var _ = $.noConflict();
// var $ = 123;

// _(function(){
// 	alert($);//123
// })

// var jQuery = 123;
// var test = $.noConflict(true);
// test(function(){
// 	alert(jQuery);
// })


//加载相关

//window.onload = function(){}//文件和DOM节点都加载完
//$(function(){});//DOM加载完
//通过DOMContentLoaded onload实现DOM 加载完毕

//使用方式
// 1. $(function(){})
// 2. $(document).ready(function(){})
// 3. $(document).on('ready',function(){})

//调用关系
// $(function(){}) -> $(document).ready(function(){}) -> 实例方法$().ready() -> 延迟对象jQuery.ready.promise().done(fn)
//-> if ( document.readyState === "complete" ) {  工具方法jQuery.ready()}
// else 监听DOMContentLoaded和load事件 回调函数completed内还是调用工具方法jQuery.ready()
// -> readyList.resolveWith(document, [jQuery]);


// jQuery.ready.promise = function(){};
// 监测DOM的异步操作（内部）
// function isArraylike(){}
// 检测DOM的异步操作（内部）


// 推迟
// 内部实现通过readyWait参数的自增自减实现，因此加载多个模块，多次调用


// $.holdReady(true)//推迟
// $.holdReady(false)//释放
// $(function(){alert(1)});


//使用

// $.holdReady(true);
// $.getScript('a.js',function(){
//     $.holdReady(false);
// });
// $(function(){alert(2)});


// $(fn) -> $(document).ready(fn) ->$().ready(fn) -> jQuery.ready.promise().done(fn){
// } -> $.ready() {readyList.resolveWith(document,[jQuery]);}

// $().ready();
// $.ready()



// // Handle when the DOM is ready
// 	ready: function( wait ) {

// 		// Abort if there are pending holds or we're already ready
// 		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
// 			return;
// 		}

// 		// Remember that the DOM is ready
// 		jQuery.isReady = true;

// 		// If a normal DOM Ready event fired, decrement, and wait if need be
// 		if ( wait !== true && --jQuery.readyWait > 0 ) {
// 			return;
// 		}

// 		// If there are functions bound, to execute
// 		readyList.resolveWith( document, [ jQuery ] );

// 		// Trigger any bound ready events
// 		if ( jQuery.fn.trigger ) {
// 			jQuery( document ).trigger("ready").off("ready");
// 		}
// 	}


//eval
//既是js关键字，也是window下的属性
//当直接使用时会在当前作用域中当做关键字来调用,window.eval不是关键字，是全局下的属性，使用变量保存的是全局下的属性，和window.eval一样。
function test(){
	eval('var a=1');
	
	alert(a);//可以获取a
}
test();
alert(a);//报错

function test(){
	//window.eval('var a=1');
	var val = eval;
	val('var a=1');
}
alert(a);//可以获取到






//access 内部方法









jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + (core_version + Math.random()).replace(/\D/g, ""),

	noConflict: function(deep) {
		if (window.$ === jQuery) {
			window.$ = _$;
		}

		if (deep && window.jQuery === jQuery) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function(hold) {
		if (hold) {
			jQuery.readyWait++;
		} else {
			jQuery.ready(true);
		}
	},

	// Handle when the DOM is ready
	ready: function(wait) {

		// Abort if there are pending holds or we're already ready
		if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if (wait !== true && --jQuery.readyWait > 0) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith(document, [jQuery]);

		// Trigger any bound ready events
		if (jQuery.fn.trigger) {
			jQuery(document).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	// 1.3版本之后不支持ie8以下原生方法和DOM方法typeof ,alert 等
	isFunction: function(obj) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function(obj) {
		//null == null undefined == null
		//除了null和undefined都可以执行obj === obj.window
		//window:全局对象或浏览器窗口
		return obj != null && obj === obj.window;//全局对象下的浏览器窗口
	},

	isNumeric: function(obj) {
		//typeof NaN  "number"
		//不是NaN&&有限数字
		return !isNaN(parseFloat(obj)) && isFinite(obj);
	},

	type: function(obj) {
		if (obj == null) {//undefined,null
			return String(obj);
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		// {}.toString.call(obj)
		// 下面通过each方法将class2type做了hash映射
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[core_toString.call(obj)] || "object" :
			typeof obj;
	},
	//是否为对象字面量(json或object)
	//{name:'llfly'}
	//new Object();
	isPlainObject: function(obj) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if (jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		// {}.hasOwnProperty.call(obj.constructor.prototype,'isPrototypeOf')
		// 判断isPrototypeOf是不是对象自身方法，只有对象字面量会返回真。
		// 火狐20以下版本频繁调用window.location.constructor会报错
		try {
			if (obj.constructor &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
				return false;
			}
		} catch (e) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},
	//通过判断内部是否有属性来判断是否为空对象
	//注：constructor不能通过for..in循环获取
	isEmptyObject: function(obj) {
		var name;
		for (name in obj) {
			return false;
		}
		return true;
	},
	//抛出异常
	error: function(msg) {
		throw new Error(msg);
	},
	//解析节点
	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function(data, context, keepScripts) {
		if (!data || typeof data !== "string") { //如果传入不是字符串,返回null
			return null;
		}
		if (typeof context === "boolean") {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec(data),
			scripts = !keepScripts && [];

		// Single tag
		if (parsed) {
			return [context.createElement(parsed[1])]; //如果单标签,创建返回
		}
		//利用文档碎片创建节点:第三个参数为[],处理后会添加script标签
		parsed = jQuery.buildFragment([data], context, scripts);

		if (scripts) {//如果第三个参数是假,则删除script标签
			jQuery(scripts).remove();//如果有标签,执行返回
		}
		//转成数组
		return jQuery.merge([], parsed.childNodes);
	},
	//将字符串解析成json
	//JSON.parse,eval
	//将json解析成string:jSON.stringify()
	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	// 解析XML
	parseXML: function(data) {
		var xml, tmp;
		if (!data || typeof data !== "string") {
			return null;
		}

		// Support: IE9
		try {
			//解析xml时标签必须为闭合标签
			//ie9下会报错，所以用try catch兼容
			tmp = new DOMParser();
			xml = tmp.parseFromString(data, "text/xml");
		} catch (e) {
			xml = undefined;
		}
		//其他浏览器不会报错，会创建parsererror节点
		if (!xml || xml.getElementsByTagName("parsererror").length) {
			jQuery.error("Invalid XML: " + data);
		}
		return xml;
	},
	//返回一个空函数，做插件或组件开发时默认参数为空函数时可直接调用
	noop: function() {},

	// Evaluates a script in a global context
	// 全局解析js
	globalEval: function(code) {
		var script,
			indirect = eval;

		code = jQuery.trim(code);
		//eval window.eval
		if (code) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			// 当前解析的字符串包不包含严格模式
			// 在严格模式下不支持eval解析，通过创建script标签的形式来转化成全局
			if (code.indexOf("use strict") === 1) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild(script).parentNode.removeChild(script);
			} else {
				// Otherwise, avoid the DOM node creation, insertion
				// and removal by using an indirect global eval
				indirect(code);
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	// 转驼峰，把js样式转换为css能接受的形式
	camelCase: function(string) {
		return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
	},
	//是否为指定节点名（内部方法）
	nodeName: function(elem, name) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function(obj, callback, args) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike(obj);

		if (args) {
			if (isArray) {
				for (; i < length; i++) {
					value = callback.apply(obj[i], args);

					if (value === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					value = callback.apply(obj[i], args);

					if (value === false) {
						break;
					}
				}
			}

			// A special, fast, case for the most common use of each
		} else {
			if (isArray) {
				for (; i < length; i++) {
					value = callback.call(obj[i], i, obj[i]);

					if (value === false) {
						break;
					}
				}
			} else {
				for (i in obj) {
					value = callback.call(obj[i], i, obj[i]);

					if (value === false) {
						break;
					}
				}
			}
		}

		return obj;
	},

	trim: function(text) {
		return text == null ? "" : core_trim.call(text);
	},

	// results is for internal usage only
	// 把其他类型转换为数组
	// 第二个参数内部用于转换成特殊形式的json{0:'data',length:1}
	makeArray: function(arr, results) {
		var ret = results || [];

		if (arr != null) {
			if (isArraylike(Object(arr))) {//有长度就为真
				jQuery.merge(ret,
					typeof arr === "string" ?
					[arr] : arr
				);
			} else {
				core_push.call(ret, arr);
			}
		}

		return ret;
	},

	inArray: function(elem, arr, i) {
		return arr == null ? -1 : core_indexOf.call(arr, elem, i);
	},

	//合并数组
	//['a','b'],['c','d']
	//['a','b'],{0:'c',1:'d'}
	//{0:'a',1:'b',length:2},{0:'c','0':d}
	//{0:'a',1:'b',length:2},['c','d']
	merge: function(first, second) {
		var l = second.length,
			i = first.length,
			j = 0;

		if (typeof l === "number") {//可能不是数组和类数组，是特殊形式json
			for (; j < l; j++) {
				first[i++] = second[j];
			}
		} else {
			while (second[j] !== undefined) {
				first[i++] = second[j++];
			}
		}

		first.length = i;//json的length属性不会自增，手动修改

		return first;
	},
	//过滤得到新数组
	//第三个参数为非
	grep: function(elems, callback, inv) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for (; i < length; i++) {
			retVal = !!callback(elems[i], i);
			if (inv !== retVal) {
				ret.push(elems[i]);
			}
		}

		return ret;
	},

	// arg is for internal usage only
	// 映射新数组
	map: function(elems, callback, arg) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike(elems),
			ret = [];

		// Go through the array, translating each of the items to their
		if (isArray) {
			for (; i < length; i++) {
				value = callback(elems[i], i, arg);

				if (value != null) {
					ret[ret.length] = value;
				}
			}

			// Go through every key on the object,
		} else {
			for (i in elems) {
				value = callback(elems[i], i, arg);

				if (value != null) {
					ret[ret.length] = value;
				}
			}
		}

		// Flatten any nested arrays
		// 避免成为复合数组
		return core_concat.apply([], ret);
	},

	// A global GUID counter for objects
	// 内部使用的唯一标识符
	// 通过它把事件和函数做关联
	guid: 1,

	// Bind a function to a context, optionally partially applying any arguments.
	// 修改this指向
	proxy: function(fn, context) {
		var tmp, args, proxy;

		if (typeof context === "string") {//第二个参数为字符串的话通过fn找到context，将fn作为上下文，tmp作为临时函数
			tmp = fn[context];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if (!jQuery.isFunction(fn)) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call(arguments, 2);
		proxy = function() {
			return fn.apply(context || this, args.concat(core_slice.call(arguments)));
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	// 多功能值操作（内部）
	// chainable:true:set /false:get
	access: function(elems, fn, key, value, chainable, emptyGet, raw) {
		var i = 0,
			length = elems.length,
			bulk = key == null;//key为空时

		// Sets many values
		// 设置多组值 key为json object
		if (jQuery.type(key) === "object") {
			chainable = true;
			for (i in key) {
				jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
			}

			//设置单组值，value必须要有值
		} else if (value !== undefined) {
			chainable = true;//手动修改chainable
			//判断value是不是function
			if (!jQuery.isFunction(value)) {
				raw = true;//如果value为string
			}

			if (bulk) {//没有key值的时候进行回调
				// Bulk operations run against the entire set
				if (raw) {//value为string
					fn.call(elems, value);
					fn = null;

					// ...except when executing function values
				} else {//value为function
					bulk = fn;
					fn = function(elem, key, value) {
						return bulk.call(jQuery(elem), value);
					};
				}
			}

			if (fn) {
				for (; i < length; i++) {
					fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
				}
			}
		}
		//获取
		return chainable ?
			elems ://返回当前元素

			// Gets
			bulk ?//没有key值
			fn.call(elems) :
			length ? fn(elems[0], key) : emptyGet;
	},
	//获取当前时间
	//(new Date()).getTime()
	//es5提供now方法
	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	// css交换(内部)
	swap: function(elem, options, callback, args) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for (name in options) {
			old[name] = elem.style[name];
			elem.style[name] = options[name];
		}

		ret = callback.apply(elem, args || []);

		// Revert the old values
		for (name in options) {
			elem.style[name] = old[name];
		}

		return ret;
	}
});


jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {
		//创建延迟对象
		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		// 当document文档正在加载时,返回"loading"
		// 当文档结束渲染但在加载内嵌资源时,返回"interactive"
		// 当文档加载完成时,返回"complete"

		// DOM已经加载好
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			// IE 会提前触发
			setTimeout( jQuery.ready );

		} else {//DOM还没有加载好，有些浏览器会缓存load事件，无论走哪个都调用completed，在回调函数里completed里取消这两个事件，保证回调只被触发一次。

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};


// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});


//判断数组，类数组，或特殊json
function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {//当前元素是否为window，排除干扰
		return false;
	}

	if ( obj.nodeType === 1 && length ) {//具有length的节点，类数组
		return true;
	}

	return type === "array" || type !== "function" &&//不是function再向下判断，排除function
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );//特殊json或arguments,-1 in arguments出错，所以先判断length === 0
}

rootjQuery = jQuery(document);
//jQuery.Deferred()
//readyList.promise
//jQuery.buildFragment
//DOMParser()
//isArraylike()