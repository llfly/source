	access: function(elems, fn, key, value, chainable, emptyGet, raw) {
		var i = 0,
			length = elems.length,
			bulk = key == null;//没有key值时为true

		// Sets many values
		// 设置多组值
		if (jQuery.type(key) === "object") {//key为object，即json
			chainable = true;//将chainable手动设置为true
			for (i in key) {
				jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
			}

			// Sets one value
			// 设置一组值
		} else if (value !== undefined) {
			chainable = true;

			if (!jQuery.isFunction(value)) {
				raw = true;//value不为function
			}

			if (bulk) {//没有key值
				// Bulk operations run against the entire set
				if (raw) {//value为字符串
					fn.call(elems, value);
					fn = null;

					// ...except when executing function values
				} else {//value为function
					bulk = fn;
					fn = function(elem, key, value) {
						return bulk.call(jQuery(elem), value);=
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
			elems :

			// Gets
			bulk ?
			fn.call(elems) :
			length ? fn(elems[0], key) : emptyGet;
	}