//主要内部使用，外部可以用Modernizr
//将{}传入，再返回

// support只是用来监测，hooks来解决兼容问题


// checkOn
// optSelected
// reliableMarginRight
// boxSizingReliable
// pixelPosition
// noCloneChecked
// optDisabled
// radioValue
// checkClone
// focusinBubbles
// clearCloneStyle
// cors
// ajax
// boxSizing




jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Finish early in limited environments
	if ( !input.type ) {
		return support;
	}
	//将类型改成checkbox
	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	// 复选框的默认value值为多少？大部分浏览器为on 老版本webkit为空
	// 在4292行进行了兼容
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	// 下拉菜单 默认子项第一项是选中的 但在ie9,10不是
	support.optSelected = opt.selected;

	// Will be defined later
	// 定义一个初始值
	// 检测分为两种，一种是立即能判断，另一种是dom加载后才能判断
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
	// 让复选框选中，将节点clone之后是否依旧被选中，坑爹的ie9,10
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	// 下拉菜单被禁止选中之后，老版本webkit子项也被禁止
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	// 重新创建一个input，单选框
	// 设置value值之后将input类型改成单选框，在ie9,10,11 value会变成on
	input = document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	// 
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );
	//将单选框加入文档碎片
	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	// 老版本webkit下克隆一个文档碎片之后无法返回值
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	// 是否支持onfocusin,ie下支持，firefox,chrome,safari下不支持
	// onfocus 光标移动 没有冒泡机制
	// onfocusin 具有冒泡机制
	support.focusinBubbles = "onfocusin" in window;

	//设置背景剪切
	div.style.backgroundClip = "content-box";
	//克隆一个div,设置背景剪切为空
	div.cloneNode( true ).style.backgroundClip = "";
	//看原有div的背景剪切是否被影响（除了背景剪切之外，任何和背景有关的都有这方面问题）ie9,10,11都会被影响
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	// 创建dom节点做判断
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			// 当前页面是标准模式还是怪异模式，主要影响盒模型
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];
		//判断body存不存在
		if ( !body ) {
			// Return for frameset docs that don't have a body
			// 框架模式的情况下没有body
			return;
		}
		//创建了一个div
		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		// 改成怪异模式
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		// 统一设置zoom值为1，不放大不缩小
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			//看浏览器是否支持boxSizing
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		// nodejs环境下没有getComputedStyle
		if ( window.getComputedStyle ) {
			//safari下返回1%，其他浏览器都是返回像素
			//样式值设置百分比，其他浏览器都转化成像素（是否支持像素定位）
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			//ie9,10,11 false 怪异模式下width会减去padding
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// 新增一个div
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			//修改div的宽度，在webkit老版本下会影响marginDiv的marginRight
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})( {} );

//除此之外还判断了cors和ajax
//7773,7774做了判断
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );//ie9不支持
jQuery.support.ajax = xhrSupported = !!xhrSupported;