//jQuery对象添加的方法和属性(96,283)

//主要内容
// 通过fn简写prototype,可以少写7个字符
// jQuery.fn = jQuery.prototype = { //添加实例方法和属性
// 	jquery: 版本
// 	constructor: 修正指向问题
// 	init(): 初始化和参数管理
// 	selector: 存储选择字符串
// 	length: this对象的长度
// 	toArray(): 转数组方法
// 	get(): 转原生集合
// 	pushStack(): jQ对象的入栈
// 	each(): 遍历集合
// 	ready(): DOM加载的接口
// 	slice(): 集合的截取
// 	first(): 集合的第一项
// 	last(): 集合的最后一项
// 	eq(): 集合的指定项
// 	map(): 返回新集合
// 	end(): 返回集合前一个状态
// 	push(): （内部使用）
// 	sort(): （内部使用）
// 	splice(): （内部使用）
// }

//源码分析



// $(""), $(null), $(undefined), $(false)
// $('#div1') $('.box') $('div') $('#div div.box') $('<li>hello')

// $(this) $(document)
// $(function() {})
// $([]) $({})


jQuery.fn = jQuery.prototype = {
	// 版本
	jquery: core_version,
	// 修正指向问题（以对象字面量方式给prototype属性赋值，会改变constructor属性，指向Object的构造函数）
	constructor: jQuery,
	// 初始化和参数管理
	// selector:可以是任意类型的值，但只有undefined，DOM元素，字符串，函数，jQuery对象，普通js对象这几种类型是有效的，其它类型的值可以接受但没有意义。
	// context:可以不传入，或者传入dom元素、jQuery元素、普通js对象
	// rootjQuery:包含了document对象的jQuery对象，用于document.getElementById()查找失败，selector是选择器表达式且未指定context，selector是函数的情况。
	init: function(selector, context, rootjQuery) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if (!selector) {
			return this;
		}

		// Handle HTML strings
		if (typeof selector === "string") {

			if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
				// 第一个字符为'<'，最后一个字符为'>'，长度大于3 例如 $('<li>') $('<li>1</li><li>2</li>')
				match = [null, selector, null];
				// match = [null,<li>,null],match = [null,<li>1</li><li>2</li>,null]

			} else {
				// 例如 $('#div1') $('.box') $('div') $('#div div.box') $('<li>hello')
				match = rquickExpr.exec(selector);
				// $('.box') $('div') $('#div div.box') match = null;
				// 正则exec在参数匹配中会返回正则子项。
				// $('#div1') $('<li>hello') match = ['#div1',null,'div1'],match = ['<li>hello','<li>',null]
			}

			// 创建标签或id类别
			if (match && (match[1] || !context)) {

				// 创建标签
				if (match[1]) {
					// 先找到要创建标签的上下文document，指定在不同环境下找到根节点（iframe contentWindow.document）
					// $(document)或document
					context = context instanceof jQuery ? context[0] : context;

					// jQuery.parseHTML(str,context,false) 将字符串转为节点数组(字符串，上下文，script能否加入页面)
					// jQuery.merge：数组合并，json合并
					jQuery.merge(this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					));

					// 处理html标签带属性 $(html, props)
					// rsingleTag针对单标签 && 一个对象字面量
					// 例如$('<li></li>',{title:'hi',html:'hello'})
					if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
						for (match in context) {
							// 判断参数在jQuery内部有没有对应的处理函数
							// 例如html 调用jQuery.html()方法
							if (jQuery.isFunction(this[match])) {
								this[match](context[match]);

								// 其他情况直接在标签上加属性
								// 例如title被加到li的属性上
							} else {
								this.attr(match, context[match]);
							}
						}
					}

					return this;

					// 处理 # id
				} else {
					elem = document.getElementById(match[2]);

					// 判断元素存不存在，判断父级的原因是在黑莓4.6情况下元素不在页面内依然能找到
					if (elem && elem.parentNode) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

				// HANDLE: $(expr, $(...))没有执行上下文 或者 上下文是jQ对象 调用find 最终调用sizeele
				// $('ul',$(document)).find('li')
			} else if (!context || context.jquery) {
				return (context || rootjQuery).find(selector);

				// HANDLE: $(expr, context)
				// 上下文不是jQ对象时
				// $('ul',document).find('li')
			} else {
				return this.constructor(context).find(selector);
			}

			// HANDLE: $(DOMElement)
			// 节点类型，根据nodeType判断
		} else if (selector.nodeType) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

			// HANDLE: $(function)
			// 文档加载的便捷方法
			// $(function(){}) , $(document).ready(function(){})
		} else if (jQuery.isFunction(selector)) {
			return rootjQuery.ready(selector);
		}
		//$($('#div'))
		//根据selector判断参数是否为jQ对象
		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}
		//处理$([]) $({})  makeArray将类数组转换为真正数组，第二个参数将数据转成json
		return jQuery.makeArray(selector, this);
	},
	// 存储选择字符串
	selector: "",

	// this对象的长度，根据选择到的元素数量改变
	length: 0,
	// 转数组方法 实例方法，只能给jQ对象使用 ,init中的makeArray是工具方法
	toArray: function() {
		return core_slice.call(this);
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	// 将jQuery对象转原生集合，传参即转某一个，不传则转全部，支持负数从后向前找
	get: function(num) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			(num < 0 ? this[this.length + num] : this[num]);
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	// jQuery对象的入栈
	pushStack: function(elems) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge(this.constructor(), elems);

		// Add the old object onto the stack (as a reference)
		// 在当前栈元素上添加prevObject属性，挂载之前的元素，可通过下面的end方法调用，类似出栈
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret; 
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	// 遍历集合
	each: function(callback, args) {
		return jQuery.each(this, callback, args);
	},
	// DOM加载的接口
	ready: function(fn) {
		// Add the callback
		jQuery.ready.promise().done(fn);

		return this;
	},
	// 集合的截取
	slice: function() {
		return this.pushStack(core_slice.apply(this, arguments));
	},
	// 集合的第一项，内部调用eq
	first: function() {
		return this.eq(0);
	},
	// 集合的最后一项，内部调用eq
	last: function() {
		return this.eq(-1);
	},
	// 集合的指定项，支持负值
	eq: function(i) {
		var len = this.length,
			j = +i + (i < 0 ? len : 0);
		return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
	},
	// 返回新集合
	map: function(callback) {
		return this.pushStack(jQuery.map(this, function(elem, i) {
			return callback.call(elem, i, elem);
		}));
	},
	// 返回集合前一个状态
	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	// jQuery内部使用方法
	//(内部使用)
	push: core_push,
	//(内部使用)
	sort: [].sort,
	//(内部使用)
	splice: [].splice
};



//jQuery.parseHTML
//jQuery.merge
//jQuery.makeArray()
//jQuery.isPlainObject
//jQuery.each
//jQuery.ready
//jQuery.ready.promise
//jQuery.map
//jQuery.find()


$(function(){});
//上面是下面的简写，最终调用的都是ready方法
$(document).ready(function(){})



