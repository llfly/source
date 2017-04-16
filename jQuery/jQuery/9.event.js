
//底层方法
//jQuery.event={
//	global 事件的全局属性(源码还没用到)
//	add 绑定一个或多个类型的事件监听函数
//	remove 移除一个或多个类型的事件监听函数
//	trigger 手动触发事件，执行绑定的事件监听函数和默认行为，并且会模拟冒泡过程
//	dispatch 分发事件，执行事件监听函数
//	handlers 函数执行顺序的操作
//	props jQuery中共享原生js的event属性
//	fixHooks 收集event兼容的集合
//	keyHooks 键盘的event兼容
//	mouseHooks 鼠标的event兼容
//	fix 把原生事件对象封装为jQuery事件对象，并修正不兼容属性
//	special 特殊事件的处理
//	simulate 模拟特殊事件 例如trigger dispatch
//}


//jQuery.removeEvent 移除主监听函数

//jQuery.Event 事件对象
// jQuery.Event = function (){
//
// }

//加强版的对象
//jQuery.Event.prototype = {
//	isDefaultPrevented//阻止浏览器默认行为
//	isPropagationStopped//停止事件传播
//	isImmediatePropagationStopped//立即停止事件执行和事件传播
//	preventDefault
//	stopPropagation
//	stopImmediatePropagation
//}




//初始化事件 mouseenter mouseleave submit change focus blur 对应的修正对象
//jQUery.each()

//公开方法
//jQuery.fn.extend({
//on 统一的事件绑定方法
//one 绑定最多执行一次的事件监听函数
//off 统一的事件移除方法
//trigger 手动触发事件监听函数和默认行为
//triggerHandlers 手动触发事件监听函数
//})




//.click()
//.mouseover();


//6720-6750
//hover
//bind
//unbind
//delegate
//undelegate




//1
//	data自定义数据
//	事件缓存 事件缓存对象events
//		type 事件类型
//			监听对象[] handles
//				 deegateCount 代理监听对象的位置计数器
//				 handlerObj监听对象
//				 	type 实际使用的事件类型
//				 	origType 原始事件类型
//				 	data 自定义事件数据
//				 	handler 传入的监听函数
//				 	guid 分配给监听函数的唯一标识guid
//				 	quick 缓存简单选择器表达式的解析结果
//				 	selector 选择器表达式，用于事件代理
//				 	namespace 排序后的命名空间
//数字1，2表示为某个DOM元素分配的唯一id，用来关联对应的数据缓存对象。其中，属性data对应的对象用于存储自定义数据。
//要绑定的监听函数handler(event)会被封装为监听对象handleObj,并附加属性type,origType,data,guid,quick,selector,namespace
//以支持事件模拟，自定义事件数据，事件移除，事件触发，事件代理，事件命名空间等功能。
//同一事件类型type对应的所有监听对象handleObj构成监听对象数组handles，每个事件类型type对应一个监听对象数组handles

//DOM元素关联的数据缓存对象的属性events称为该DOM元素的事件缓存对象，其中存储了该DOM元素的所有事件，存储结构为事件类型type与监听对象数据handles的映射
//DOM元素关联的数据缓存对象的属性handle称为该DOM元素的主监听函数，负责分发事件和执行监听函数。对于一个DOM元素，jQuery事件系统只会为之分配一个主监听函数，并且所有类型的事件在被绑定时，真正会绑定元素上的只有这个主监听函数。
//当调用事件绑定方法on时，监听函数handler被封装为监听对象handleObj，并插入匹配元素所关联的监听对象数组handles中。如果从未在匹配元素上绑定过事件。则先把关联的事件缓存对象events初始化为一个空对象，并为当前元素初始化一个主监听函数handle(event)；
//如果是第一次在匹配元素上绑定某个类型的事件，则先把对应的监听对象数组handlers初始化为一个空数组，并在匹配元素上绑定主监听函数handle
//方法on通过调用底层方法jQuery.event.add方法来实现绑定

//----------------------------------------------------------
//调用关系

//.click() 调用 on trigger
//.mouseover();	调用 on trigger


//hover 调用 click()
//bind  on
//unbind off
//delegate  on
//undelegate off

//one 调用 on


//最终调用 on off trigger


//trigger triggerHandler ==> jQuery.event.trigger
//off ==> jQuery.event.remove
//on ==> jQuery.event.add(封装数据)  ==> jQuery.event.dispatch ==>jQuery.event.fix(对event进行兼容性处理),jQuery.event.special(对事件进行特殊处理),jQuery.event.handlers(执行顺序的队列)


//jQUery.event.fix
//this.mouseHooks
//this.keyHooks
//this.props
//event = new jQuery.Event(originalEvent)

//针对特殊事件的处理
//jQuery.event.special
//load
//focus
//blur
//click
//beforeunload
//mouseenter
//mouseleave
//focusin
//focusout

//noBubble
//delegateType
//_default
//postDispatch 事件触发后会触发
//preDispatch 事件触发前会触发(暂时未用到，只是留接口)
//setup 在add里如果有特殊的绑定先走特殊的，没有的话走公用的addEventListener
//teardown 取消绑定与add一样
//bindType 当前要触发的类型
//handle 具体的兼容处理
//add (暂时未用到，只是留接口)
//remove (暂时未用到，只是留接口)


//----------------------------------------------------------
//事件操作数据
//jQuery事件系统并没有将事件监听函数直接绑定到DOM元素上，而是基于数据缓存模块来管理监听函数的。
//data_priv
//data ele/obj

//on
//off
//trigger



//----------------------------------------------------------
//mouseHooks 针对鼠标的兼容性处理
//	props
//	filter
//keyHooks 针对键盘的兼容性处理


var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */


jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );//第一次回返回空对象{}

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {//!{}也会为true
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;//在函数下加一个guid
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {//真正的事件函数
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];//多个事件写在一起时，通过空格分割
		t = types.length;
		while ( t-- ) {//eg:  on('click.aaa.bbb mouseover mousedown',function(){})
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();//对命名空间进行重新排序

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};//处理特殊情况的事件 eg:mouseenter 通过mouseover模拟 focusin...

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );//handleObjIn内部使用

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {//向对应的事件下添加数组
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				// 对自带事件直接绑定
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {//针对元素，对象不会绑定
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {//通过splice将委托放在前面
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			// 全局type标识  用来做优化，并没软用
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		// 防止内存泄露
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {//events 整个所有的事件数据
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];//click mouseover ...等等
		t = types.length;
		while ( t-- ) {//针对命名空间 例如 .aaa
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {//判断命名空间前有没有type
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];
				//通过guid找到对应事件，从data中删除
				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {//存在selector，是委托，委托计数减一
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {//针对特殊事件
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];//删除缓存中的数据
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {//events为空的话，从数据缓存中删除整个
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		// 判断是否支持冒泡
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {//通过父级一层层查找，push到数组eventPath中
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {//筛选eventPath数组，将满足条件的父节点调用触发

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {//有默认行为且未被阻止时，进行执行默认行为的操作

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {//原生event

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		// 获得调整之后的执行顺序队列
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {//是否阻止冒泡
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {//判断同类

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;
					//让每一个函数进行调用
					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {//函数中如果return false 阻止默认事件和冒泡
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		//队列操作，分为委托和自身的
		//委托的执行顺序高于自身
		//委托层级越远，执行顺序越靠前
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			// 针对键盘which处理
			// ie8以下不支持charCode，一般用keyCode做兼容
			// keypress事件时 keyCode都为0
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		//解决鼠标相关的兼容性的具体操作
		filter: function( event, original ) {//jQuery的event对象，原始的event对象
			var eventDoc, doc, body,
				button = original.button;//存储原生的button属性值，点击鼠标左键右键中键时存在button值

			// Calculate pageX/Y if missing and clientX/Y available
			// pageX/Y 低版本ie不支持
			// clientX/Y 所有浏览器都支持
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;//chrome不支持，用来兼容
				body = eventDoc.body;

				//用clientX + 滚动距离 - clientTop边框高度
				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			// 键盘键值，鼠标键值
			// 低版本不支持which 但支持button，通过button来兼容which
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {//查看缓存
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];//是否有需要兼容的事件

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			//将原生的属性拷贝到jQuery的event上
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		// 移动端开发 deviceready 设备是否准备就绪 没有事件源 做兼容
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		// 低版本chrome safari 事件源的nodeType 为文本时改为父节点
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}
		//执行过滤操作，返回兼容后的event
		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		//原生 focus,blur不能冒泡，这里做处理
		//focus只能加到input这种能获取光标的元素上
		//如果是委托，通过支持冒泡的focusin,focusout来模拟
		//delegateType 针对冒泡形式的特殊事件做兼容
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {//复选框trigger时要被选中
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			// 私有方法,如果是a标签，trigger时候会触发函数但不会跳转
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			//事件执行之后会调用postDispatch
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				// firefox 20+ 以上 要弹出提示必须要设置returnValue
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {//模拟支持冒泡的行为
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );//没有new时 进行new操作 容错处理
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;//原生event
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		// 查看是否有阻止默认行为
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {//属性继承到event
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	// 时间戳
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	// 设置缓存，在fixed里直接使用缓存
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	//是否已经阻止默认事件
	isDefaultPrevented: returnFalse,
	//是否已经阻止冒泡
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	//阻止默认事件
	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {//调用原生preventDefault
			e.preventDefault();
		}
	},
	//阻止冒泡
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {//调用原生的stopPropagation
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;//方法设置为true
		this.stopPropagation();//调用阻止冒泡
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {//将mouseenter和mouseleave挂载到特殊事件上
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {//具体的兼容处理
			var ret,
				target = this,//存储当前对象
				related = event.relatedTarget,//存储前一个对象
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {//是否相等，包不包含
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );//在document上绑定focus，采用捕获的行为
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {//types为object时，将对象进行for-in循环进行拆解
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}
		// 参数顺序修正
		if ( data == null && fn == null ) {//data和fn都为空，也就是.on('click',function(){})的形式，则selector位置为fn
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {//fn为空，selector存在，事件委托，类似于on('click','li',function(){})，则data位置为fn
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {//fn和selector为空，也就是on('click',{name:'llfly'},function(){})的形式，则selector为data，data为fn
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {//针对one方法,只执行一次
			origFn = fn;//存储回调函数
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );//取消事件
				return origFn.apply( this, arguments );//执行一次回调函数
			};
			// Use same guid so caller can remove using origFn
			// 为fn加guid标识，用于remove
			// fn可能是事件函数，可能是普通函数
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		//为每一个事件调用add方法
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


//6720
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
