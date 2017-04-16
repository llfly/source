State.prototype.cursor = function cursor(path, errorplaceholder) {
  var me = this;
  var warn = typeof console !== 'undefined' && console.warn && console.warn.bind(console);

  function ret(subpath) { return ret.get(subpath); }
  function normalize(path) {
    if (!path) path = [];
    if (errorplaceholder) throw Error("cursor doesn't support a second argument");
    if (typeof path !== 'string' && !Array.isArray(path)) throw Error('State.prototype.cursor only accept string or array, ' + (typeof path) + ' is forbidden');
    if (typeof path === 'string') { path = path.split('.'); }
    return path;

  }
  function checkType(val) {
    if (me._config['SKIP_TYPE_CHECK']) return; // for some reason, you may want to store non-plain type data
    if (!isPlainType(val)) warn('You should only update a cursor with Object, Array or other basic types, ' + val.constructor.name + ' is not supported officially! Please fix it or call state.config("SKIP_TYPE_CHECK", true) to skip type-check.');
  }

  path = normalize(path);
  ret.get = function (subpath) {
    if (typeof subpath === 'string') { subpath = subpath.split('.'); }
    return getIn(me, ['_state'].concat(path).concat(typeof subpath === 'undefined' ? [] : subpath));
  };

  // please use `update` to update the cursor pointed value.
  ret.update = function (subpath, value) {
    if (typeof subpath === 'function') {
        var p = ['_state'].concat(path);
        var val = subpath(deepClone(getIn(me, p)));
        checkType(val);
        recursiveAssign(me, p, val);
        return;
    }
    if (arguments.length === 1) { value = subpath; subpath = []; }
    if (typeof subpath === 'string') subpath = subpath.split('.');
    var p = ['_state'].concat(path.concat(subpath));
    var oldvalue = getIn(me, p.concat());

    checkType(value);
    function recursiveAssign(obj, path, val) {
        // 更新p路径上的所有变量的引用
        var i = 1;
        while(i < path.length) {
            var xpath = path.slice(0, i);
            xpath.length && INNER.assign(obj, xpath, merge(getIn(obj, xpath)));
            i++;
        }
        assign(obj, path.concat(), val);
        obj.emit('change', obj._state);
        obj.emit('update', {host: obj, path: path.slice(1), oldval: oldvalue, newval: val});
    }

    if (oldvalue !== value) {
      recursiveAssign(me, p.concat(), value);
    } else {
      me.emit('message', {
        type: "no-update",
        path: p.slice(1), // remove heading '_state'
        value: value
      });
    }
  };

  ret.mergeUpdate = function (value) {
    var changed, changedPaths = [];
    keyPathsCall(value, function(kpath, val) {
        var abspath = ['_state'].concat(path).concat(kpath);
        changed = !(getIn(me, abspath.concat()) === val);
        if (changed) changedPaths.push([abspath.concat(), val]);
    });

    var cached = [], JOIN_MARK = "!@#@";
    changedPaths.forEach(function(conf) {
        // 更新p路径上的所有变量的引用
        var i = 1;
        var p = conf[0];
        var v = conf[1];
        while(i < p.length) {
            var xpath = p.slice(0, i);
            if (cached.indexOf(xpath.join(JOIN_MARK)) > -1) break;
            cached.push(xpath.join(JOIN_MARK));
            xpath.length && INNER.assign(me, xpath, merge(getIn(me, xpath)));
            i++;
        }
        assign(me, p.concat(), v);
        // emit `update` for every endpoint
        me.emit('update', {host: me, path: p.slice(1), oldval: getIn(me, p), newval: v})
    });
    if (changedPaths.length) {
      me.emit('change', me._state);
    } else {
      me.emit('message', {
        type: "no-update-by-merge",
        path: path,
        value: value
      });
    }
  };

  ret.cursor = function (subpath) {
    return cursor(path.concat(normalize(subpath)));
  }
  return ret;
}

return ret => ret.get()



