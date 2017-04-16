//内部变量
//筛选操作
// $.fn.extend({
// 	find
// 	has
// 	not 调用winnow
// 	filter 调用winnow
// 	is
// 	closest
// 	index
// 	add
// 	addBack
// })


// function sibling(){}

//节点操作
// jQuery.each({
// 	parent
// 	parents
// 	parentsUntil
// 	next
// 	prev
// 	nextAll
// 	prevAll
// 	netxUntil
// 	prevUntil
// 	siblings
// 	children
// 	contents
// })

// jQuery.extend({
// 	filter
// 	dir
// 	sibling
// })

//function winnow( elements, qualifier, not )  ==>  jQuery.filter()
//一些变量

// dom操作
// jQuery.fn.extend({
// 	text
// 	append
// 	prepend
// 	before
// 	after
// 	remove
// 	empty
// 	clone
// 	html
// 	replaceWith
// 	detach
// 	domManip
// })


// jQuery.each({
// 	appendTo:'append',
// 	prependTo:'prepend',
// 	insertBefore:'before',
// 	insertAfter:'after',
// 	replaceAll:'replaceWith'
// })

//内部函数
// jQuery.extend({
// 	clone
// 	buildFragment
// 	cleanData
// 	_evalUrl
// })

// function manipulationTarget(){}
// function disableScript(){}
// function restoreScript(){}
// function setGlobalEval(){}
// function cloneCopyEvent(){}
// function getAll(){}
// function fixInput(){}

//包装接口
// jQuery.fn.extend({
// 	wrapAll
// 	wrapInner
// 	wrap
// 	unwrap
// })



var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function(selector) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if (typeof selector !== "string") {
			return this.pushStack(jQuery(selector).filter(function() {
				for (i = 0; i < len; i++) {
					if (jQuery.contains(self[i], this)) { //判断包含关系
						return true;
					}
				}
			}));
		}

		for (i = 0; i < len; i++) { //通过sizeele，将满足条件的元素存入ret
			jQuery.find(selector, self[i], ret);
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		// 内部使用，对dom节点进行去重
		ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function(target) {
		var targets = jQuery(target, this), //要查找的子元素,this是目标元素
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for (; i < l; i++) {
				if (jQuery.contains(this, targets[i])) { //通过包含关系去筛选
					return true;
				}
			}
		});
	},
	//通过winnow进行入栈，通过第三个参数来区分not和filter
	not: function(selector) {
		return this.pushStack(winnow(this, selector || [], true));
	},

	filter: function(selector) {
		return this.pushStack(winnow(this, selector || [], false));
	},

	is: function(selector) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			// $('div:first').is('div:last')
			typeof selector === "string" && rneedsContext.test(selector) ? //复杂伪类选择器
			jQuery(selector) :
			selector || [],
			false
		).length;
	},

	closest: function(selectors, context) { //筛选条件，作用范围
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = (rneedsContext.test(selectors) || typeof selectors !== "string") ? //将原生转换为jQuery对象
			jQuery(selectors, context || this.context) :
			0; //如果已经是jQuery对象则为0

		for (; i < l; i++) {
			for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) { //通过父级一层层查找
				// Always skip document fragments
				if (cur.nodeType < 11 && (pos ? //不能是文档碎片节点
						pos.index(cur) > -1 : //通过索引值

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors))) { //如果是选择器，通过sizzle查找

					cur = matched.push(cur);
					break;
				}
			}
		}

		return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function(elem) {

		// No argument, return index in parent
		// 没有参数
		if (!elem) {
			//找到当前的第一个节点
			//获取上面的所有兄弟节点的长度
			//没有元素则返回-1
			return (this[0] && this[0].parentNode) ? this.first().prevAll().length : -1;
		}

		// index in selector
		// $('#span3').index('span');
		if (typeof elem === "string") {
			//当前元素在所有的jQuery元素中的位置
			return core_indexOf.call(jQuery(elem), this[0]);
		}

		// Locate the position of the desired element
		// 将上面的情况倒过来，$('span').index($('#span3'))
		return core_indexOf.call(this,
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem
		);
	},

	add: function(selector, context) {
		var set = typeof selector === "string" ? //条件是否是string
			jQuery(selector, context) : //重新获取，jQuery对象
			jQuery.makeArray(selector && selector.nodeType ? [selector] : selector), //如果是元素或者原生，转成数组
			all = jQuery.merge(this.get(), set); //合并成一个整体

		return this.pushStack(jQuery.unique(all)); //重复节点去重后再添加到栈中
	},

	addBack: function(selector) {
		return this.add(selector == null ? //没有值时找当前元素的下一层，和当前的元素合并到一起
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling(cur, dir) {
	while ((cur = cur[dir]) && cur.nodeType !== 1) {}

	return cur;
}

jQuery.each({
	parent: function(elem) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null; //排除文档碎片
	},
	parents: function(elem) {
		return jQuery.dir(elem, "parentNode");
	},
	parentsUntil: function(elem, i, until) {
		return jQuery.dir(elem, "parentNode", until);
	},
	next: function(elem) {
		return sibling(elem, "nextSibling");
	},
	prev: function(elem) {
		return sibling(elem, "previousSibling");
	},
	nextAll: function(elem) {
		return jQuery.dir(elem, "nextSibling");
	},
	prevAll: function(elem) {
		return jQuery.dir(elem, "previousSibling");
	},
	nextUntil: function(elem, i, until) {
		return jQuery.dir(elem, "nextSibling", until);
	},
	prevUntil: function(elem, i, until) {
		return jQuery.dir(elem, "previousSibling", until);
	},
	siblings: function(elem) {
		//获取当前元素的父元素的第一个元素，然后在jQuery.sibling里通过nextSibling遍历
		return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
	},
	children: function(elem) {
		return jQuery.sibling(elem.firstChild); //elem为undefined
	},
	contents: function(elem) {
		//contentDocument  用于跨iframe
		return elem.contentDocument || jQuery.merge([], elem.childNodes); //利用原生的childNodes
	}
}, function(name, fn) {
	//通过jQuery.fn来扩展jQuery对象方法
	jQuery.fn[name] = function(until, selector) {
		var matched = jQuery.map(this, fn, until); //重新遍历

		if (name.slice(-5) !== "Until") { //判断当前function名字存在Until时
			selector = until; //第一个参数作为了筛选条件
		}

		if (selector && typeof selector === "string") {
			matched = jQuery.filter(selector, matched);
		}

		if (this.length > 1) { //有多个元素时
			// Remove duplicates
			if (!guaranteedUnique[name]) { //guaranteedUnique集合是不存在重复情况的
				jQuery.unique(matched); //unique时会对原数据重新排序，所以下面可能需要reverse
			}

			// Reverse order for parents* and prev-derivatives
			if (rparentsprev.test(name)) { //针对parents,prevUntil,prevAll 需要考虑顺序问题
				matched.reverse();
			}
		}
		//筛选完的结果push到栈中
		return this.pushStack(matched);
	};
});

jQuery.extend({
	filter: function(expr, elems, not) { //过滤条件，元素，布尔值
		var elem = elems[0];

		if (not) { //not true filter false
			expr = ":not(" + expr + ")";
		}
		//调用sizzle选择器
		//将筛选结果return
		return elems.length === 1 && elem.nodeType === 1 ?
			//判断元素是一个还是多个
			jQuery.find.matchesSelector(elem, expr) ? [elem] : [] :
			jQuery.find.matches(expr, jQuery.grep(elems, function(elem) { //多个元素 进行筛选 节点类型
				return elem.nodeType === 1;
			}));
	},

	dir: function(elem, dir, until) { //elem:当前要操作的每一个元素 ，dir:原生对应的方法（父级，兄弟节点）,until:节点截止操作位置
		var matched = [], //结果
			truncate = until !== undefined; //是否有截止操作

		while ((elem = elem[dir]) && elem.nodeType !== 9) { //递归调用，不能为document
			if (elem.nodeType === 1) { //元素节点
				if (truncate && jQuery(elem).is(until)) { //匹配截止项
					break;
				}
				matched.push(elem);
			}
		}
		return matched;
	},

	sibling: function(n, elem) {
		var matched = [];

		for (; n; n = n.nextSibling) {
			if (n.nodeType === 1 && n !== elem) { //获取到的节点只能是元素节点 && 不包括自身节点
				matched.push(n);
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
function winnow(elements, qualifier, not) { //elements 元素 qualifier 筛选条件 true or false
	if (jQuery.isFunction(qualifier)) { //判断筛选条件是否是一个function
		return jQuery.grep(elements, function(elem, i) { //调用工具数组筛选方法，将elem和i传入
			/* jshint -W018 */
			return !!qualifier.call(elem, i, elem) !== not;
		});

	}

	if (qualifier.nodeType) { //判断是否是元素
		return jQuery.grep(elements, function(elem) {
			return (elem === qualifier) !== not;
		});

	}

	if (typeof qualifier === "string") { //筛选条件是字符串类型
		//  '/^.[^:#\[\.,]*$/,'起始位置是任意字符，后续不包括:#.,
		//  匹配成功  .box	div 	#div1 	:0dd
		//  匹配不成功 div:odd	ul #li 	ul[title='hello']	div.box ul,ol
		if (isSimple.test(qualifier)) {
			//简单选择可以加:not()方法来区分 not 和 filter
			return jQuery.filter(qualifier, elements, not);
		}
		//复杂选择器不能加:not()操作,所以没有传第三个参数，将所有符合条件的选出
		qualifier = jQuery.filter(qualifier, elements);
	}
	//复杂选择器调用grep 来满足 filter 和 not操作
	//is 为复杂选择器时直接调用全局的qualifier，elem
	return jQuery.grep(elements, function(elem) {
		return (core_indexOf.call(qualifier, elem) >= 0) !== not;
	});
}
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, //传统js中的注释

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [1, "<select multiple='multiple'>", "</select>"],

		thead: [1, "<table>", "</table>"],
		col: [2, "<table><colgroup>", "</colgroup></table>"],
		tr: [2, "<table><tbody>", "</tbody></table>"],
		td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

		_default: [0, "", ""]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function(value) {
		return jQuery.access(this, function(value) {
			return value === undefined ? //value为undefined调用获取
				jQuery.text(this) : //调用工具方法sizzle中的功能 getText 内部通过拼接把所有的文本累加到一起
				this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value)); //先清空，再append，调用原生createTextNode会把value转成文本
		}, null, value, arguments.length);
	},

	append: function() {
		return this.domManip(arguments, function(elem) {
			if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
				var target = manipulationTarget(this, elem);
				target.appendChild(elem);
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, function(elem) {
			if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
				var target = manipulationTarget(this, elem);
				target.insertBefore(elem, target.firstChild);
			}
		});
	},

	before: function() {
		return this.domManip(arguments, function(elem) {
			if (this.parentNode) {
				this.parentNode.insertBefore(elem, this);
			}
		});
	},

	after: function() {
		return this.domManip(arguments, function(elem) {
			if (this.parentNode) {
				this.parentNode.insertBefore(elem, this.nextSibling);
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function(selector, keepData) {
		var elem,
			elems = selector ? jQuery.filter(selector, this) : this, //参数筛选
			i = 0;

		for (;
			(elem = elems[i]) != null; i++) { //针对每一个元素进行处理
			if (!keepData && elem.nodeType === 1) { //remove操作，删除相关数据
				jQuery.cleanData(getAll(elem));
			}

			if (elem.parentNode) {
				if (keepData && jQuery.contains(elem.ownerDocument, elem)) { //detach时调用set方法 dom中有<script></script>时
					setGlobalEval(getAll(elem, "script"));
				}
				elem.parentNode.removeChild(elem);
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for (;
			(elem = this[i]) != null; i++) {
			if (elem.nodeType === 1) {

				// Prevent memory leaks
				jQuery.cleanData(getAll(elem, false)); //清空所有的子元素的缓存数据

				// Remove any remaining nodes
				elem.textContent = ""; //内容置空
			}
		}

		return this;
	},

	clone: function(dataAndEvents, deepDataAndEvents) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
		});
	},

	html: function(value) {
		return jQuery.access(this, function(value) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if (value === undefined && elem.nodeType === 1) { //value为undefined且为元素时直接调用原生innerHTML
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			// value为字符串并且不包含script,link,style标签并且需要符合wrapMap规范,详见wrapMap对象,通过rtagName正则找标签
			if (typeof value === "string" && !rnoInnerhtml.test(value) &&
				!wrapMap[(rtagName.exec(value) || ["", ""])[1].toLowerCase()]) {

				value = value.replace(rxhtmlTag, "<$1></$2>"); //处理单标签非area|br|col|embed|hr|img|input|link|meta|param，<div></div>

				try { //清空原标签内数据
					for (; i < l; i++) {
						elem = this[i] || {};

						// Remove element nodes and prevent memory leaks
						if (elem.nodeType === 1) {
							jQuery.cleanData(getAll(elem, false));
							elem.innerHTML = value;
						}
					}

					elem = 0;

					// If using innerHTML throws an exception, use the fallback method
				} catch (e) {}
			}

			if (elem) { //含有script,link,style时通过append方式添加，与原生的innerHTML不同
				this.empty().append(value);
			}
		}, null, value, arguments.length);
	},

	replaceWith: function() {
		var
		// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map(this, function(elem) {
				return [elem.nextSibling, elem.parentNode];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip(arguments, function(elem) {
			var next = args[i++],
				parent = args[i++];

			if (parent) {
				// Don't use the snapshot next if it has moved (#13810)
				if (next && next.parentNode !== parent) {
					next = this.nextSibling;
				}
				jQuery(this).remove();
				parent.insertBefore(elem, next);
			}
			// Allow new content to include elements from the context set
		}, true);

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function(selector) {
		return this.remove(selector, true);
	},

	domManip: function(args, callback, allowIntersection) {

		// Flatten any nested arrays
		args = core_concat.apply([], args); //获取参数，转成数组

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction(value); //判断value是否是function 例如append(function(){return 'hello'});

		// We can't cloneNode fragments that contain checked, in WebKit
		// 针对文档碎片clone操作不兼容
		if (isFunction || !(l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test(value))) {
			return this.each(function(index) {
				var self = set.eq(index);
				if (isFunction) { //如果是函数，针对每一个目标进行回调处理，回调处理后的结果再一次调用domManip
					args[0] = value.call(this, index, self.html());
				}
				self.domManip(args, callback, allowIntersection);
			});
		}

		if (l) { //元素的长度
			fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, !allowIntersection && this); //文档碎片的创建
			first = fragment.firstChild;

			if (fragment.childNodes.length === 1) {
				fragment = first;
			}

			if (first) {
				scripts = jQuery.map(getAll(fragment, "script"), disableScript); //是否有script标签，获取所有的script标签，进行阻止性操作
				//disableScript通过设置type类型来阻止
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for (; i < l; i++) {
					node = fragment;

					if (i !== iNoClone) {
						node = jQuery.clone(node, true, true); //clone 节点操作

						// Keep references to cloned scripts for later restoration
						if (hasScripts) {
							// Support: QtWebKit
							// jQuery.merge because core_push.apply(_, arraylike) throws
							jQuery.merge(scripts, getAll(node, "script"));
						}
					}

					callback.call(this[i], node, i); //对每一个元素进行回调处理
				}

				if (hasScripts) { //针对script标签，存的是scripts.length，在clone之前的长度,不会对clone出来的标签执行script
					doc = scripts[scripts.length - 1].ownerDocument;

					// Reenable scripts
					jQuery.map(scripts, restoreScript);

					// Evaluate executable scripts on first document insertion
					for (i = 0; i < hasScripts; i++) {
						node = scripts[i];
						if (rscriptType.test(node.type || "") &&
							!data_priv.access(node, "globalEval") && jQuery.contains(doc, node)) {

							if (node.src) { //针对<script src=""></script>  通过ajax调用
								// Hope ajax is available...
								jQuery._evalUrl(node.src);
							} else {
								jQuery.globalEval(node.textContent.replace(rcleanScript, "")); //将传统注释的代码替换为""
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function(name, original) {
	jQuery.fn[name] = function(selector) {
		var elems,
			ret = [],
			insert = jQuery(selector),
			last = insert.length - 1,
			i = 0;

		for (; i <= last; i++) {//针对每一个元素，进行clone操作
			elems = i === last ? this : this.clone(true);
			jQuery(insert[i])[original](elems);//调用对应的jQuery操作

			// Support: QtWebKit
			// .get() because core_push.apply(_, arraylike) throws
			core_push.apply(ret, elems.get());
		}

		return this.pushStack(ret);//将ret压栈，为了后续操作，也就是这些方法存在的意义
	};
});

jQuery.extend({
	clone: function(elem, dataAndEvents, deepDataAndEvents) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode(true), //原生操作，包括子节点，html,但没有事件和数据
			inPage = jQuery.contains(elem.ownerDocument, elem);

		// Support: IE >= 9
		// Fix Cloning issues
		// 判断兼容性
		if (!jQuery.support.noCloneChecked && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll(clone); //获取到所有的clone元素
			srcElements = getAll(elem); //获取到所有的当前元素

			for (i = 0, l = srcElements.length; i < l; i++) {
				fixInput(srcElements[i], destElements[i]);
			}
		}

		// Copy the events from the original to the clone
		if (dataAndEvents) { //clone自身
			if (deepDataAndEvents) { //子项的判断
				srcElements = srcElements || getAll(elem); //getAll取到每一个子项
				destElements = destElements || getAll(clone);

				for (i = 0, l = srcElements.length; i < l; i++) {
					cloneCopyEvent(srcElements[i], destElements[i]);
				}
			} else {
				cloneCopyEvent(elem, clone);
			}
		}

		// Preserve script evaluation history
		// 如果clone包含script标签
		destElements = getAll(clone, "script");
		if (destElements.length > 0) {
			setGlobalEval(destElements, !inPage && getAll(elem, "script")); //将script标签内容全局化
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function(elems, context, scripts, selection) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(), //原生文档创建
			nodes = []; //处理结果，收集创建好的节点

		for (; i < l; i++) { //循环处理elems
			elem = elems[i];

			if (elem || elem === 0) {

				// Add nodes directly
				if (jQuery.type(elem) === "object") { //原生，或者jQuery对象
					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge(nodes, elem.nodeType ? [elem] : elem); //原生 将elem存成数组 ，jQuery的直接使用merge

					// Convert non-html into a text node
				} else if (!rhtml.test(elem)) { //是否有标签存在 纯字符，如'div' 'hello'
					nodes.push(context.createTextNode(elem)); //通过原生createTextNode文本添加

					// Convert html into DOM nodes
					// <h1>hello</h1><span></span>
				} else {
					tmp = tmp || fragment.appendChild(context.createElement("div")); //创建一个div放到文档碎片中

					// Deserialize a standard representation
					tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
					wrap = wrapMap[tag] || wrapMap._default; //wrapMap针对xhtml格式，考虑dom结构是否合理
					tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2]; //通过innerHTML添加

					// Descend through wrappers to the right content
					j = wrap[0]; //通过对wrap变量里的第一个参数，进行层级的循环
					while (j--) {
						tmp = tmp.lastChild; //找到具体指
					}

					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge(nodes, tmp.childNodes);

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					// 清空临时变量
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		// 清除文档碎片
		fragment.textContent = "";

		i = 0;
		while ((elem = nodes[i++])) { //对nodes节点进行循环

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			// 针对domManip方法的第三个参数allowIntersection
			if (selection && jQuery.inArray(elem, selection) !== -1) {
				continue;
			}

			contains = jQuery.contains(elem.ownerDocument, elem);

			// Append to fragment
			// 把elem添加到文档碎片中
			tmp = getAll(fragment.appendChild(elem), "script");

			// Preserve script evaluation history
			if (contains) {
				setGlobalEval(tmp);
			}

			// Capture executables
			if (scripts) { //处理script标签
				j = 0;
				while ((elem = tmp[j++])) {
					if (rscriptType.test(elem.type || "")) {
						scripts.push(elem);
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function(elems) {
		var data, elem, events, type, key, j,
			special = jQuery.event.special, //特殊的event
			i = 0;

		for (;
			(elem = elems[i]) !== undefined; i++) { //根据data_priv去查找当前缓存
			if (Data.accepts(elem)) {
				key = elem[data_priv.expando];

				if (key && (data = data_priv.cache[key])) {
					events = Object.keys(data.events || {});
					if (events.length) { //删除事件
						for (j = 0;
							(type = events[j]) !== undefined; j++) {
							if (special[type]) { //特殊事件，都是通过主动触发模拟的
								jQuery.event.remove(elem, type);

								// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent(elem, type, data.handle);
							}
						}
					}
					if (data_priv.cache[key]) { //清除缓存
						// Discard any remaining `private` data
						delete data_priv.cache[key];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[elem[data_user.expando]];
		}
	},

	_evalUrl: function(url) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});

// Support: 1.x compatibility
// Manipulating tables requires a tbody
// 在table里添加tr时，判断是否有tbody，没有的话创建一个
function manipulationTarget(elem, content) {
	return jQuery.nodeName(elem, "table") &&
		jQuery.nodeName(content.nodeType === 1 ? content : content.firstChild, "tr") ?

		elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody")) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
// 阻止script运行
function disableScript(elem) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
// 恢复script运行
function restoreScript(elem) {
	var match = rscriptTypeMasked.exec(elem.type);

	if (match) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval(elems, refElements) {
	var l = elems.length,
		i = 0;

	for (; i < l; i++) { //通过设置glbalEval 通过refElements开关
		data_priv.set(
			elems[i], "globalEval", !refElements || data_priv.get(refElements[i], "globalEval")
		);
	}
}

function cloneCopyEvent(src, dest) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if (dest.nodeType !== 1) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	// 判断有没有相应的缓存数据
	if (data_priv.hasData(src)) {
		pdataOld = data_priv.access(src);
		pdataCur = data_priv.set(dest, pdataOld);
		events = pdataOld.events;

		if (events) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for (type in events) {
				for (i = 0, l = events[type].length; i < l; i++) {
					jQuery.event.add(dest, type, events[type][i]);
				}
			}
		}
	}

	// 2. Copy user data
	// copy数据
	if (data_user.hasData(src)) {
		udataOld = data_user.access(src);
		udataCur = jQuery.extend({}, udataOld);

		data_user.set(dest, udataCur);
	}
}


function getAll(context, tag) { //getAll(context):获取元素下的所有子元素getAll(context,'span'):也可以传入指定标签 getAll(context,false):不包含自身
	var ret = context.getElementsByTagName ? context.getElementsByTagName(tag || "*") :
		context.querySelectorAll ? context.querySelectorAll(tag || "*") :
		[];

	return tag === undefined || tag && jQuery.nodeName(context, tag) ?
		jQuery.merge([context], ret) :
		ret;
}

// Support: IE >= 9
function fixInput(src, dest) {
	var nodeName = dest.nodeName.toLowerCase(); //存储nodeName input,checkbox时才有问题

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if (nodeName === "input" && manipulation_rcheckableType.test(src.type)) {
		dest.checked = src.checked;

		// Fails to return the selected option to the default selected state when cloning options
	} else if (nodeName === "input" || nodeName === "textarea") { //默认值复制
		dest.defaultValue = src.defaultValue;
	}
}
jQuery.fn.extend({
	wrapAll: function(html) {
		var wrap;

		if (jQuery.isFunction(html)) {//如果是function类型，针对每一个element进行包装
			return this.each(function(i) {
				jQuery(this).wrapAll(html.call(this, i));
			});
		}

		if (this[0]) {

			// The elements to wrap the target around
			wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);//clone节点，事件

			if (this[0].parentNode) {//判断当前元素有没有父级
				wrap.insertBefore(this[0]);
			}

			wrap.map(function() {//多标签时找到最里面的标签 <div><p></p></div>
				var elem = this;

				while (elem.firstElementChild) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function(html) {
		if (jQuery.isFunction(html)) {
			return this.each(function(i) {
				jQuery(this).wrapInner(html.call(this, i));
			});
		}

		return this.each(function() {//找到所有的子元素
			var self = jQuery(this),
				contents = self.contents();

			if (contents.length) {
				contents.wrapAll(html);

			} else {
				self.append(html);
			}
		});
	},

	wrap: function(html) {
		var isFunction = jQuery.isFunction(html);

		return this.each(function(i) {
			jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if (!jQuery.nodeName(this, "body")) {//遇到body不进行删除
				jQuery(this).replaceWith(this.childNodes);
			}
		}).end();
	}
});