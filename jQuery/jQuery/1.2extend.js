//jQuery.extend():扩展工具方法(349,817)

//将extend方法扩展到jQuery函数下，扩展静态方法
//再将extend方法扩展到jQuery的原型下面，扩展实例方法

//原型属性和方法


//静态属性和方法

//实例方法
//只能给jQuery对象用，不能给原生js用
$().html
$().css

//静态方法
//在函数下的扩展方法，静态方法，给jQuery扩展静态方法时，就叫做扩展工具方法
//既可以给jQuery对象来用，也可以给原生js用
$.trim()
$.proxy()


//通常在实例方法里调用工具方法


//当只写一个对象字面量的时候，jQuery中扩展插件的形式
// $.extend()
// $.fn.extend()

// //eg:
// //扩展工具方法
// $.extend({
// 	aaa:function(){
// 		alert(1);
// 	},
// 	bbb:function(){
// 		alert(2);
// 	}
// })

// //扩展jQuery实例方法
// $.fn.extend({
// 	aaa:function(){
// 		alert(3);
// 	},
// 	bbb:function(){
// 		alert(4);
// 	}
// })

// $.aaa();
// $.bbb();
// $().aaa();
// $().bbb();

//原理
// $.extend()  -> this = $  ->this.aaa ->$.aaa
// $.fn.extend() -> this = $.fn ->this.aaa ->$().aaa



//当写多个对象字面量的时候，后面的对象都是扩展到第一个对象身上
// var a = {};
// $.extend(a,{name:'hello'},{age:30});
// console.log(a);


// 还可以做 深拷贝 和 浅拷贝
// var a = {};
// var b = {name:'hello',info:{age:20}};

//浅拷贝
// $.extend(a,b);
// a.name = 'hi';
// a.info.age = 10;
// console.log(b.name,b.info.age);//hello,10;

//深拷贝
//$.extend(true,a,b);
// a.name = 'hi';
// a.info.age = 10;
// console.log(b.name,b.info.age);//hello,20;



//浅拷贝
function copy(obj){
    var newOBj = {};
    for(avr attr in obj){
        newObj[attr] = obj[attr];
    }
}


function deepCopy(obj){
    if(typeof obj !='object'){
        return obj;
    }
    var newObj = {};
    for(var attr in obj){
        newObj[attr] = deepCopy(obj[attr]);
    }
    return newObj;
}



// jQuery.extend = jQuery.fn.extend = function(){
//     //定义变量
//     if(){} //看是不是深拷贝情况
//     if(){} //判断参数是否正确
//     if(){} //判断是不是插件情况
//     for(){ //可能有多个对象情况
//         if(){} //防止循环引用
//         if(){} //深拷贝
//         else if(){} //浅拷贝
//     }
// }


jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;//是否为深拷贝

	// Handle a deep copy situation
	// 是不是深拷贝的情况，查看第一个参数是不是boolean值
	if (typeof target === "boolean") {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	// 判断参数是否正确
	if (typeof target !== "object" && !jQuery.isFunction(target)) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	// 判断是不是插件情况
	if (length === i) {
		target = this;
		--i;
	}

	//可能有多个对象情况
	for (; i < length; i++) {
		// Only deal with non-null/undefined values
		if ((options = arguments[i]) != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				// 防止循环引用
				if (target === copy) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
					if (copyIsArray) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[name] = jQuery.extend(deep, clone, copy);

					// Don't bring in undefined values
				} else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};


//jQuery.isPlainObject
//jQuery.isArray

//var a = {name:{job:'monkey'}};
//var b= {name:{age:20}};
//$.extend(true,a,b);
//console.log(a);

//jQuery中使用拷贝继承，js中还可以类式继承，new构造函数  原型继承 prototype 等


