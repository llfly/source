// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	//通过空格分割
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}
/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */

//回调函数，对函数的统一管理


jQuery.Callbacks = function(options){
//options可能值
//once:fire只能触发一次，通过stack 执行后将fn从list中删除
//memory:不管add和fire的顺序，只要有add，fire时都会触发。参数作用到add上
//unique:去重，参数作用到add上
//stopOnFalse:参数作用到fire上

//list = []

//对外提供的公用方法接口
//add:push list
//remove:对指定元素splice操作
//has
//empty
//disable
//disabled
//lock
//locked
//fireWith
//fire -> fireWith -> 局部fire方法(for循环list)
//fired
}





jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	// 判断options参数
	// eg:options = {once:true , memory:true}
	// optionsCache = {'once memory':{once:true , memory:true}}
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;//已经触发
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;//执行回调队列之前，将firing设置为true，设置锁
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;//回调执行完，打开锁
			if ( list ) {
				if ( stack ) {//执行之后检查堆，如果还有就接着依次执行
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {//once时走else，有memory时只是清空list
					list = [];
				} else {
					self.disable();//once时且 memory不存在，阻止后续所有fire操作
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {//空数组 true
					// First, we save the current length
					var start = list.length;//起始位置
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {//遍历每一个fn
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {//是否有唯一标识,数组里是否已经有该元素
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {//如果是数组
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {//第一次为undefined
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			// 判断fn是否在list中
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			// 将list清空
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			// 全部锁住，不允许后续操作
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			// 判断是否被禁止
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			// 将堆锁住
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			// 判断是否被锁住
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {//第一次fired为undefined，一定会进入，fire方法调用后变为true，取决于stack,stack取决于once参数
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];//将执行上下文和参数封装成数组
					if ( firing ) {//如果有回调正在执行，将args压到堆中
						stack.push( args );
					} else {//如果没有回调正在执行，直接触发fire方法
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );//将执行上下文和参数传递给fireWith
				return this;
			},
			// To know if the callbacks have already been called at least once
			// 是否被触发过
			fired: function() {
				return !!fired;
			}
		};

	return self;
};