//工具方法
//queue  内部使用[].push
//dequeue  内部使用[].shift
//_queueHooks


//实例方法
//queue
//dequeue
//delay
//clearQueue
//promise



jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {//元素存在
			type = ( type || "fx" ) + "queue";//type类型，默认为fx
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {//queue不存在或者是数组时，这也说明了为何会覆盖之前的参数
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {//queue已经存在就调用push方法入队
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";//判断type类型，默认fx

		var queue = jQuery.queue( elem, type ),//先获取
			startLength = queue.length,//获取队列长度
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {//出队操作
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		// 专门针对animation操作
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			// 如果类型为fx在队首添加inprogress
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );//执行fn，将next方法(dequeue)传入
		}

		if ( !startLength && hooks ) {//长度为0，hooks存在时让hooks触发一下fire remove操作
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	// 队列都缓存到data当中，当所有出队都结束时清理掉缓存
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {//判断type类型是否为字符串，如果不是字符串，省略了type类型，可能为数组或函数。
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {//根据arguments长度判断获取还是设置
			return jQuery.queue( this[0], type );//查看第一项元素
		}

		return data === undefined ?//如果data存在就开始遍历
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				//type为fx并且第一项不为inprogress，直接出队。只会在第一次执行
				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );//调用工具方法的出队
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	// 延迟队列执行
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;//判断fx存不存在 在animation 里有key/value 取出对应值
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {//入队操作
			var timeout = setTimeout( next, time );//time后调用next方法
			hooks.stop = function() {//出队后清定时器
				clearTimeout( timeout );
			};
		});
	},
	//清除队列
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	// 当所有队列调用	结束后调用promise
	promise: function( type, obj ) {
		var tmp,
			count = 1,//计数
			defer = jQuery.Deferred(),//定义deferred对象
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});