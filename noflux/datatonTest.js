var State = require('dataton');
var assert = require('assert');


//console.log(State);
/*
{ [Function: State]
  util:
   { push: [Function],
     unshift: [Function],
     pop: [Function],
     shift: [Function],
     sort: [Function],
     reverse: [Function],
     splice: [Function],
     remove: [Function: remove],
     merge: [Function: merge] },
  X_PREFIX: 'x',
  injectPrototype: [Function],
  INNER_FUNC:
   { assign: [Function: assign],
     keyPathsCall: [Function: keyPathsCall] } }
 */


var state = new State({
	name: 'tom',
	profile: {
		gender: 'male'
	}
});

//console.log(state);
// EventEmitter {
//   _config: {},
//   _state: { name: 'jack', profile: { gender: 'male' } },
//   _records: [],
//   _recordIndex: -1 }

//var ns = state.namespace('profile');
//var test = state.cursor('profile');
//console.log(ns);
//{ cursor: [Function] }
//console.log(test);
//{ [Function: ret]
//   get: [Function],
//   update: [Function],
//   mergeUpdate: [Function],
//   cursor: [Function] }


var profile = state.get('profile');
var profilecursor = state.cursorFromObject(profile);
//jack

profilecursor.update('name', 'jack');
//{ name: 'tom', profile: { gender: 'male', name: 'jack' } }

//console.log(state.get('profile.name'));
//console.log(state.cursor());



//assert.equal(state.get('profile.name'), 'jack');





