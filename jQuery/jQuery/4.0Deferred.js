
//promise对象下属性
//state
//always
//then
//promise
//promise.pipe = promise.then;//代码相同，但功能不同
//done
//fail
//progress



//deferred对象下属性
//resolve
//reject
//notify


//promise.promise( deferred ):将promise里的对象继承到deferred下
//deferred比promise多三个状态属性








//延迟对象 对异步的统一管理
jQuery.extend({//扩展了两个工具方法 Deferred,when
//Deferred基于Callbacks

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				// 状态，回调函数，回调对象，最终状态
				// 回调函数添加到promise下，状态添加到deferred下
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;//取得回调函数列表
					//return promise ，针对pipe 返回一个Deferred.promise对象
					//在jQuery.Deferred里传入一个function，将deferred对象传入并执行
					return jQuery.Deferred(function( newDefer ) {//newDefer 一个全新的deferred对象
						jQuery.each( tuples, function( i, tuple ) {//遍历tuples数组
							var action = tuple[ 0 ],//状态
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];//判断传入的对应回调是否是函数
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {//依次执行done,fail,progress方法
								var returned = fn && fn.apply( this, arguments );//根据状态执行对应的回调函数，arguments是状态传递过来的参数，可以在回调中得到
								//下面与then方法无关，针对pipe
								if ( returned && jQuery.isFunction( returned.promise ) ) {//如果pipe方法返回promise对象
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		// 对映射数组进行遍历操作
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];//状态字符串

			// promise[ done | fail | progress ] = list.add
			// 回调函数
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {//只有完成或未完成才能进入
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
				//如果先走done则对fail.disable，如果是fail，则对done.disable
				//将progress锁住，不允许再触发fire
			}

			// deferred[ resolve | reject | notify ]
			// 状态
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	// 内部通过计数器来实现 根据参数获取延迟对象个数
	// 每触发一次done方法，计数器改变一次，当计数器为0时创建一个Deferred()对象
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),//将arguments转成数组
			length = resolveValues.length,//获取要控制的延迟对象的个数

			// the count of uncompleted subordinates
			// 未完成的计数器
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			// 在done中对计数器进行更行，当计数器为0时触发resolve
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {//计数器减到0时触发延迟对象的resolve
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {//如果多个参数进入到这里
			progressValues = new Array( length );//根据参数个数创建数组
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )//如果延迟对象中有reject发生，立即触发fail方法
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {//如果参数不是延迟对象，将计算器减一
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		// 没有任何等待时，执行resolveWith方法
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});